@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
node scripts\pls-fast-capture.mjs --serve --from 1991 --to 2000 --worklist "..\data\pls_all_courts_1991_2000_worklist.json" --out "..\data\pls_1991_2000_fast_capture.jsonl" --state "..\data\pls_1991_2000_fast_capture.state.json" --failures "..\data\pls_1991_2000_fast_failures.jsonl" --log "..\data\pls_1991_2000_fast_capture.log" --port 8792 --workers 10 --batch 1 --stale-minutes 5 --fetch-retries 8 --fetch-timeout-ms 180000 --delay-ms 200 --checkpoint-ms 3000 --retry-base-seconds 20 --transient-retry-base-seconds 15 --max-empty-attempts 20 --max-transient-attempts 0 --session-pause-seconds 120 --session-pause-threshold 8 --transient-pause-seconds 45 --transient-pause-threshold 20 --empty-pause-seconds 30 --empty-pause-threshold 100 --empty-pause-window-seconds 60
endlocal
