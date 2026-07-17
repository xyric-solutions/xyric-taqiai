# PakistanLawSite Java Scraper

Production-oriented Java scraper for PakistanLawSite judgments. The default launcher is configured for 1981 through 1990.

## What It Does

- Uses PostgreSQL only. No SQLite.
- Reads `DATABASE_URL` from `../.env` by default.
- Loads the existing worklist for the configured range, e.g. `../../data/pls_all_courts_1981_1990_worklist.json`.
- Refuses any worklist row outside the configured `--from` / `--to` range.
- Uses PostgreSQL job rows as the checkpoint system.
- Skips duplicates using the stable PLS citation key, source URL/case id metadata, plus reported citation/court/title/year matching.
- Saves progress after every insert, duplicate, or retry failure.
- Uses Playwright once for the logged-in PakistanLawSite browser session, then fast authenticated Java HTTP requests.
- Restarts/refreshes the browser session when the site returns login/shell responses.
- Prevents Windows sleep while running.

## Requirements

- JDK 17+
- Maven
- A valid PostgreSQL `DATABASE_URL` in `../.env`
- PakistanLawSite account login in the opened Playwright browser
- A discovered worklist for the range. Use `scripts/Start PLS 1981-1990 Worklist Discovery.bat` from the app root if the worklist is not present yet.

## Run

```bat
run-pls-1981-1990.bat
```

Or manually:

```bat
mvn -DskipTests package
java -jar target\java-pls-scraper-1.0.0.jar --from 1981 --to 1990 --workers 4 --batch 1
```

The first run opens a persistent Chromium profile under:

```text
..\..\data\pls-java-playwright-profile
```

Login to PakistanLawSite in that browser. The scraper waits and resumes automatically after login.

## Tables

The scraper creates or reuses:

- `legal_judgments`
- `pls_capture_jobs`
- `pls_capture_events`
- `pls_judgment_metadata`
- `legal_judgment_headnotes`
- `legal_judgment_statute_refs`
- `pls_scraper_checkpoints`

## Resume Behavior

The scraper resumes from PostgreSQL:

- `pending` jobs are new work.
- `retry` jobs are retried after `next_attempt_at`.
- stale `running` jobs are reset to `retry` on startup.
- `completed` jobs are never scraped again.
- duplicate rows are marked `completed` and linked to the existing judgment.

## Sleep Mode

Windows Sleep/Hibernate suspends all processes, so no scraper can continue during true sleep. This scraper calls the Windows API to prevent system sleep while it is running. If the computer is restarted anyway, run the same command again and it resumes from PostgreSQL.

For automatic resume after Windows logon, install the optional scheduled task:

```powershell
powershell -ExecutionPolicy Bypass -File install-windows-startup-task.ps1
```
