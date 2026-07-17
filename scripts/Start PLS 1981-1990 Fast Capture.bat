@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "scripts\pls-capture-supervisor.ps1" -From 1981 -To 1990 -Workers 8 -Batch 4 -DelayMs 50 -Port 8782 -FetchRetries 8 -FetchTimeoutMs 90000 -MaxEmptyAttempts 8 -SessionPauseThreshold 8 -SessionPauseSeconds 120 -TransientPauseThreshold 16 -TransientPauseSeconds 90 -EmptyPauseThreshold 20 -EmptyPauseSeconds 120 -EmptyPauseWindowSeconds 60
endlocal
