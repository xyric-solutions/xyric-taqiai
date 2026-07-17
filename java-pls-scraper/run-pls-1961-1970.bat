@echo off
setlocal
cd /d "%~dp0"

if not exist "..\.env" (
  echo Missing ..\.env with DATABASE_URL
  exit /b 1
)

where java >nul 2>nul
if errorlevel 1 (
  echo Java is not installed or not on PATH. Install JDK 17+ first.
  exit /b 1
)

where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven is not installed or not on PATH. Install Maven, then run this file again.
  exit /b 1
)

call mvn -q -DskipTests package
if errorlevel 1 exit /b 1

java -DPLS_LOG_FILE=pls-java-1961-1970.log -jar target\java-pls-scraper-1.0.0.jar ^
  --from 1961 ^
  --to 1970 ^
  --env "..\.env" ^
  --worklist "..\..\data\pls_all_courts_1961_1970_worklist.json" ^
  --browser-profile "..\..\data\pls-java-playwright-profile" ^
  --workers 4 ^
  --batch 1 ^
  --max-attempts 10

endlocal
