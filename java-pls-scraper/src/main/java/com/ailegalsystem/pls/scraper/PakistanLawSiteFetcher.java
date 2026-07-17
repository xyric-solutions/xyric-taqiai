package com.ailegalsystem.pls.scraper;

import com.ailegalsystem.pls.config.AppConfig;
import com.ailegalsystem.pls.model.RawCaseFile;
import com.ailegalsystem.pls.model.WorkItem;
import com.ailegalsystem.pls.retry.NetworkWaiter;
import com.ailegalsystem.pls.retry.RetryPolicy;
import com.ailegalsystem.pls.retry.ScrapeException;
import com.ailegalsystem.pls.util.TextUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.net.ssl.SSLException;
import java.io.IOException;
import java.net.ConnectException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Locale;
import java.util.concurrent.CompletionException;
import java.util.concurrent.TimeoutException;

public final class PakistanLawSiteFetcher {
  private static final Logger log = LoggerFactory.getLogger(PakistanLawSiteFetcher.class);
  private static final URI CASE_FILE = URI.create("https://www.pakistanlawsite.com/Login/GetCaseFile");
  private final AppConfig config;
  private final PlaywrightSessionManager sessionManager;
  private final NetworkWaiter networkWaiter;
  private final RetryPolicy retryPolicy;
  private final HttpClient client;
  private final ObjectMapper mapper = new ObjectMapper();

  public PakistanLawSiteFetcher(AppConfig config, PlaywrightSessionManager sessionManager, NetworkWaiter networkWaiter) {
    this.config = config;
    this.sessionManager = sessionManager;
    this.networkWaiter = networkWaiter;
    this.retryPolicy = new RetryPolicy(config.baseBackoff(), config.maxBackoff(), Math.min(5, config.maxAttempts()));
    this.client = HttpClient.newBuilder()
        .connectTimeout(config.requestTimeout())
        .followRedirects(HttpClient.Redirect.NORMAL)
        .version(HttpClient.Version.HTTP_1_1)
        .build();
  }

  public RawCaseFile fetch(WorkItem item) throws Exception {
    item.validateYearRange(config.fromYear(), config.toYear());
    RawCaseFile main = retryPolicy.run("fetch " + item.caseTypeId(), () -> fetchVariant(item, false));
    String headnotes = "";
    if (config.fetchHeadnotes()) {
      try {
        RawCaseFile head = retryPolicy.run("fetch headnotes " + item.caseTypeId(), () -> fetchVariant(item, true));
        if (head.text() != null && head.text().length() > 80 && !TextUtil.compact(head.text()).equals(TextUtil.compact(main.text()))) {
          headnotes = head.text();
        }
      } catch (Exception error) {
        log.warn("Headnote fetch failed for {}; continuing with main judgment: {}", item.caseTypeId(), error.toString());
      }
    }
    return new RawCaseFile(
        main.item(),
        main.sourceUrl(),
        main.html(),
        main.text(),
        headnotes,
        main.httpStatus(),
        main.elapsedMillis(),
        main.scrapedAt()
    );
  }

  private RawCaseFile fetchVariant(WorkItem item, boolean headnotes) throws Exception {
    networkWaiter.waitUntilOnline(item.caseTypeId());
    String cookie = sessionManager.cookieHeader();
    long started = System.nanoTime();
    String form = "caseName=" + URLEncoder.encode(item.caseTypeId(), StandardCharsets.UTF_8)
        + "&headNotes=" + (headnotes ? "1" : "0");
    HttpRequest request = HttpRequest.newBuilder(CASE_FILE)
        .timeout(config.requestTimeout())
        .header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
        .header("Accept", "application/json, text/plain, */*")
        .header("Origin", "https://www.pakistanlawsite.com")
        .header("Referer", "https://www.pakistanlawsite.com/Login/Check")
        .header("Cookie", cookie)
        .POST(HttpRequest.BodyPublishers.ofString(form))
        .build();
    try {
      HttpResponse<String> response = client.sendAsync(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8))
          .orTimeout(config.requestTimeout().toMillis(), java.util.concurrent.TimeUnit.MILLISECONDS)
          .join();
      return validateResponse(item, response, started);
    } catch (CompletionException error) {
      Throwable cause = error.getCause() == null ? error : error.getCause();
      throw classifyTransport(cause);
    } catch (Exception error) {
      throw classifyTransport(error);
    }
  }

  private RawCaseFile validateResponse(WorkItem item, HttpResponse<String> response, long startedNanos) throws Exception {
    int status = response.statusCode();
    if (status == 403) {
      sessionManager.refreshBrowserAndCookies(true);
      throw ScrapeException.session("PLS returned HTTP 403; refreshed browser session");
    }
    if (status == 429) {
      throw ScrapeException.rateLimited("PLS returned HTTP 429 rate limit");
    }
    if (status >= 500) {
      throw ScrapeException.temporary("PLS server HTTP " + status, null);
    }
    if (status < 200 || status >= 300) {
      throw ScrapeException.temporary("PLS unexpected HTTP " + status, null);
    }

    String html = decodeMaybeJson(response.body());
    String text = TextUtil.norm(Jsoup.parse(html).text());
    if (looksLikeSessionShell(text, html)) {
      sessionManager.refreshBrowserAndCookies(true);
      throw ScrapeException.session("response looks like PakistanLawSite login/search shell");
    }
    if (text.length() < config.minContentLength()) {
      throw ScrapeException.temporary("short content length " + text.length(), null);
    }
    long elapsed = (System.nanoTime() - startedNanos) / 1_000_000L;
    return new RawCaseFile(
        item,
        "https://www.pakistanlawsite.com/Login/GetCaseFile?caseName=" + TextUtil.encoded(item.caseTypeId()) + "&headNotes=0",
        html,
        text,
        "",
        status,
        elapsed,
        Instant.now()
    );
  }

  private String decodeMaybeJson(String raw) {
    String text = raw == null ? "" : raw;
    for (int i = 0; i < 3; i++) {
      String trimmed = text.trim();
      if (!(trimmed.startsWith("\"") || trimmed.startsWith("{") || trimmed.startsWith("["))) {
        break;
      }
      try {
        JsonNode node = mapper.readTree(trimmed);
        if (node.isTextual()) {
          text = node.asText();
          continue;
        }
        if (node.has("d") && node.get("d").isTextual()) {
          text = node.get("d").asText();
          continue;
        }
      } catch (Exception ignored) {
      }
      break;
    }
    return text;
  }

  private boolean looksLikeSessionShell(String text, String html) {
    String combined = (text + " " + html).toLowerCase(Locale.ROOT);
    return combined.contains("case law search")
        && combined.contains("enter keyword")
        && (combined.contains("login") || combined.contains("password") || combined.contains("pakistan law site"));
  }

  private ScrapeException classifyTransport(Throwable error) {
    if (error instanceof ScrapeException scrape) return scrape;
    if (error instanceof TimeoutException) return ScrapeException.temporary("request timed out", error);
    if (error instanceof SSLException) return ScrapeException.temporary("SSL error", error);
    if (error instanceof ConnectException) {
      networkWaiter.waitUntilOnline("connection failure");
      return ScrapeException.temporary("connection failed", error);
    }
    if (error instanceof IOException) {
      networkWaiter.waitUntilOnline("network IO error");
      return ScrapeException.temporary("network IO error", error);
    }
    return ScrapeException.temporary(error.toString(), error);
  }
}
