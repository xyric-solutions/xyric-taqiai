(() => {
  "use strict";

  const API = "http://127.0.0.1:8792";
  const STATUS_ID = "codex-pls-remaining-status";

  const show = (message, color = "#111827") => {
    let box = document.getElementById(STATUS_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = STATUS_ID;
      box.style.cssText = [
        "position:fixed",
        "z-index:2147483647",
        "left:14px",
        "bottom:14px",
        "max-width:700px",
        "padding:12px 14px",
        "border-radius:7px",
        "font:14px/1.35 Arial,sans-serif",
        "color:#fff",
        "box-shadow:0 8px 28px rgba(0,0,0,.35)",
        "white-space:pre-wrap"
      ].join(";");
      document.documentElement.appendChild(box);
    }
    box.style.background = color;
    box.textContent = message;
  };

  const stopOldRunner = () => {
    if (window.__codexPlsFastRunnerState) window.__codexPlsFastRunnerState.stop = true;
    window.__codexPlsFastRunnerActive = false;
    document.querySelectorAll("script[src*='127.0.0.1:8792/pls_runner.js']").forEach((node) => node.remove());
  };

  const fetchStatus = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`${API}/status?t=${Date.now()}`, {
        cache: "no-store",
        mode: "cors",
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`local server HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  };

  const start = async () => {
    if (!/(^|\.)pakistanlawsite\.com$/i.test(location.hostname)) {
      throw new Error("Open the logged-in Pakistan Law Site page before running this script.");
    }

    show("Checking the local 1991-2000 resume server...");
    const status = await fetchStatus();
    if (status.years !== "1991-2000") throw new Error(`Wrong local range: ${status.years || "unknown"}`);

    if (Number(status.remaining || 0) === 0) {
      show(`PLS 1991-2000 is already complete. Downloaded=${status.completed || 0}`, "#047857");
      return;
    }

    stopOldRunner();
    const script = document.createElement("script");
    script.async = true;
    script.src = `${API}/pls_runner.js?workers=10&batch=1&delay=200&timeout=180000&fetchRetries=8&retryBase=1500&retryCap=30000&networkPauseThreshold=20&networkPauseMs=30000&heartbeatMs=30000&localTimeout=30000&sessionStop=20&sessionProbeMs=60000&sessionProbeMax=5&shortSkip=500&force=1&t=${Date.now()}`;
    script.onload = () => show(
      `PLS 1991-2000 resumed\nDownloaded=${status.completed || 0} remaining=${status.remaining || 0}\nWorkers=10 batch=1 retries=8 timeout=180s`,
      "#047857"
    );
    script.onerror = () => show("Could not load the local runner. Start the Remaining Resume BAT file and paste this script again.", "#991b1b");
    document.documentElement.appendChild(script);
  };

  start().catch((error) => show(`PLS resume failed: ${error.message || error}`, "#991b1b"));
})();
