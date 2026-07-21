@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
:loop
node scripts\pls-bulk-import-jsonl.mjs "..\data\pls_2001_2010_fast_capture.jsonl" --prefix PLS_ALL_2001_2010 --tail-state "..\data\pls_2001_2010_fast_import.tail-state.json"
echo Incremental import pass finished. Waiting 15 seconds before next DB sync...
timeout /t 15 /nobreak
goto loop
