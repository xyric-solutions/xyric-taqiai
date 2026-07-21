@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
REM Run "Prepare PLS 1981-1990 Remaining No Short Worklist.bat" first.
REM This server only leases remaining jobs that are not already captured and not
REM already known as short-content/no-judgment responses.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "scripts\pls-capture-supervisor.ps1" -From 1981 -To 1990 -Workers 2 -Batch 1 -DelayMs 1200 -Port 8786 -Worklist "D:\AI legal System\data\pls_all_courts_1981_1990_remaining_no_short_worklist.json" -Out "D:\AI legal System\data\pls_1981_1990_remaining_no_short_capture.jsonl" -State "D:\AI legal System\data\pls_1981_1990_remaining_no_short_capture.state.json" -Failures "D:\AI legal System\data\pls_1981_1990_remaining_no_short_failures.jsonl" -Log "D:\AI legal System\data\pls_1981_1990_remaining_no_short_capture.log" -OutLog "D:\AI legal System\data\pls_1981_1990_remaining_no_short_8786.out.log" -ErrLog "D:\AI legal System\data\pls_1981_1990_remaining_no_short_8786.err.log" -FetchRetries 4 -FetchTimeoutMs 90000 -MaxEmptyAttempts 1 -SessionPauseThreshold 8 -SessionPauseSeconds 120 -TransientPauseThreshold 100 -TransientPauseSeconds 30 -EmptyPauseThreshold 100 -EmptyPauseSeconds 30 -EmptyPauseWindowSeconds 60 -SkipPostgresCompletedCheck
endlocal
