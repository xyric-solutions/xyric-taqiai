package com.ailegalsystem.pls.parser;

import com.ailegalsystem.pls.config.AppConfig;
import com.ailegalsystem.pls.model.ParsedJudgment;
import com.ailegalsystem.pls.model.RawCaseFile;
import com.ailegalsystem.pls.model.WorkItem;
import com.ailegalsystem.pls.util.TextUtil;
import org.jsoup.Jsoup;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class JudgmentParser {
  private static final Pattern JUDGE_PATTERN = Pattern.compile("\\b(?:Before|Present|Coram|Judge\\(?s?\\)?|Hon'?ble)[:\\- ]+(.{3,180})", Pattern.CASE_INSENSITIVE);
  private static final Pattern BENCH_PATTERN = Pattern.compile("\\b(?:Bench|Division Bench|Full Bench)[:\\- ]+(.{3,160})", Pattern.CASE_INSENSITIVE);
  private static final Pattern DATE_PATTERN = Pattern.compile("\\b(?:Dated|Date of (?:hearing|judgment|decision)|Decided on|Judgment Date)[:\\- ]+([A-Za-z0-9,./\\- ]{6,40})", Pattern.CASE_INSENSITIVE);
  private static final Pattern CASE_NO_PATTERN = Pattern.compile("\\b(?:Case No\\.?|Civil|Criminal|Constitution|Appeal|Revision|Petition|Reference|Suit)\\s*(?:No\\.?|Number)?[:.\\- ]+([A-Za-z0-9/\\-.() ]{3,80})", Pattern.CASE_INSENSITIVE);
  private static final Pattern ADVOCATES_PATTERN = Pattern.compile("\\b(?:Advocate(?:s)?|Counsel|For the petitioner|For the appellant|For the respondent)[:\\- ]+(.{3,240})", Pattern.CASE_INSENSITIVE);
  private static final Pattern SECTION_PATTERN = Pattern.compile("\\b(?:section|sections|s\\.)\\s+([0-9A-Za-z(),/\\- ]{1,80})\\s+(?:of|under)\\s+the\\s+([A-Z][A-Za-z0-9 ,.'()\\-/]{3,100}?(?:Act|Ordinance|Order|Code|Rules?|Regulation))", Pattern.CASE_INSENSITIVE);
  private static final Pattern ACT_PATTERN = Pattern.compile("\\b([A-Z][A-Za-z0-9 ,.'()\\-/]{3,110}?(?:Act|Ordinance|Order|Code|Rules?|Regulation)(?:,?\\s*\\d{4})?)\\b");
  private static final String REPORTERS = "PLD|SCMR|PCRLJ|PCrLJ|MLD|CLC|YLR|PLJ|NLR|CLD|KLR|PTD|PLC";
  private static final Pattern CITATION_PATTERN = Pattern.compile(
      "\\b((?:19[4-9]\\d|20[0-4]\\d)\\s+(?:" + REPORTERS + ")\\s+(?:[A-Z][A-Za-z. ]+\\s+)?\\d+|(?:"
          + REPORTERS + ")\\s+(?:19[4-9]\\d|20[0-4]\\d)\\s+(?:[A-Z][A-Za-z. ]+\\s+)?\\d+)\\b",
      Pattern.CASE_INSENSITIVE
  );

  private final AppConfig config;

  public JudgmentParser(AppConfig config) {
    this.config = config;
  }

  public ParsedJudgment parse(RawCaseFile raw) {
    WorkItem item = raw.item();
    String htmlText = raw.text();
    if ((htmlText == null || htmlText.isBlank()) && raw.html() != null) {
      htmlText = Jsoup.parse(raw.html()).text();
    }
    String text = TextUtil.norm(htmlText);
    String title = firstNonBlank(item.title(), titleFromText(text));
    String citation = firstNonBlank(item.citation(), firstMatch(CITATION_PATTERN, text));
    String court = TextUtil.normalizeCourt(item.court());
    int year = item.year() != 0 ? item.year() : TextUtil.yearFrom(citation + " " + text, 0);
    if (year < config.fromYear() || year > config.toYear()) {
      throw new IllegalArgumentException("Parser refused out-of-range year " + year + " for " + item.caseTypeId() + " range=" + config.fromYear() + "-" + config.toYear());
    }

    Set<String> sections = new LinkedHashSet<>();
    Set<String> acts = new LinkedHashSet<>();
    Matcher sectionMatcher = SECTION_PATTERN.matcher(text);
    while (sectionMatcher.find() && sections.size() < 60) {
      sections.add(TextUtil.norm(sectionMatcher.group(1)));
      acts.add(TextUtil.norm(sectionMatcher.group(2)));
    }
    Matcher actMatcher = ACT_PATTERN.matcher(text);
    while (actMatcher.find() && acts.size() < 80) {
      acts.add(TextUtil.norm(actMatcher.group(1)));
    }

    String parties = parties(title);
    String headnotes = firstNonBlank(raw.headnoteText(), headnotesFromText(text));
    List<String> allCitations = allCitations(text);
    List<String> equivalentCitations = equivalentCitations(allCitations, citation);
    List<String> keywords = keywords(title, citation, court, item.category(), acts);
    Map<String, Object> metadata = new LinkedHashMap<>();
    metadata.put("caseTypeId", item.caseTypeId());
    metadata.put("category", item.category());
    metadata.put("rowNo", item.rowNo());
    metadata.put("source", "PakistanLawSite");
    metadata.put("sourceUrl", raw.sourceUrl());
    metadata.put("httpStatus", raw.httpStatus());
    metadata.put("elapsedMillis", raw.elapsedMillis());
    metadata.put("contentLength", raw.contentLength());
    metadata.put("htmlLength", raw.htmlLength());
    metadata.put("allCitations", allCitations);
    metadata.put("equivalentCitations", equivalentCitations);
    metadata.put("rawHtmlPreview", TextUtil.summary(raw.html(), 2000));

    return new ParsedJudgment(
        item.caseTypeId(),
        title,
        citation,
        equivalentCitations,
        TextUtil.stableCitation(config.citationPrefix(), item.caseTypeId()),
        court,
        firstMatch(BENCH_PATTERN, text),
        firstMatch(JUDGE_PATTERN, text),
        firstMatch(DATE_PATTERN, text),
        year,
        firstMatch(CASE_NO_PATTERN, text),
        new ArrayList<>(acts),
        new ArrayList<>(sections),
        new ArrayList<>(acts),
        keywords,
        headnotes,
        TextUtil.summary(text, 700),
        text,
        parties,
        firstMatch(ADVOCATES_PATTERN, text),
        raw.sourceUrl(),
        item.category(),
        raw.httpStatus(),
        raw.contentLength(),
        raw.htmlLength(),
        raw.elapsedMillis(),
        raw.scrapedAt(),
        metadata
    );
  }

  private static String titleFromText(String text) {
    String[] pieces = text.split("\\s{2,}|(?<=\\.)\\s+");
    for (String piece : pieces) {
      String p = TextUtil.norm(piece);
      if (p.length() >= 8 && p.length() <= 220 && p.matches("(?i).*\\b(vs\\.?|versus|v\\.)\\b.*")) {
        return p;
      }
    }
    return null;
  }

  private static String headnotesFromText(String text) {
    Matcher matcher = Pattern.compile("\\b(?:Headnote|Held|Held that)[:\\- ]+(.{80,1800})", Pattern.CASE_INSENSITIVE).matcher(text);
    return matcher.find() ? TextUtil.norm(matcher.group(1)) : null;
  }

  private static String parties(String title) {
    String normalized = TextUtil.norm(title);
    if (normalized.isBlank()) return null;
    String[] parts = normalized.split("(?i)\\s+(?:vs\\.?|versus|v\\.)\\s+", 2);
    if (parts.length == 2) {
      return TextUtil.norm(parts[0]) + " || " + TextUtil.norm(parts[1]);
    }
    return normalized;
  }

  private static List<String> allCitations(String text) {
    Set<String> citations = new LinkedHashSet<>();
    Matcher matcher = CITATION_PATTERN.matcher(text == null ? "" : text);
    while (matcher.find() && citations.size() < 100) {
      citations.add(TextUtil.norm(matcher.group(1)));
    }
    return new ArrayList<>(citations);
  }

  private static List<String> equivalentCitations(List<String> allCitations, String primaryCitation) {
    String primary = TextUtil.compact(primaryCitation);
    List<String> out = new ArrayList<>();
    for (String citation : allCitations) {
      if (primary != null && !primary.isBlank() && TextUtil.compact(citation).equals(primary)) continue;
      out.add(citation);
    }
    return out;
  }

  private static List<String> keywords(String title, String citation, String court, String category, Set<String> acts) {
    Set<String> words = new LinkedHashSet<>();
    for (String seed : new String[] { title, citation, court, category }) {
      for (String part : TextUtil.norm(seed).split("[^A-Za-z0-9]+")) {
        String lower = part.toLowerCase(Locale.ROOT);
        if (lower.length() >= 4 && words.size() < 40) words.add(lower);
      }
    }
    for (String act : acts) {
      if (words.size() >= 60) break;
      words.add(TextUtil.summary(act.toLowerCase(Locale.ROOT), 60));
    }
    return new ArrayList<>(words);
  }

  private static String firstMatch(Pattern pattern, String text) {
    Matcher matcher = pattern.matcher(text == null ? "" : text);
    if (!matcher.find()) return null;
    return TextUtil.nullIfBlank(matcher.group(1));
  }

  private static String firstNonBlank(String... values) {
    for (String value : values) {
      String normalized = TextUtil.nullIfBlank(value);
      if (normalized != null) return normalized;
    }
    return null;
  }
}
