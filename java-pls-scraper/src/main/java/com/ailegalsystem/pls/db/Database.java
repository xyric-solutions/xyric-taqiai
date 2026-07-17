package com.ailegalsystem.pls.db;

import com.ailegalsystem.pls.config.AppConfig;
import com.ailegalsystem.pls.model.InsertResult;
import com.ailegalsystem.pls.model.ParsedJudgment;
import com.ailegalsystem.pls.model.ScraperStatus;
import com.ailegalsystem.pls.model.WorkItem;
import com.ailegalsystem.pls.retry.RetryPolicy;
import com.ailegalsystem.pls.util.TextUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.postgresql.util.PGobject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class Database implements AutoCloseable {
  private static final Logger log = LoggerFactory.getLogger(Database.class);
  private final AppConfig config;
  private final HikariDataSource dataSource;
  private final ObjectMapper mapper = new ObjectMapper();
  private final RetryPolicy dbRetry;

  public Database(AppConfig config) {
    this.config = config;
    HikariConfig hikari = new HikariConfig();
    hikari.setJdbcUrl(config.database().jdbcUrl());
    hikari.setUsername(config.database().username());
    hikari.setPassword(config.database().password());
    hikari.setMaximumPoolSize(Math.max(4, config.workers() + 4));
    hikari.setMinimumIdle(1);
    hikari.setConnectionTimeout(60_000);
    hikari.setValidationTimeout(10_000);
    hikari.setIdleTimeout(300_000);
    hikari.setMaxLifetime(1_200_000);
    hikari.setPoolName("pls-java-pool");
    this.dataSource = new HikariDataSource(hikari);
    this.dbRetry = new RetryPolicy(Duration.ofSeconds(2), Duration.ofSeconds(60), 6);
  }

  public void ensureSchema() throws Exception {
    dbRetry.run("ensure database schema", () -> {
      try (Connection conn = dataSource.getConnection(); Statement st = conn.createStatement()) {
        st.execute("""
            CREATE TABLE IF NOT EXISTS legal_judgments (
              id INTEGER PRIMARY KEY,
              citation TEXT NOT NULL,
              court TEXT NOT NULL,
              year INTEGER NOT NULL,
              content TEXT,
              processed INTEGER DEFAULT 0,
              created_at BIGINT,
              title TEXT,
              real_citation TEXT,
              law_category TEXT,
              case_type TEXT,
              court_level TEXT,
              province TEXT,
              reported_status TEXT,
              citation_reporter TEXT,
              authority_score INTEGER,
              template_usefulness_score INTEGER,
              citation_reliability_score INTEGER,
              ocr_quality_score INTEGER,
              tagging_confidence INTEGER,
              tagged_at BIGINT
            )
            """);
        st.execute("CREATE SEQUENCE IF NOT EXISTS legal_judgments_pls_id_seq AS INTEGER");
        st.execute("""
            SELECT setval(
              'legal_judgments_pls_id_seq',
              GREATEST(
                (SELECT COALESCE(MAX(id), 0) FROM legal_judgments),
                (SELECT COALESCE(last_value, 1) FROM legal_judgments_pls_id_seq),
                1
              ),
              true
            )
            """);
        st.execute("""
            CREATE TABLE IF NOT EXISTS pls_capture_jobs (
              source TEXT NOT NULL,
              year INTEGER NOT NULL CHECK (year BETWEEN 1800 AND 2100),
              case_type_id TEXT PRIMARY KEY,
              category TEXT,
              citation TEXT,
              title TEXT,
              court TEXT,
              row_no INTEGER,
              status TEXT NOT NULL DEFAULT 'pending',
              attempts INTEGER NOT NULL DEFAULT 0,
              failure_count INTEGER NOT NULL DEFAULT 0,
              lease_token TEXT,
              leased_at TIMESTAMPTZ,
              next_attempt_at TIMESTAMPTZ,
              last_http_status INTEGER,
              last_error TEXT,
              last_stack TEXT,
              last_response_preview TEXT,
              content_length INTEGER,
              html_length INTEGER,
              legal_judgment_id INTEGER REFERENCES legal_judgments(id) ON DELETE SET NULL,
              first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              completed_at TIMESTAMPTZ,
              last_scraped_at TIMESTAMPTZ
            )
            """);
        st.execute("""
            CREATE TABLE IF NOT EXISTS pls_capture_events (
              id BIGSERIAL PRIMARY KEY,
              case_type_id TEXT,
              event_type TEXT NOT NULL,
              message TEXT,
              details JSONB,
              created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """);
        st.execute("""
            CREATE TABLE IF NOT EXISTS pls_judgment_metadata (
              case_type_id TEXT PRIMARY KEY REFERENCES pls_capture_jobs(case_type_id) ON DELETE CASCADE,
              legal_judgment_id INTEGER REFERENCES legal_judgments(id) ON DELETE CASCADE,
              source_url TEXT,
              case_number TEXT,
              bench TEXT,
              judges TEXT,
              decision_date TEXT,
              parties TEXT,
              advocates TEXT,
              statutes JSONB,
              sections JSONB,
              acts JSONB,
              keywords JSONB,
              equivalent_citations JSONB,
              headnotes TEXT,
              short_summary TEXT,
              metadata JSONB,
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """);
        relaxLegacyYearConstraint(st);
        st.execute("ALTER TABLE pls_judgment_metadata ADD COLUMN IF NOT EXISTS equivalent_citations JSONB");
        st.execute("""
            CREATE TABLE IF NOT EXISTS legal_judgment_headnotes (
              id BIGSERIAL PRIMARY KEY,
              judgment_id INTEGER NOT NULL REFERENCES legal_judgments(id) ON DELETE CASCADE,
              headnote_text TEXT NOT NULL,
              source TEXT NOT NULL DEFAULT 'pls_java',
              created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """);
        st.execute("""
            CREATE TABLE IF NOT EXISTS legal_judgment_statute_refs (
              id BIGSERIAL PRIMARY KEY,
              judgment_id INTEGER NOT NULL REFERENCES legal_judgments(id) ON DELETE CASCADE,
              ref_text TEXT NOT NULL,
              source TEXT NOT NULL DEFAULT 'pls_java',
              created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """);
        st.execute("""
            CREATE TABLE IF NOT EXISTS pls_scraper_checkpoints (
              scraper_name TEXT PRIMARY KEY,
              from_year INTEGER NOT NULL,
              to_year INTEGER NOT NULL,
              last_case_type_id TEXT,
              completed_count INTEGER NOT NULL DEFAULT 0,
              duplicate_count INTEGER NOT NULL DEFAULT 0,
              failed_count INTEGER NOT NULL DEFAULT 0,
              status JSONB,
              updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """);
        st.execute("CREATE INDEX IF NOT EXISTS legal_judgments_citation_idx ON legal_judgments (citation)");
        st.execute("CREATE INDEX IF NOT EXISTS legal_judgments_real_citation_idx ON legal_judgments (real_citation)");
        st.execute("CREATE INDEX IF NOT EXISTS legal_judgments_court_year_idx ON legal_judgments (court, year)");
        st.execute("CREATE INDEX IF NOT EXISTS pls_capture_jobs_status_idx ON pls_capture_jobs (source, year, status, row_no)");
        st.execute("CREATE INDEX IF NOT EXISTS pls_capture_jobs_retry_idx ON pls_capture_jobs (source, year, status, next_attempt_at, row_no)");
        st.execute("CREATE INDEX IF NOT EXISTS pls_capture_events_case_idx ON pls_capture_events (case_type_id, created_at)");
        st.execute("CREATE INDEX IF NOT EXISTS pls_judgment_metadata_source_url_idx ON pls_judgment_metadata (source_url)");
        st.execute("CREATE UNIQUE INDEX IF NOT EXISTS legal_judgment_headnotes_judgment_uidx ON legal_judgment_headnotes (judgment_id)");
        st.execute("CREATE UNIQUE INDEX IF NOT EXISTS legal_judgment_statute_refs_judgment_ref_uidx ON legal_judgment_statute_refs (judgment_id, ref_text)");
        maybeCreatePlsCitationIndex(st);
      }
      return null;
    });
  }

  private void maybeCreatePlsCitationIndex(Statement st) throws SQLException {
    try {
      st.execute("""
          CREATE UNIQUE INDEX IF NOT EXISTS legal_judgments_pls_citation_uidx
          ON legal_judgments (citation)
          WHERE citation LIKE 'PLS\\_%' ESCAPE '\\'
          """);
    } catch (SQLException error) {
      log.warn("Could not create partial unique PLS citation index, continuing with app-level duplicate checks: {}", error.getMessage());
    }
  }

  private void relaxLegacyYearConstraint(Statement st) throws SQLException {
    st.execute("""
        DO $$
        DECLARE
          constraint_row record;
        BEGIN
          FOR constraint_row IN
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'pls_capture_jobs'::regclass
              AND contype = 'c'
              AND pg_get_constraintdef(oid) LIKE '%1961%'
          LOOP
            EXECUTE format('ALTER TABLE pls_capture_jobs DROP CONSTRAINT %I', constraint_row.conname);
          END LOOP;
          IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conrelid = 'pls_capture_jobs'::regclass
              AND conname = 'pls_capture_jobs_year_supported_range_check'
          ) THEN
            ALTER TABLE pls_capture_jobs
              ADD CONSTRAINT pls_capture_jobs_year_supported_range_check
              CHECK (year BETWEEN 1800 AND 2100);
          END IF;
        END $$;
        """);
  }

  public void upsertWorklist(List<WorkItem> items) throws Exception {
    dbRetry.run("upsert PLS worklist " + config.rangeSlug(), () -> {
      try (Connection conn = dataSource.getConnection()) {
        conn.setAutoCommit(false);
        try (PreparedStatement ps = conn.prepareStatement("""
            INSERT INTO pls_capture_jobs (source, year, case_type_id, category, citation, title, court, row_no, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            ON CONFLICT (case_type_id) DO UPDATE SET
              source = EXCLUDED.source,
              year = EXCLUDED.year,
              category = COALESCE(pls_capture_jobs.category, EXCLUDED.category),
              citation = COALESCE(pls_capture_jobs.citation, EXCLUDED.citation),
              title = COALESCE(pls_capture_jobs.title, EXCLUDED.title),
              court = COALESCE(pls_capture_jobs.court, EXCLUDED.court),
              row_no = COALESCE(pls_capture_jobs.row_no, EXCLUDED.row_no),
              updated_at = now()
            """)) {
          int n = 0;
          for (WorkItem item : items) {
            item.validateYearRange(config.fromYear(), config.toYear());
            ps.setString(1, config.source());
            ps.setInt(2, item.year());
            ps.setString(3, item.caseTypeId());
            ps.setString(4, item.category());
            ps.setString(5, item.citation());
            ps.setString(6, item.title());
            ps.setString(7, item.court());
            ps.setInt(8, item.rowNo());
            ps.addBatch();
            if (++n % 500 == 0) ps.executeBatch();
          }
          ps.executeBatch();
          conn.commit();
        } catch (Exception error) {
          conn.rollback();
          throw error;
        }
      }
      return null;
    });
  }

  public void resetStaleRunning() throws Exception {
    dbRetry.run("reset stale running leases", () -> {
      try (Connection conn = dataSource.getConnection(); PreparedStatement ps = conn.prepareStatement("""
          UPDATE pls_capture_jobs
          SET status = 'retry',
              lease_token = NULL,
              leased_at = NULL,
              next_attempt_at = now(),
              last_error = COALESCE(last_error, 'Reset stale running job on Java scraper startup'),
              updated_at = now()
          WHERE source = ?
            AND year BETWEEN ? AND ?
            AND status = 'running'
            AND (leased_at IS NULL OR leased_at < now() - (? * interval '1 minute'))
          """)) {
        ps.setString(1, config.source());
        ps.setInt(2, config.fromYear());
        ps.setInt(3, config.toYear());
        ps.setLong(4, config.staleLeaseAfter().toMinutes());
        int count = ps.executeUpdate();
        if (count > 0) log.warn("Reset {} stale running PLS jobs", count);
      }
      return null;
    });
  }

  public List<WorkItem> leaseBatch(int limit) throws Exception {
    return dbRetry.run("lease PLS work", () -> {
      String token = UUID.randomUUID().toString();
      List<WorkItem> out = new ArrayList<>();
      try (Connection conn = dataSource.getConnection()) {
        conn.setAutoCommit(false);
        try (PreparedStatement ps = conn.prepareStatement("""
            WITH picked AS (
              SELECT case_type_id
              FROM pls_capture_jobs
              WHERE source = ?
                AND year BETWEEN ? AND ?
                AND status IN ('pending', 'retry', 'running')
                AND (
                  status <> 'running'
                  OR leased_at IS NULL
                  OR leased_at < now() - (? * interval '1 minute')
                )
                AND (next_attempt_at IS NULL OR next_attempt_at <= now())
              ORDER BY
                CASE status WHEN 'pending' THEN 0 WHEN 'retry' THEN 1 ELSE 2 END,
                year,
                row_no,
                case_type_id
              LIMIT ?
              FOR UPDATE SKIP LOCKED
            )
            UPDATE pls_capture_jobs job SET
              status = 'running',
              attempts = attempts + 1,
              lease_token = ?,
              leased_at = now(),
              updated_at = now()
            FROM picked
            WHERE job.case_type_id = picked.case_type_id
            RETURNING job.case_type_id, job.category, job.citation, job.court, job.title, job.year, job.row_no
            """)) {
          ps.setString(1, config.source());
          ps.setInt(2, config.fromYear());
          ps.setInt(3, config.toYear());
          ps.setLong(4, config.staleLeaseAfter().toMinutes());
          ps.setInt(5, limit);
          ps.setString(6, token);
          try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) out.add(readWorkItem(rs));
          }
          conn.commit();
        } catch (Exception error) {
          conn.rollback();
          throw error;
        }
      }
      return out;
    });
  }

  public InsertResult insertOrSkip(ParsedJudgment judgment) throws Exception {
    return dbRetry.run("insert judgment " + judgment.caseTypeId(), () -> {
      try (Connection conn = dataSource.getConnection()) {
        conn.setAutoCommit(false);
        try {
          InsertResult result = insertOrSkipTx(conn, judgment);
          conn.commit();
          return result;
        } catch (Exception error) {
          conn.rollback();
          throw error;
        }
      }
    });
  }

  private InsertResult insertOrSkipTx(Connection conn, ParsedJudgment judgment) throws Exception {
    String finalCitation = TextUtil.stableCitation(config.citationPrefix(), judgment.caseTypeId());
    Integer existingId = findExistingJudgment(conn, finalCitation, judgment);
    if (existingId != null) {
      markCompleted(conn, judgment, existingId);
      upsertMetadata(conn, judgment, existingId);
      insertEvent(conn, judgment.caseTypeId(), "duplicate", "Duplicate judgment skipped and existing PostgreSQL row reused", Map.of(
          "legalJudgmentId", existingId,
          "citation", judgment.citation() == null ? "" : judgment.citation()
      ));
      saveCheckpoint(conn, judgment.caseTypeId());
      return InsertResult.duplicate(existingId, "duplicate");
    }

    int id;
    try (PreparedStatement next = conn.prepareStatement("SELECT nextval('legal_judgments_pls_id_seq')::int AS id");
         ResultSet rs = next.executeQuery()) {
      rs.next();
      id = rs.getInt("id");
    }

    try (PreparedStatement ps = conn.prepareStatement("""
        INSERT INTO legal_judgments
          (id, citation, court, year, content, processed, created_at, title, real_citation,
           law_category, case_type, court_level, province, reported_status, citation_reporter,
           tagged_at)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, 'case_law', ?, ?, ?, ?, ?, ?)
        """)) {
      long now = System.currentTimeMillis();
      String courtLevel = TextUtil.courtLevel(judgment.court());
      ps.setInt(1, id);
      ps.setString(2, finalCitation);
      ps.setString(3, judgment.court());
      ps.setInt(4, judgment.year());
      ps.setString(5, judgment.fullText());
      ps.setLong(6, now);
      ps.setString(7, judgment.caseTitle());
      ps.setString(8, judgment.citation());
      ps.setString(9, judgment.category() == null ? TextUtil.reporter(judgment.citation(), null) : judgment.category());
      ps.setString(10, courtLevel);
      ps.setString(11, "Supreme Court".equals(courtLevel) || "Federal Shariat Court".equals(courtLevel) ? "Federal" : null);
      ps.setString(12, judgment.citation() == null ? null : "reported");
      ps.setString(13, TextUtil.reporter(judgment.citation(), judgment.category()));
      ps.setLong(14, now);
      ps.executeUpdate();
    } catch (SQLException duplicateRace) {
      if (!"23505".equals(duplicateRace.getSQLState())) throw duplicateRace;
      Integer racedId = findByCitation(conn, finalCitation);
      if (racedId == null) throw duplicateRace;
      markCompleted(conn, judgment, racedId);
      upsertMetadata(conn, judgment, racedId);
      saveCheckpoint(conn, judgment.caseTypeId());
      return InsertResult.duplicate(racedId, "duplicate-race");
    }

    markCompleted(conn, judgment, id);
    upsertMetadata(conn, judgment, id);
    insertHeadnotes(conn, judgment, id);
    insertStatuteRefs(conn, judgment, id);
    insertEvent(conn, judgment.caseTypeId(), "completed", "Judgment inserted by Java scraper", Map.of(
        "legalJudgmentId", id,
        "contentLength", judgment.contentLength()
    ));
    saveCheckpoint(conn, judgment.caseTypeId());
    return InsertResult.inserted(id);
  }

  private Integer findExistingJudgment(Connection conn, String finalCitation, ParsedJudgment judgment) throws SQLException {
    Integer byMetadata = findByMetadata(conn, judgment.caseTypeId(), judgment.sourceUrl());
    if (byMetadata != null) return byMetadata;
    Integer byPlsId = findByCitation(conn, finalCitation);
    if (byPlsId != null) return byPlsId;
    if (judgment.citation() == null || judgment.court() == null || judgment.caseTitle() == null) return null;
    try (PreparedStatement ps = conn.prepareStatement("""
        SELECT id
        FROM legal_judgments
        WHERE year = ?
          AND LENGTH(COALESCE(content, '')) >= ?
          AND (real_citation = ? OR citation = ?)
          AND regexp_replace(lower(COALESCE(court, '')), '[^a-z0-9]+', '', 'g') = ?
          AND regexp_replace(lower(COALESCE(title, '')), '[^a-z0-9]+', '', 'g') = ?
        ORDER BY CASE WHEN real_citation = ? THEN 0 ELSE 1 END, id
        LIMIT 1
        """)) {
      ps.setInt(1, judgment.year());
      ps.setInt(2, config.minContentLength());
      ps.setString(3, judgment.citation());
      ps.setString(4, judgment.citation());
      ps.setString(5, TextUtil.compact(judgment.court()));
      ps.setString(6, TextUtil.compact(judgment.caseTitle()));
      ps.setString(7, judgment.citation());
      try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? rs.getInt("id") : null;
      }
    }
  }

  private Integer findByMetadata(Connection conn, String caseTypeId, String sourceUrl) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement("""
        SELECT legal_judgment_id
        FROM pls_judgment_metadata
        WHERE legal_judgment_id IS NOT NULL
          AND (case_type_id = ? OR source_url = ?)
        ORDER BY CASE WHEN case_type_id = ? THEN 0 ELSE 1 END, legal_judgment_id
        LIMIT 1
        """)) {
      ps.setString(1, caseTypeId);
      ps.setString(2, sourceUrl);
      ps.setString(3, caseTypeId);
      try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? rs.getInt("legal_judgment_id") : null;
      }
    }
  }

  private Integer findByCitation(Connection conn, String citation) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement("SELECT id FROM legal_judgments WHERE citation = ? ORDER BY id LIMIT 1")) {
      ps.setString(1, citation);
      try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? rs.getInt("id") : null;
      }
    }
  }

  public void markFailure(WorkItem item, Throwable error, boolean manualReview) throws Exception {
    dbRetry.run("mark failure " + item.caseTypeId(), () -> {
      try (Connection conn = dataSource.getConnection()) {
        conn.setAutoCommit(false);
        try {
          int failureCount = currentFailureCount(conn, item.caseTypeId()) + 1;
          int exponent = Math.min(8, Math.max(0, failureCount - 1));
          Duration backoff = config.baseBackoff().multipliedBy(1L << exponent);
          if (backoff.compareTo(config.maxBackoff()) > 0) backoff = config.maxBackoff();
          String status = manualReview || failureCount >= config.maxAttempts() ? "manual_review" : "retry";
          try (PreparedStatement ps = conn.prepareStatement("""
              UPDATE pls_capture_jobs SET
                status = ?,
                lease_token = NULL,
                leased_at = NULL,
                next_attempt_at = CASE WHEN ? = 'retry' THEN now() + (? * interval '1 second') ELSE NULL END,
                failure_count = ?,
                last_error = ?,
                last_stack = ?,
                updated_at = now()
              WHERE case_type_id = ?
              """)) {
            ps.setString(1, status);
            ps.setString(2, status);
            ps.setLong(3, backoff.toSeconds());
            ps.setInt(4, failureCount);
            ps.setString(5, error.toString());
            ps.setString(6, stack(error));
            ps.setString(7, item.caseTypeId());
            ps.executeUpdate();
          }
          insertEvent(conn, item.caseTypeId(), status, error.toString(), Map.of("failureCount", failureCount));
          saveCheckpoint(conn, item.caseTypeId());
          conn.commit();
        } catch (Exception txError) {
          conn.rollback();
          throw txError;
        }
      }
      return null;
    });
  }

  public ScraperStatus status() throws Exception {
    return dbRetry.run("read status", () -> {
      try (Connection conn = dataSource.getConnection(); PreparedStatement ps = conn.prepareStatement("""
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
            COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
            COUNT(*) FILTER (WHERE status = 'retry')::int AS retry,
            COUNT(*) FILTER (WHERE status = 'running')::int AS running,
            COUNT(*) FILTER (WHERE status = 'manual_review')::int AS manual_review
          FROM pls_capture_jobs
          WHERE source = ? AND year BETWEEN ? AND ?
          """)) {
        ps.setString(1, config.source());
        ps.setInt(2, config.fromYear());
        ps.setInt(3, config.toYear());
        try (ResultSet rs = ps.executeQuery()) {
          rs.next();
          return new ScraperStatus(
              rs.getInt("total"),
              rs.getInt("completed"),
              rs.getInt("pending"),
              rs.getInt("retry"),
              rs.getInt("running"),
              rs.getInt("manual_review")
          );
        }
      }
    });
  }

  private void markCompleted(Connection conn, ParsedJudgment judgment, int legalJudgmentId) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement("""
        UPDATE pls_capture_jobs SET
          status = 'completed',
          lease_token = NULL,
          leased_at = NULL,
          next_attempt_at = NULL,
          last_http_status = ?,
          last_error = NULL,
          last_stack = NULL,
          content_length = ?,
          html_length = ?,
          legal_judgment_id = ?,
          completed_at = COALESCE(completed_at, now()),
          last_scraped_at = now(),
          updated_at = now()
        WHERE case_type_id = ?
        """)) {
      ps.setInt(1, judgment.httpStatus());
      ps.setInt(2, judgment.contentLength());
      ps.setInt(3, judgment.htmlLength());
      ps.setInt(4, legalJudgmentId);
      ps.setString(5, judgment.caseTypeId());
      ps.executeUpdate();
    }
  }

  private void upsertMetadata(Connection conn, ParsedJudgment judgment, int legalJudgmentId) throws SQLException, JsonProcessingException {
    try (PreparedStatement ps = conn.prepareStatement("""
        INSERT INTO pls_judgment_metadata
          (case_type_id, legal_judgment_id, source_url, case_number, bench, judges, decision_date, parties,
           advocates, statutes, sections, acts, keywords, equivalent_citations, headnotes, short_summary, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?::jsonb, ?::jsonb, ?::jsonb, ?::jsonb, ?, ?, ?::jsonb)
        ON CONFLICT (case_type_id) DO UPDATE SET
          legal_judgment_id = EXCLUDED.legal_judgment_id,
          source_url = EXCLUDED.source_url,
          case_number = EXCLUDED.case_number,
          bench = EXCLUDED.bench,
          judges = EXCLUDED.judges,
          decision_date = EXCLUDED.decision_date,
          parties = EXCLUDED.parties,
          advocates = EXCLUDED.advocates,
          statutes = EXCLUDED.statutes,
          sections = EXCLUDED.sections,
          acts = EXCLUDED.acts,
          keywords = EXCLUDED.keywords,
          equivalent_citations = EXCLUDED.equivalent_citations,
          headnotes = EXCLUDED.headnotes,
          short_summary = EXCLUDED.short_summary,
          metadata = EXCLUDED.metadata,
          updated_at = now()
        """)) {
      ps.setString(1, judgment.caseTypeId());
      ps.setInt(2, legalJudgmentId);
      ps.setString(3, judgment.sourceUrl());
      ps.setString(4, judgment.caseNumber());
      ps.setString(5, judgment.bench());
      ps.setString(6, judgment.judges());
      ps.setString(7, judgment.decisionDate());
      ps.setString(8, judgment.parties());
      ps.setString(9, judgment.advocates());
      ps.setString(10, json(judgment.statutes()));
      ps.setString(11, json(judgment.sections()));
      ps.setString(12, json(judgment.acts()));
      ps.setString(13, json(judgment.keywords()));
      ps.setString(14, json(judgment.equivalentCitations()));
      ps.setString(15, judgment.headnotes());
      ps.setString(16, judgment.shortSummary());
      ps.setString(17, json(judgment.metadata()));
      ps.executeUpdate();
    }
  }

  private void insertHeadnotes(Connection conn, ParsedJudgment judgment, int id) throws SQLException {
    if (judgment.headnotes() == null || judgment.headnotes().isBlank()) return;
    try (PreparedStatement ps = conn.prepareStatement("""
        INSERT INTO legal_judgment_headnotes (judgment_id, headnote_text, source)
        VALUES (?, ?, 'pls_java')
        ON CONFLICT (judgment_id) DO UPDATE SET headnote_text = EXCLUDED.headnote_text, updated_at = now()
        """)) {
      ps.setInt(1, id);
      ps.setString(2, judgment.headnotes());
      ps.executeUpdate();
    }
  }

  private void insertStatuteRefs(Connection conn, ParsedJudgment judgment, int id) throws SQLException {
    List<String> refs = new ArrayList<>();
    refs.addAll(judgment.acts());
    refs.addAll(judgment.sections());
    try (PreparedStatement ps = conn.prepareStatement("""
        INSERT INTO legal_judgment_statute_refs (judgment_id, ref_text, source)
        VALUES (?, ?, 'pls_java')
        ON CONFLICT (judgment_id, ref_text) DO NOTHING
        """)) {
      for (String ref : refs) {
        if (ref == null || ref.isBlank()) continue;
        ps.setInt(1, id);
        ps.setString(2, ref);
        ps.addBatch();
      }
      ps.executeBatch();
    }
  }

  private int currentFailureCount(Connection conn, String caseTypeId) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement("SELECT failure_count FROM pls_capture_jobs WHERE case_type_id = ?")) {
      ps.setString(1, caseTypeId);
      try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? rs.getInt(1) : 0;
      }
    }
  }

  private void insertEvent(Connection conn, String caseTypeId, String eventType, String message, Map<String, ?> details) throws SQLException, JsonProcessingException {
    try (PreparedStatement ps = conn.prepareStatement("""
        INSERT INTO pls_capture_events (case_type_id, event_type, message, details)
        VALUES (?, ?, ?, ?)
        """)) {
      ps.setString(1, caseTypeId);
      ps.setString(2, eventType);
      ps.setString(3, message);
      PGobject jsonb = new PGobject();
      jsonb.setType("jsonb");
      jsonb.setValue(json(details));
      ps.setObject(4, jsonb);
      ps.executeUpdate();
    }
  }

  private void saveCheckpoint(Connection conn, String lastCaseTypeId) throws SQLException, JsonProcessingException {
    ScraperStatus current = statusWithoutRetry(conn);
    try (PreparedStatement ps = conn.prepareStatement("""
        INSERT INTO pls_scraper_checkpoints
          (scraper_name, from_year, to_year, last_case_type_id, completed_count, duplicate_count, failed_count, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?::jsonb)
        ON CONFLICT (scraper_name) DO UPDATE SET
          last_case_type_id = EXCLUDED.last_case_type_id,
          completed_count = EXCLUDED.completed_count,
          duplicate_count = EXCLUDED.duplicate_count,
          failed_count = EXCLUDED.failed_count,
          status = EXCLUDED.status,
          updated_at = now()
        """)) {
      int duplicateCount = duplicateCount(conn);
      ps.setString(1, config.scraperName());
      ps.setInt(2, config.fromYear());
      ps.setInt(3, config.toYear());
      ps.setString(4, lastCaseTypeId);
      ps.setInt(5, current.completed());
      ps.setInt(6, duplicateCount);
      ps.setInt(7, current.manualReview());
      ps.setString(8, json(Map.of(
          "total", current.total(),
          "completed", current.completed(),
          "duplicates", duplicateCount,
          "pending", current.pending(),
          "retry", current.retry(),
          "running", current.running(),
          "manualReview", current.manualReview(),
          "updatedAt", Instant.now().toString()
      )));
      ps.executeUpdate();
    }
  }

  private ScraperStatus statusWithoutRetry(Connection conn) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement("""
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
          COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
          COUNT(*) FILTER (WHERE status = 'retry')::int AS retry,
          COUNT(*) FILTER (WHERE status = 'running')::int AS running,
          COUNT(*) FILTER (WHERE status = 'manual_review')::int AS manual_review
        FROM pls_capture_jobs
        WHERE source = ? AND year BETWEEN ? AND ?
        """)) {
      ps.setString(1, config.source());
      ps.setInt(2, config.fromYear());
      ps.setInt(3, config.toYear());
      try (ResultSet rs = ps.executeQuery()) {
        rs.next();
        return new ScraperStatus(rs.getInt("total"), rs.getInt("completed"), rs.getInt("pending"), rs.getInt("retry"), rs.getInt("running"), rs.getInt("manual_review"));
      }
    }
  }

  private int duplicateCount(Connection conn) throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement("""
        SELECT COUNT(DISTINCT e.case_type_id)::int AS duplicates
        FROM pls_capture_events e
        JOIN pls_capture_jobs j ON j.case_type_id = e.case_type_id
        WHERE j.source = ?
          AND j.year BETWEEN ? AND ?
          AND e.event_type = 'duplicate'
        """)) {
      ps.setString(1, config.source());
      ps.setInt(2, config.fromYear());
      ps.setInt(3, config.toYear());
      try (ResultSet rs = ps.executeQuery()) {
        rs.next();
        return rs.getInt("duplicates");
      }
    }
  }

  private WorkItem readWorkItem(ResultSet rs) throws SQLException, JsonProcessingException {
    Map<String, Object> row = new LinkedHashMap<>();
    row.put("caseTypeId", rs.getString("case_type_id"));
    row.put("category", rs.getString("category"));
    row.put("citation", rs.getString("citation"));
    row.put("court", rs.getString("court"));
    row.put("title", rs.getString("title"));
    row.put("year", rs.getInt("year"));
    row.put("row_no", rs.getInt("row_no"));
    WorkItem item = mapper.convertValue(row, WorkItem.class);
    item.validateYearRange(config.fromYear(), config.toYear());
    return item;
  }

  private String json(Object value) throws JsonProcessingException {
    return mapper.writeValueAsString(value);
  }

  private String stack(Throwable error) {
    StringBuilder out = new StringBuilder();
    for (StackTraceElement element : error.getStackTrace()) {
      if (out.length() > 4000) break;
      out.append(element).append('\n');
    }
    return out.toString();
  }

  @Override
  public void close() {
    dataSource.close();
  }
}
