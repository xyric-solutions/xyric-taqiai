package com.ailegalsystem.pls.retry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.concurrent.Callable;
import java.util.concurrent.ThreadLocalRandom;

public final class RetryPolicy {
  private static final Logger log = LoggerFactory.getLogger(RetryPolicy.class);
  private final Duration baseBackoff;
  private final Duration maxBackoff;
  private final int maxAttempts;

  public RetryPolicy(Duration baseBackoff, Duration maxBackoff, int maxAttempts) {
    this.baseBackoff = baseBackoff;
    this.maxBackoff = maxBackoff;
    this.maxAttempts = maxAttempts;
  }

  public <T> T run(String label, Callable<T> callable) throws Exception {
    Exception last = null;
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return callable.call();
      } catch (ScrapeException error) {
        last = error;
        if (!error.retryable() || attempt >= maxAttempts) throw error;
        sleepBackoff(label, attempt, error);
      } catch (Exception error) {
        last = error;
        if (attempt >= maxAttempts) throw error;
        sleepBackoff(label, attempt, error);
      }
    }
    throw last == null ? new IllegalStateException("Retry failed without captured exception") : last;
  }

  public Duration backoffForFailureCount(int failureCount) {
    int exponent = Math.min(8, Math.max(0, failureCount));
    long millis = Math.min(maxBackoff.toMillis(), baseBackoff.toMillis() * (1L << exponent));
    millis += ThreadLocalRandom.current().nextLong(250, 2000);
    return Duration.ofMillis(millis);
  }

  private void sleepBackoff(String label, int attempt, Exception error) throws InterruptedException {
    Duration wait = backoffForFailureCount(attempt - 1);
    log.warn("{} failed attempt {}/{}: {}; retrying in {}s", label, attempt, maxAttempts, error.toString(), wait.toSeconds());
    Thread.sleep(wait.toMillis());
  }
}
