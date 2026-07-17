package com.ailegalsystem.pls.model;

import java.time.Instant;

public record RawCaseFile(
    WorkItem item,
    String sourceUrl,
    String html,
    String text,
    String headnoteText,
    int httpStatus,
    long elapsedMillis,
    Instant scrapedAt
) {
  public int contentLength() {
    return text == null ? 0 : text.length();
  }

  public int htmlLength() {
    return html == null ? 0 : html.length();
  }
}
