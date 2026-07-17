package com.ailegalsystem.pls.util;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class TextUtil {
  private static final Pattern YEAR = Pattern.compile("\\b(19[4-9]\\d|20[0-4]\\d)\\b");

  private TextUtil() {
  }

  public static String norm(String value) {
    return value == null ? "" : value.replaceAll("\\s+", " ").trim();
  }

  public static String nullIfBlank(String value) {
    String normalized = norm(value);
    return normalized.isBlank() ? null : normalized;
  }

  public static String sanitizeKey(String value) {
    String key = norm(value).replaceAll("[^A-Za-z0-9]+", "_").replaceAll("^_+|_+$", "");
    return key.length() > 100 ? key.substring(0, 100) : key;
  }

  public static String compact(String value) {
    return norm(value).replaceAll("[^A-Za-z0-9]+", "").toLowerCase(Locale.ROOT);
  }

  public static String stableCitation(String prefix, String caseTypeId) {
    return prefix + "_" + sanitizeKey(caseTypeId);
  }

  public static String sha1Short(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-1");
      return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8))).substring(0, 12);
    } catch (Exception error) {
      throw new IllegalStateException(error);
    }
  }

  public static String normalizeCourt(String court) {
    String raw = norm(court);
    if (raw.isBlank()) return "Supreme Court of Pakistan";
    if (raw.equalsIgnoreCase("SUPREME-COURT") || raw.toLowerCase(Locale.ROOT).contains("supreme")) {
      return "Supreme Court of Pakistan";
    }
    String[] parts = raw.toLowerCase(Locale.ROOT).split("[-_\\s]+");
    StringBuilder out = new StringBuilder();
    for (String part : parts) {
      if (part.isBlank()) continue;
      if (!out.isEmpty()) out.append(' ');
      out.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
    }
    return out.toString();
  }

  public static String courtLevel(String court) {
    String lower = norm(court).toLowerCase(Locale.ROOT);
    if (lower.contains("supreme court")) return "Supreme Court";
    if (lower.contains("high court")) return "High Court";
    if (lower.contains("shariat")) return "Federal Shariat Court";
    if (lower.contains("board of revenue")) return "Board of Revenue";
    if (lower.contains("tribunal")) return "Tribunal";
    return null;
  }

  public static String reporter(String citation, String category) {
    Matcher matcher = Pattern.compile("\\b(SCMR|PLD|PCRLJ|PCrLJ|MLD|CLC|YLR|PLJ|NLR|CLD|KLR|PTD)\\b", Pattern.CASE_INSENSITIVE)
        .matcher(norm(citation));
    if (matcher.find()) return matcher.group(1).toUpperCase(Locale.ROOT);
    return nullIfBlank(category == null ? null : category.toUpperCase(Locale.ROOT));
  }

  public static int yearFrom(String text, int fallback) {
    Matcher matcher = YEAR.matcher(norm(text));
    return matcher.find() ? Integer.parseInt(matcher.group(1)) : fallback;
  }

  public static String summary(String text, int limit) {
    String normalized = norm(text);
    if (normalized.length() <= limit) return normalized;
    int end = normalized.lastIndexOf(' ', limit);
    if (end < limit / 2) end = limit;
    return normalized.substring(0, end).trim();
  }

  public static String encoded(String value) {
    return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
  }
}
