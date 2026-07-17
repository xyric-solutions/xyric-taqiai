package com.ailegalsystem.pls.config;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public final class EnvFile {
  private EnvFile() {
  }

  public static Map<String, String> load(Path path) throws IOException {
    Map<String, String> values = new HashMap<>();
    if (!Files.exists(path)) {
      return values;
    }
    for (String line : Files.readAllLines(path, StandardCharsets.UTF_8)) {
      String trimmed = line.trim();
      if (trimmed.isEmpty() || trimmed.startsWith("#")) {
        continue;
      }
      int eq = trimmed.indexOf('=');
      if (eq <= 0) {
        continue;
      }
      String key = trimmed.substring(0, eq).trim();
      String value = trimmed.substring(eq + 1).trim();
      if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length() - 1);
      }
      values.put(key, value);
    }
    return values;
  }

  public static String urlDecode(String value) {
    return URLDecoder.decode(value == null ? "" : value, StandardCharsets.UTF_8);
  }
}
