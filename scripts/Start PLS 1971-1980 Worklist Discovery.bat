@echo off
setlocal
cd /d "D:\AI legal System\ai-legal-system"
node scripts\pls-discover-range.mjs --from 1971 --to 1980 --port 8780 --force
endlocal
