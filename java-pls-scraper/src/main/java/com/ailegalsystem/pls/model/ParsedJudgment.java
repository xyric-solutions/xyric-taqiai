package com.ailegalsystem.pls.model;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ParsedJudgment(
    String caseTypeId,
    String caseTitle,
    String citation,
    List<String> equivalentCitations,
    String plsCitation,
    String court,
    String bench,
    String judges,
    String decisionDate,
    int year,
    String caseNumber,
    List<String> statutes,
    List<String> sections,
    List<String> acts,
    List<String> keywords,
    String headnotes,
    String shortSummary,
    String fullText,
    String parties,
    String advocates,
    String sourceUrl,
    String category,
    int httpStatus,
    int contentLength,
    int htmlLength,
    long elapsedMillis,
    Instant scrapedAt,
    Map<String, Object> metadata
) {
}
