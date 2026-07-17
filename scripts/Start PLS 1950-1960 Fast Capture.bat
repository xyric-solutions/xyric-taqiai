@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "scripts\pls-capture-supervisor.ps1" -From 1950 -To 1960 -Workers 5 -Batch 2 -Port 8781
endlocal
