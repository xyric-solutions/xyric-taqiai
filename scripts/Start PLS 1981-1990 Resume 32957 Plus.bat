@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
REM Resumes from the existing local JSONL/state files. The ledger currently has
REM 32956 completed rows, so the next run continues with the remaining jobs.
REM Postgres completed lookup is skipped here so DB/network issues cannot block
REM the remaining Pakistan Law Site capture.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "scripts\pls-capture-supervisor.ps1" -From 1981 -To 1990 -Workers 2 -Batch 1 -DelayMs 1200 -Port 8784 -FetchRetries 8 -FetchTimeoutMs 90000 -MaxEmptyAttempts 8 -SessionPauseThreshold 8 -SessionPauseSeconds 120 -TransientPauseThreshold 100 -TransientPauseSeconds 30 -EmptyPauseThreshold 20 -EmptyPauseSeconds 120 -EmptyPauseWindowSeconds 60 -SkipPostgresCompletedCheck
endlocal
