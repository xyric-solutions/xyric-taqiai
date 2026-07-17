package com.ailegalsystem.pls.config;

import java.net.URI;
import java.nio.file.Path;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public record AppConfig(
    int fromYear,
    int toYear,
    int workers,
    int batchSize,
    int maxAttempts,
    int minContentLength,
    Duration requestTimeout,
    Duration staleLeaseAfter,
    Duration baseBackoff,
    Duration maxBackoff,
    Duration emptyResponseCooldown,
    int emptyResponseThreshold,
    Duration emptyResponseWindow,
    Path envPath,
    Path worklistPath,
    Path browserProfileDir,
    boolean headless,
    boolean fetchHeadnotes,
    boolean keepDisplayAwake,
    String source,
    String citationPrefix,
    DatabaseConfig database
) {
  private static final Set<String> PG_JDBC_PARAMS = Set.of(
      "ssl",
      "sslmode",
      "connectTimeout",
      "socketTimeout",
      "loginTimeout",
      "tcpKeepAlive",
      "ApplicationName",
      "reWriteBatchedInserts",
      "targetServerType"
  );

  public static AppConfig fromArgs(String[] args) throws Exception {
    Map<String, String> cli = parseArgs(args);
    Path moduleRoot = Path.of("").toAbsolutePath();
    Path appRoot = moduleRoot.getParent() == null ? moduleRoot : moduleRoot.getParent();
    Path repoRoot = appRoot.getParent() == null ? appRoot : appRoot.getParent();

    Path env = Path.of(cli.getOrDefault("env", appRoot.resolve(".env").toString())).toAbsolutePath().normalize();
    Map<String, String> envValues = EnvFile.load(env);
    String databaseUrl = firstNonBlank(cli.get("database-url"), System.getenv("DATABASE_URL"), envValues.get("DATABASE_URL"));
    if (databaseUrl == null || !databaseUrl.toLowerCase(Locale.ROOT).startsWith("postgres")) {
      throw new IllegalArgumentException("DATABASE_URL must be a PostgreSQL URL in .env or --database-url");
    }

    int from = parseInt(cli, "from", 1981);
    int to = parseInt(cli, "to", 1990);
    if (from < 1947 || to > 2049 || to < from) {
      throw new IllegalArgumentException("Invalid PakistanLawSite year range. Expected 1947 <= --from <= --to <= 2049.");
    }

    int workers = clamp(parseInt(cli, "workers", 4), 1, 8);
    int batch = clamp(parseInt(cli, "batch", 1), 1, 10);
    int maxAttempts = clamp(parseInt(cli, "max-attempts", 10), 1, 100);
    int minContent = clamp(parseInt(cli, "min-content-length", 500), 100, 10_000);
    boolean headless = parseBool(cli, "headless", false);
    boolean fetchHeadnotes = parseBool(cli, "fetch-headnotes", true);
    boolean keepDisplayAwake = parseBool(cli, "keep-display-awake", false);

    Path worklist = Path.of(cli.getOrDefault(
        "worklist",
        repoRoot.resolve("data").resolve("pls_all_courts_" + rangeSlug(from, to) + "_worklist.json").toString()
    )).toAbsolutePath().normalize();
    Path browserProfile = Path.of(cli.getOrDefault(
        "browser-profile",
        repoRoot.resolve("data").resolve("pls-java-playwright-profile").toString()
    )).toAbsolutePath().normalize();

    return new AppConfig(
        from,
        to,
        workers,
        batch,
        maxAttempts,
        minContent,
        Duration.ofSeconds(parseInt(cli, "request-timeout-seconds", 60)),
        Duration.ofMinutes(parseInt(cli, "stale-lease-minutes", 10)),
        Duration.ofSeconds(parseInt(cli, "base-backoff-seconds", 45)),
        Duration.ofMinutes(parseInt(cli, "max-backoff-minutes", 30)),
        Duration.ofSeconds(parseInt(cli, "empty-cooldown-seconds", 120)),
        clamp(parseInt(cli, "empty-threshold", 20), 1, 500),
        Duration.ofSeconds(parseInt(cli, "empty-window-seconds", 60)),
        env,
        worklist,
        browserProfile,
        headless,
        fetchHeadnotes,
        keepDisplayAwake,
        cli.getOrDefault("source", "pakistanlawsite"),
        cli.getOrDefault("citation-prefix", "PLS_" + rangeSlug(from, to)),
        databaseConfig(databaseUrl)
    );
  }

  public String rangeSlug() {
    return rangeSlug(fromYear, toYear);
  }

  public String scraperName() {
    return "pls-java-" + rangeSlug();
  }

  private static String rangeSlug(int from, int to) {
    return from == to ? String.valueOf(from) : from + "_" + to;
  }

  private static Map<String, String> parseArgs(String[] args) {
    Map<String, String> out = new LinkedHashMap<>();
    for (int i = 0; i < args.length; i++) {
      String arg = args[i];
      if (!arg.startsWith("--")) {
        throw new IllegalArgumentException("Unknown argument: " + arg);
      }
      String key = arg.substring(2);
      if (key.equals("help")) {
        out.put("help", "true");
        continue;
      }
      if (key.equals("headless") || key.equals("fetch-headnotes") || key.equals("keep-display-awake")) {
        out.put(key, "true");
        continue;
      }
      if (i + 1 >= args.length) {
        throw new IllegalArgumentException("Missing value after " + arg);
      }
      out.put(key, args[++i]);
    }
    return out;
  }

  private static DatabaseConfig databaseConfig(String databaseUrl) throws Exception {
    URI uri = URI.create(databaseUrl.replaceFirst("^postgresql://", "postgres://"));
    String user = null;
    String password = null;
    if (uri.getRawUserInfo() != null) {
      String[] parts = uri.getRawUserInfo().split(":", 2);
      user = EnvFile.urlDecode(parts[0]);
      password = parts.length > 1 ? EnvFile.urlDecode(parts[1]) : "";
    }
    String host = uri.getHost();
    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
    String db = uri.getRawPath() == null || uri.getRawPath().isBlank() ? "" : uri.getRawPath();
    Map<String, String> params = new LinkedHashMap<>();
    if (uri.getRawQuery() != null) {
      for (String pair : uri.getRawQuery().split("&")) {
        String[] kv = pair.split("=", 2);
        String key = EnvFile.urlDecode(kv[0]);
        if (PG_JDBC_PARAMS.contains(key)) {
          params.put(key, kv.length > 1 ? EnvFile.urlDecode(kv[1]) : "");
        }
      }
    }
    params.putIfAbsent("sslmode", "disable");
    params.putIfAbsent("connectTimeout", "30");
    params.putIfAbsent("socketTimeout", "120");
    params.putIfAbsent("tcpKeepAlive", "true");
    params.putIfAbsent("reWriteBatchedInserts", "true");
    StringBuilder jdbc = new StringBuilder("jdbc:postgresql://").append(host).append(":").append(port).append(db);
    if (!params.isEmpty()) {
      jdbc.append("?");
      boolean first = true;
      for (Map.Entry<String, String> entry : params.entrySet()) {
        if (!first) jdbc.append("&");
        jdbc.append(entry.getKey()).append("=").append(entry.getValue());
        first = false;
      }
    }
    return new DatabaseConfig(jdbc.toString(), user, password);
  }

  private static int parseInt(Map<String, String> map, String key, int fallback) {
    String value = map.get(key);
    if (value == null || value.isBlank()) return fallback;
    return Integer.parseInt(value);
  }

  private static boolean parseBool(Map<String, String> map, String key, boolean fallback) {
    String value = map.get(key);
    if (value == null || value.isBlank()) return fallback;
    return Set.of("1", "true", "yes", "on").contains(value.toLowerCase(Locale.ROOT));
  }

  private static int clamp(int value, int min, int max) {
    return Math.max(min, Math.min(max, value));
  }

  private static String firstNonBlank(String... values) {
    for (String value : values) {
      if (value != null && !value.isBlank()) return value;
    }
    return null;
  }

  public record DatabaseConfig(String jdbcUrl, String username, String password) {
  }
}
