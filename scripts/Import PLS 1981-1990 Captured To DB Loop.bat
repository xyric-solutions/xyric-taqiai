@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
:loop
node scripts\pls-bulk-import-jsonl.mjs "..\data\pls_1981_1990_fast_capture.jsonl" "..\data\pls_1981_1990_remaining_no_short_capture.jsonl" --prefix PLS_ALL_1981_1990
echo Import pass finished. Waiting 15 minutes before next DB sync...
timeout /t 900 /nobreak
goto loop
