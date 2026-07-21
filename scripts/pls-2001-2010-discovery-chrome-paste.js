(() => {
  "use strict";

  const API = "http://127.0.0.1:8790";
  const STATUS_ID = "codex-pls-2001-2010-discovery-launcher";

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

  const start = async () => {
    if (!/(^|\.)pakistanlawsite\.com$/i.test(location.hostname)) {
      throw new Error("Open the logged-in Pakistan Law Site page first.");
    }
    show("Checking the local 2001-2010 discovery server...");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let status;
    try {
      const response = await fetch(`${API}/status?t=${Date.now()}`, { cache: "no-store", mode: "cors", signal: controller.signal });
      if (!response.ok) throw new Error(`local discovery server HTTP ${response.status}`);
      status = await response.json();
    } finally {
      clearTimeout(timer);
    }
    if (status.from !== 2001 || status.to !== 2010) throw new Error(`wrong discovery range ${status.from}-${status.to}`);

    document.querySelectorAll("script[src*='pls_discover_range.js']").forEach((node) => node.remove());
    const script = document.createElement("script");
    script.async = true;
    script.src = `${API}/pls_discover_range.js?force=0&t=${Date.now()}`;
    script.onload = () => show(`PLS 2001-2010 discovery started\nExisting combined rows=${status.combined?.rows || 0}`, "#047857");
    script.onerror = () => show("Could not load the local 2001-2010 discovery runner.", "#991b1b");
    document.documentElement.appendChild(script);
  };

  start().catch((error) => show(`PLS discovery failed: ${error.message || error}\nStart: D:\\AI legal System\\ai-legal-system\\scripts\\Start PLS 2001-2010 Worklist Discovery.bat`, "#991b1b"));
})();

