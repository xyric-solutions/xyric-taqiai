package com.ailegalsystem.pls.scraper;

import com.ailegalsystem.pls.config.AppConfig;
import com.ailegalsystem.pls.db.Database;
import com.ailegalsystem.pls.model.InsertResult;
import com.ailegalsystem.pls.model.ParsedJudgment;
import com.ailegalsystem.pls.model.RawCaseFile;
import com.ailegalsystem.pls.model.ScraperStatus;
import com.ailegalsystem.pls.model.WorkItem;
import com.ailegalsystem.pls.parser.JudgmentParser;
import com.ailegalsystem.pls.progress.ProgressManager;
import com.ailegalsystem.pls.retry.NetworkWaiter;
import com.ailegalsystem.pls.retry.ScrapeException;
import com.ailegalsystem.pls.util.WindowsSleepPreventer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

public final class PakistanLawSiteScraper {
  private static final Logger log = LoggerFactory.getLogger(PakistanLawSiteScraper.class);
  private final AppConfig config;
  private final Database database;
  private final ProgressManager progressManager;
  private final PlaywrightSessionManager sessionManager;
  private final PakistanLawSiteFetcher fetcher;
  private final JudgmentParser parser;
  private final AtomicBoolean stop = new AtomicBoolean(false);
  private final AtomicInteger inserted = new AtomicInteger();
  private final AtomicInteger duplicates = new AtomicInteger();
  private final AtomicInteger failed = new AtomicInteger();
  private final EmptyResponseCircuitBreaker emptyCircuit;

  public PakistanLawSiteScraper(AppConfig config) {
    this.config = config;
    this.database = new Database(config);
    this.progressManager = new ProgressManager(config);
    this.sessionManager = new PlaywrightSessionManager(config);
    NetworkWaiter networkWaiter = new NetworkWaiter();
    this.fetcher = new PakistanLawSiteFetcher(config, sessionManager, networkWaiter);
    this.parser = new JudgmentParser(config);
    this.emptyCircuit = new EmptyResponseCircuitBreaker(config.emptyResponseThreshold(), config.emptyResponseWindow(), config.emptyResponseCooldown());
  }

  public void run() throws Exception {
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      stop.set(true);
      log.warn("Shutdown requested; workers will stop after current item and resume later from PostgreSQL checkpoint");
    }));

    try (WindowsSleepPreventer ignored = WindowsSleepPreventer.enable(config.keepDisplayAwake())) {
      database.ensureSchema();
      List<WorkItem> worklist = progressManager.loadWorklist();
      database.upsertWorklist(worklist);
      database.resetStaleRunning();
      sessionManager.refreshBrowserAndCookies(false);

      ScraperStatus start = database.status();
      log.info("Starting Java PLS scraper {} totalFound={} completed={} remaining={} retry={} failedManualReview={}",
          config.rangeSlug(),
          start.total(), start.completed(), start.remaining(), start.retry(), start.manualReview());

      ExecutorService executor = Executors.newFixedThreadPool(config.workers());
      for (int i = 1; i <= config.workers(); i++) {
        int workerId = i;
        executor.submit(() -> workerLoop(workerId));
      }
      executor.shutdown();
      while (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
        ScraperStatus status = database.status();
        log.info("Progress range={} totalFound={} successfullyImportedOrSkipped={} remaining={} pending={} retry={} running={} failedManualReview={} insertedThisRun={} skippedDuplicatesThisRun={} failedThisRun={}",
            config.rangeSlug(),
            status.total(), status.completed(), status.remaining(), status.pending(), status.retry(), status.running(),
            status.manualReview(), inserted.get(), duplicates.get(), failed.get());
      }

      ScraperStatus end = database.status();
      log.info("Finished Java PLS scraper range={} totalFound={} successfullyImportedOrSkipped={} remaining={} failedManualReview={} insertedThisRun={} skippedDuplicatesThisRun={} failedThisRun={}",
          config.rangeSlug(),
          end.total(), end.completed(), end.remaining(), end.manualReview(), inserted.get(), duplicates.get(), failed.get());
    } finally {
      sessionManager.close();
      database.close();
    }
  }

  private void workerLoop(int workerId) {
    log.info("Worker {} started", workerId);
    while (!stop.get() && !Thread.currentThread().isInterrupted()) {
      try {
        emptyCircuit.waitIfCooling(workerId);
        List<WorkItem> batch = database.leaseBatch(config.batchSize());
        if (batch.isEmpty()) {
          ScraperStatus status = database.status();
          if (status.remaining() <= 0) {
            stop.set(true);
            return;
          }
          log.info("Worker {} waiting for retry window; remaining={} retry={}", workerId, status.remaining(), status.retry());
          sleep(Duration.ofSeconds(15));
          continue;
        }
        for (WorkItem item : batch) {
          if (stop.get()) return;
          processItem(workerId, item);
        }
      } catch (Exception error) {
        log.error("Worker {} unexpected error; continuing after cooldown", workerId, error);
        sleep(Duration.ofSeconds(10));
      }
    }
  }

  private void processItem(int workerId, WorkItem item) {
    try {
      log.info("Worker {} scraping year={} row={} case={} citation={}", workerId, item.year(), item.rowNo(), item.caseTypeId(), item.citation());
      RawCaseFile raw = fetcher.fetch(item);
      ParsedJudgment parsed = parser.parse(raw);
      InsertResult result = database.insertOrSkip(parsed);
      if (result.inserted()) {
        inserted.incrementAndGet();
        log.info("INSERTED worker={} case={} judgmentId={} citation={} contentLength={}",
            workerId, parsed.caseTypeId(), result.legalJudgmentId(), parsed.citation(), parsed.contentLength());
      } else {
        duplicates.incrementAndGet();
        log.info("DUPLICATE worker={} case={} existingJudgmentId={} citation={}",
            workerId, parsed.caseTypeId(), result.legalJudgmentId(), parsed.citation());
      }
    } catch (ScrapeException error) {
      handleScrapeFailure(workerId, item, error);
    } catch (Exception error) {
      failed.incrementAndGet();
      log.error("Unexpected failure worker={} case={}; saved for retry", workerId, item.caseTypeId(), error);
      try {
        database.markFailure(item, error, false);
      } catch (Exception dbError) {
        log.error("Could not persist failure for {}", item.caseTypeId(), dbError);
      }
    }
  }

  private void handleScrapeFailure(int workerId, WorkItem item, ScrapeException error) {
    failed.incrementAndGet();
    if (error.sessionRelated()) {
      log.warn("Session issue worker={} case={}: {}; restarting browser session", workerId, item.caseTypeId(), error.getMessage());
      try {
        sessionManager.refreshBrowserAndCookies(true);
      } catch (Exception refreshError) {
        log.warn("Browser session refresh failed; will retry later: {}", refreshError.toString());
      }
    }
    if (error.rateLimited()) {
      log.warn("Rate limit worker={} case={}; cooling down", workerId, item.caseTypeId());
      sleep(Duration.ofMinutes(3));
    }
    if (error.getMessage() != null && error.getMessage().contains("short content length")) {
      emptyCircuit.record(workerId, item.caseTypeId());
    }
    try {
      database.markFailure(item, error, false);
    } catch (Exception dbError) {
      log.error("Could not persist retry failure for {}", item.caseTypeId(), dbError);
    }
  }

  private void sleep(Duration duration) {
    try {
      Thread.sleep(duration.toMillis());
    } catch (InterruptedException interrupted) {
      Thread.currentThread().interrupt();
      stop.set(true);
    }
  }

  private final class EmptyResponseCircuitBreaker {
    private final int threshold;
    private final Duration window;
    private final Duration cooldown;
    private final java.util.ArrayDeque<Instant> emptyResponses = new java.util.ArrayDeque<>();
    private Instant pausedUntil = Instant.EPOCH;

    private EmptyResponseCircuitBreaker(int threshold, Duration window, Duration cooldown) {
      this.threshold = threshold;
      this.window = window;
      this.cooldown = cooldown;
    }

    synchronized void record(int workerId, String caseTypeId) {
      Instant now = Instant.now();
      emptyResponses.addLast(now);
      while (!emptyResponses.isEmpty() && emptyResponses.peekFirst().isBefore(now.minus(window))) {
        emptyResponses.removeFirst();
      }
      if (emptyResponses.size() >= threshold) {
        pausedUntil = now.plus(cooldown);
        emptyResponses.clear();
        log.warn("Worker {} triggered empty-response cooldown after {}; pausing until {}", workerId, caseTypeId, pausedUntil);
      }
    }

    void waitIfCooling(int workerId) {
      while (Instant.now().isBefore(pausedUntil) && !stop.get()) {
        long seconds = Duration.between(Instant.now(), pausedUntil).toSeconds();
        log.warn("Worker {} cooling after repeated empty PLS responses; resumes in {}s", workerId, Math.max(1, seconds));
        sleep(Duration.ofSeconds(Math.min(10, Math.max(1, seconds))));
      }
    }
  }
}
