package com.ailegalsystem.pls.model;

public record ScraperStatus(
    int total,
    int completed,
    int pending,
    int retry,
    int running,
    int manualReview
) {
  public int remaining() {
    return pending + retry + running;
  }
}
