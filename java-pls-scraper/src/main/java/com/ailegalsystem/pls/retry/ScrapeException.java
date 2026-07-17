package com.ailegalsystem.pls.retry;

public class ScrapeException extends Exception {
  private final boolean retryable;
  private final boolean sessionRelated;
  private final boolean rateLimited;

  public ScrapeException(String message, boolean retryable, boolean sessionRelated, boolean rateLimited) {
    super(message);
    this.retryable = retryable;
    this.sessionRelated = sessionRelated;
    this.rateLimited = rateLimited;
  }

  public ScrapeException(String message, Throwable cause, boolean retryable, boolean sessionRelated, boolean rateLimited) {
    super(message, cause);
    this.retryable = retryable;
    this.sessionRelated = sessionRelated;
    this.rateLimited = rateLimited;
  }

  public boolean retryable() {
    return retryable;
  }

  public boolean sessionRelated() {
    return sessionRelated;
  }

  public boolean rateLimited() {
    return rateLimited;
  }

  public static ScrapeException temporary(String message, Throwable cause) {
    return new ScrapeException(message, cause, true, false, false);
  }

  public static ScrapeException session(String message) {
    return new ScrapeException(message, true, true, false);
  }

  public static ScrapeException rateLimited(String message) {
    return new ScrapeException(message, true, false, true);
  }
}
