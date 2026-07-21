(() => {
  "use strict";

  const API = "http://127.0.0.1:8793";
  const STATUS_ID = "codex-pls-2001-2010-launcher-status";

  const show = (message, color = "#111827") => {
    let box = document.getElementById(STATUS_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = STATUS_ID;
      box.style.cssText = "position:fixed;z-index:2147483647;left:14px;bottom:14px;max-width:700px;padding:12px 14px;border-radius:7px;font:14px/1.35 Arial,sans-serif;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,.35);white-space:pre-wrap";
      document.documentElement.appendChild(box);
    }
    box.style.background = color;
    box.textContent = message;
  };

  const stopOldRunner = () => {
    if (window.__codexPlsFastRunnerState) window.__codexPlsFastRunnerState.stop = true;
    window.__codexPlsFastRunnerActive = false;
    document.querySelectorAll("script[src*='pls_runner.js']").forEach((node) => node.remove());
  };

  const start = async () => {
    if (!/(^|\.)pakistanlawsite\.com$/i.test(location.hostname)) throw new Error("Open the logged-in Pakistan Law Site page first.");
    show("Checking the local 2001-2010 capture server...");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let status;
    try {
      const response = await fetch(`${API}/status?t=${Date.now()}`, { cache: "no-store", mode: "cors", signal: controller.signal });
      if (!response.ok) throw new Error(`local capture server HTTP ${response.status}`);
      status = await response.json();
    } finally {
      clearTimeout(timer);
    }
    if (status.years !== "2001-2010") throw new Error(`wrong capture range ${status.years || "unknown"}`);
    if (!status.total) throw new Error("2001-2010 worklist is empty; finish discovery first");

    stopOldRunner();
    const script = document.createElement("script");
    script.async = true;
    script.src = `${API}/pls_runner.js?workers=10&batch=1&delay=200&timeout=180000&fetchRetries=8&retryBase=1500&retryCap=30000&networkPauseThreshold=20&networkPauseMs=30000&heartbeatMs=30000&localTimeout=30000&sessionStop=20&sessionProbeMs=60000&sessionProbeMax=5&shortSkip=500&force=1&t=${Date.now()}`;
    script.onload = () => show(`PLS 2001-2010 capture started\nDownloaded=${status.completed || 0} remaining=${status.remaining || 0}\nWorkers=10 retries=8 timeout=180s`, "#047857");
    script.onerror = () => show("Could not load the local 2001-2010 capture runner.", "#991b1b");
    document.documentElement.appendChild(script);
  };

  start().catch((error) => show(`PLS capture failed: ${error.message || error}\nStart: D:\\AI legal System\\ai-legal-system\\scripts\\Start PLS 2001-2010 Fast Capture.bat`, "#991b1b"));
})();
