/*
 * PakistanLawSite 1981-1990 worklist discovery launcher.
 *
 * Paste this whole file into the Chrome DevTools Console while you are on the
 * logged-in PakistanLawSite page with the Index/Caselaw search controls visible.
 *
 * Start the local discovery server first:
 *   D:\AI legal System\ai-legal-system\scripts\Start PLS 1981-1990 Worklist Discovery.bat
 */
(function pls1981To1990DiscoveryLauncher() {
  "use strict";

  var CONFIG = {
    api: "http://127.0.0.1:8780",
    years: "1981-1990",
    serverStartHint: 'Run this in PowerShell/CMD, not Chrome: "D:\\AI legal System\\ai-legal-system\\scripts\\Start PLS 1981-1990 Worklist Discovery.bat"'
  };

  function overlay(message, tone) {
    var box = document.getElementById("codex-pls-1981-1990-discovery-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-1981-1990-discovery-status";
      box.style.cssText = [
        "position:fixed",
        "z-index:2147483647",
        "left:14px",
        "bottom:14px",
        "max-width:680px",
        "padding:12px 14px",
        "border-radius:7px",
        "font:14px/1.35 Arial,sans-serif",
        "color:#fff",
        "background:#111",
        "box-shadow:0 8px 28px rgba(0,0,0,.35)",
        "white-space:pre-wrap"
      ].join(";");
      document.documentElement.appendChild(box);
    }
    var colors = { ok: "#059669", warn: "#92400e", error: "#991b1b", info: "#111827" };
    box.style.background = colors[tone || "info"] || colors.info;
    box.textContent = message;
  }

  function withTimeout(promise, ms, label) {
    var timer;
    return Promise.race([
      promise,
      new Promise(function (_resolve, reject) {
        timer = setTimeout(function () {
          reject(new Error((label || "request") + " timed out after " + ms + "ms"));
        }, ms);
      })
    ]).finally(function () {
      clearTimeout(timer);
    });
  }

  function fetchStatus() {
    return withTimeout(
      fetch(CONFIG.api + "/status?t=" + Date.now(), { method: "GET", mode: "cors", cache: "no-store" })
        .then(function (res) {
          if (!res.ok) throw new Error("local discovery server HTTP " + res.status);
          return res.json();
        }),
      5000,
      "local discovery status"
    );
  }

  function validatePage() {
    if (!/pakistanlawsite\.com$/i.test(location.hostname)) {
      overlay("Open the logged-in PakistanLawSite tab first, then paste this script again.", "error");
      return false;
    }
    return true;
  }

  function validateServer(status) {
    if (!status || status.from !== 1981 || status.to !== 1990) {
      overlay(
        "Local discovery server is not serving 1981-1990.\n"
          + "Current range: " + (status ? status.from + "-" + status.to : "unknown") + "\n\n"
          + CONFIG.serverStartHint,
        "error"
      );
      return false;
    }
    return true;
  }

  function injectDiscovery(status) {
    Array.prototype.slice.call(document.querySelectorAll("script[src*='pls_discover_range.js']")).forEach(function (node) {
      try { node.remove(); } catch (error) {}
    });
    var src = CONFIG.api + "/pls_discover_range.js?force=1&t=" + Date.now();
    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = function () {
      overlay(
        "PLS " + CONFIG.years + " discovery loaded.\n"
          + "Existing combined rows=" + (status.combined && status.combined.rows || 0),
        "ok"
      );
    };
    script.onerror = function () {
      overlay("Could not load discovery runner from " + src + "\n\n" + CONFIG.serverStartHint, "error");
    };
    document.documentElement.appendChild(script);
  }

  if (!validatePage()) return;
  overlay("Checking local PLS " + CONFIG.years + " discovery server on " + CONFIG.api + " ...", "info");
  fetchStatus()
    .then(function (status) {
      if (!validateServer(status)) return;
      injectDiscovery(status);
    })
    .catch(function (error) {
      overlay(
        "Local discovery server is not reachable at " + CONFIG.api + ".\n\n"
          + CONFIG.serverStartHint + "\n\n"
          + "After the server starts, paste this Chrome script again.\n"
          + "Error: " + (error && error.message ? error.message : error),
        "error"
      );
    });
})();
