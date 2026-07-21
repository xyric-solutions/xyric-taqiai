@echo off
setlocal
cd /d "%~dp0\.."

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not on PATH.
  exit /b 1
)

node scripts\pls-discover-range.mjs --from 1991 --to 2000 --port 8790

endlocal
