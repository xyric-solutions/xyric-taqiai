@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
REM Safe to run repeatedly; existing PLS_ALL_2001_2010 citations are skipped.
node scripts\pls-bulk-import-jsonl.mjs "..\data\pls_2001_2010_fast_capture.jsonl" --prefix PLS_ALL_2001_2010
endlocal

