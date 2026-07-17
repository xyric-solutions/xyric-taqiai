@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "scripts\pls-capture-supervisor.ps1" -From 1971 -To 1980 -Workers 3 -Batch 1 -DelayMs 250 -Port 8781 -MaxEmptyAttempts 2 -SessionPauseThreshold 3 -SessionPauseSeconds 120 -EmptyPauseThreshold 20 -EmptyPauseSeconds 120 -EmptyPauseWindowSeconds 60
endlocal
