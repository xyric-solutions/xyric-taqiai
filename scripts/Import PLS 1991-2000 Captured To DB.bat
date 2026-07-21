@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
REM Imports whatever is already captured in the local JSONL into live Postgres.
REM Safe to run more than once; existing synthetic PLS citations are skipped.
node scripts\pls-bulk-import-jsonl.mjs "..\data\pls_1991_2000_fast_capture.jsonl" --prefix PLS_ALL_1991_2000
endlocal
