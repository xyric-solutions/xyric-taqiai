# Pakistan Law Site Fast Capture: 1950-1960

This scraper is local-first. During capture it does not depend on Railway/Postgres, so remote database timeouts or TLS errors cannot stop the browser runner or lose fetched judgments.

Before leasing work, the supervisor asks Postgres for completed `pls_capture_jobs` in the selected year range. Those case IDs are marked complete in the local checkpoint, so already scraped judgments are not fetched again and duplicate inserts are avoided.

## Start

Run:

```powershell
.\scripts\pls-capture-supervisor.ps1 -From 1950 -To 1960 -Workers 5 -Batch 2 -Port 8781
```

Or double-click:

```text
scripts\Start PLS 1950-1960 Fast Capture.bat
```

When the supervisor starts, keep it open. In the already logged-in Pakistan Law Site Chrome tab, open DevTools Console and paste the loader printed by the supervisor:

```javascript
const s = document.createElement("script");
s.src = "http://127.0.0.1:8781/pls_runner.js?workers=5&batch=2&force=1";
document.body.appendChild(s);
```

The runner must execute inside the Pakistan Law Site page so it can reuse the logged-in browser session. Opening the `pls_runner.js` URL directly only displays the script.

Output:

```text
D:\AI legal System\data\pls_1950_1960_fast_capture.jsonl
D:\AI legal System\data\pls_1950_1960_fast_capture.state.json
D:\AI legal System\data\pls_1950_1960_fast_failures.jsonl
```

## Resume

Start the same supervisor command again. Completed cases are recovered from the JSONL file and from Postgres, and stale `running` jobs are requeued automatically.

If Postgres is temporarily unavailable, the default supervisor refuses to start rather than accidentally starting from the beginning. For a purely local/offline resume, add `-SkipPostgresCompletedCheck`.

## Status

```powershell
Invoke-RestMethod http://127.0.0.1:8781/status
```

If the status says `paused: true`, leave the supervisor and Chrome tab open. The runner is cooling down because Pakistan Law Site returned a login/search shell or repeated transient failures; it will resume automatically after `pausedUntil`.

Offline status from checkpoint:

```powershell
node scripts\pls-fast-capture.mjs --status --from 1950 --to 1960
```

## Import To Postgres

After capture, import the durable JSONL whenever the database connection is stable:

```powershell
node scripts\pls-pg-capture.mjs --import-jsonl ..\data\pls_1950_1960_fast_capture.jsonl --from 1950 --to 1960 --citation-prefix PLS_ALL_1950_1960 --dedupe-by-listing
```

The import command is resumable and can be rerun. The scraper data remains safe in JSONL even if Postgres is unavailable.

## Sleep Reliability

When a Windows laptop sleeps, Chrome, Node, network sockets, and timers are suspended. A scraper cannot continue while the machine is asleep. The supervisor calls `SetThreadExecutionState` repeatedly to suppress system sleep while it is running.

Best reliability:

```powershell
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
```

Keep the laptop plugged in, do not close the lid unless Windows is configured to do nothing on lid close, and keep the supervisor process running. For multi-day jobs, the best solution is an always-on desktop, mini PC, or VPS with a persistent browser session.
