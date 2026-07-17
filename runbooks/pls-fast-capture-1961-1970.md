# Pakistan Law Site Fast Capture: 1961-1970

This range must be discovered first because the 1961-1970 worklist does not exist yet.

## 1. Discover Worklist

Double-click:

```text
scripts\Start PLS 1961-1970 Worklist Discovery.bat
```

Then paste the printed loader in the logged-in Pakistan Law Site tab console.

Expected output:

```text
D:\AI legal System\data\pls_all_courts_1961_1970_worklist.json
D:\AI legal System\data\pls_all_courts_1961_1970_worklist_summary.json
```

## 2. Fast Capture

After the combined worklist exists, double-click:

```text
scripts\Start PLS 1961-1970 Fast Capture.bat
```

Then paste this in the logged-in Pakistan Law Site tab console:

```javascript
const s = document.createElement("script");
s.src = "http://127.0.0.1:8781/pls_runner.js?workers=7&batch=3&force=1";
document.body.appendChild(s);
```

This starts faster than the 1950-1960 cleanup run. If Pakistan Law Site begins returning shell/login pages or many empty responses, restart the runner with:

```javascript
const s = document.createElement("script");
s.src = "http://127.0.0.1:8781/pls_runner.js?workers=5&batch=2&force=1";
document.body.appendChild(s);
```

## Output

```text
D:\AI legal System\data\pls_1961_1970_fast_capture.jsonl
D:\AI legal System\data\pls_1961_1970_fast_capture.state.json
D:\AI legal System\data\pls_1961_1970_fast_failures.jsonl
```

## Status

```powershell
Invoke-RestMethod http://127.0.0.1:8781/status
```
