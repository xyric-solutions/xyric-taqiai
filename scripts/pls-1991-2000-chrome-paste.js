/*
 * PakistanLawSite 1991-2000 Chrome paste download/capture launcher.
 *
 * Paste this whole file into the Chrome DevTools Console while you are on the
 * logged-in PakistanLawSite page. It connects the page to the local resilient
 * capture server on 127.0.0.1:8792.
 *
 * Start the local capture server first:
 *   D:\AI legal System\ai-legal-system\scripts\Start PLS 1991-2000 Fast Capture.bat
 */
(function pls1991To2000ChromeLauncher() {
  "use strict";

  var CONFIG = {
    api: "http://127.0.0.1:8792",
    years: "1991-2000",
    expectedTotal: null,
    workers: 10,
    batch: 1,
    delayMs: 200,
    timeoutMs: 180000,
    fetchRetries: 8,
    retryBaseMs: 1500,
    retryCapMs: 30000,
    networkPauseThreshold: 20,
    networkPauseMs: 30000,
    heartbeatMs: 30000,
    localTimeoutMs: 30000,
    sessionStopThreshold: 20,
    sessionProbeMs: 60000,
    sessionProbeMax: 5,
    shortSkipLength: 500,
    serverStartHint: 'Run this in PowerShell/CMD, not Chrome: "D:\\AI legal System\\ai-legal-system\\scripts\\Start PLS 1991-2000 Fast Capture.bat"'
  };

  function overlay(message, tone) {
    var box = document.getElementById("codex-pls-1991-2000-launcher-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-1991-2000-launcher-status";
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

  function stopPreviousRunners() {
    try {
      if (window.__codexPlsFastRunnerState) window.__codexPlsFastRunnerState.stop = true;
    } catch (error) {}
    try { window.__codexPlsFastRunnerActive = false; } catch (error) {}
    try {
      if (window.__codexPlsPgRunnerState) window.__codexPlsPgRunnerState.stop = true;
    } catch (error) {}
    try { window.__codexPlsPgRunnerActive = false; } catch (error) {}
    Array.prototype.slice.call(document.querySelectorAll("script[src*='pls_runner.js']")).forEach(function (node) {
      try { node.remove(); } catch (error) {}
    });
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
          if (!res.ok) throw new Error("local server HTTP " + res.status);
          return res.json();
        }),
      5000,
      "local server status"
    );
  }

  function injectRunner(status) {
    stopPreviousRunners();
    var src = CONFIG.api
      + "/pls_runner.js?workers=" + encodeURIComponent(CONFIG.workers)
      + "&batch=" + encodeURIComponent(CONFIG.batch)
      + "&delay=" + encodeURIComponent(CONFIG.delayMs)
      + "&timeout=" + encodeURIComponent(CONFIG.timeoutMs)
      + "&fetchRetries=" + encodeURIComponent(CONFIG.fetchRetries)
      + "&retryBase=" + encodeURIComponent(CONFIG.retryBaseMs)
      + "&retryCap=" + encodeURIComponent(CONFIG.retryCapMs)
      + "&networkPauseThreshold=" + encodeURIComponent(CONFIG.networkPauseThreshold)
      + "&networkPauseMs=" + encodeURIComponent(CONFIG.networkPauseMs)
      + "&heartbeatMs=" + encodeURIComponent(CONFIG.heartbeatMs)
      + "&localTimeout=" + encodeURIComponent(CONFIG.localTimeoutMs)
      + "&sessionStop=" + encodeURIComponent(CONFIG.sessionStopThreshold)
      + "&sessionProbeMs=" + encodeURIComponent(CONFIG.sessionProbeMs)
      + "&sessionProbeMax=" + encodeURIComponent(CONFIG.sessionProbeMax)
      + "&shortSkip=" + encodeURIComponent(CONFIG.shortSkipLength)
      + "&force=1&t=" + Date.now();

    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = function () {
      overlay(
        "PLS " + CONFIG.years + " download runner loaded.\n"
          + "Server completed=" + (status.completed || 0)
          + " remaining=" + (status.remaining || 0)
          + " manualReview=" + (status.manualReview || 0)
          + "\nWorkers=" + CONFIG.workers + " batch=" + CONFIG.batch
          + " retries=" + CONFIG.fetchRetries + " timeout=" + Math.round(CONFIG.timeoutMs / 1000) + "s",
        "ok"
      );
    };
    script.onerror = function () {
      overlay("Could not load local runner from " + src + "\n\n" + CONFIG.serverStartHint, "error");
    };
    document.documentElement.appendChild(script);
  }

  function validatePage() {
    if (!/pakistanlawsite\.com$/i.test(location.hostname)) {
      overlay("Open the logged-in PakistanLawSite tab first, then paste this script again.", "error");
      return false;
    }
    return true;
  }

  function validateServer(status) {
    if (!status || status.years !== CONFIG.years) {
      overlay(
        "Local server is not serving the " + CONFIG.years + " range.\n"
          + "Current server years: " + (status && status.years ? status.years : "unknown") + "\n\n"
          + CONFIG.serverStartHint,
        "error"
      );
      return false;
    }
    if (!status.total || status.total <= 0) {
      overlay(
        "The 1991-2000 capture server has zero worklist rows.\n"
          + "Run worklist discovery first, then restart the capture server.\n\n"
          + 'Discovery: "D:\\AI legal System\\ai-legal-system\\scripts\\Start PLS 1991-2000 Worklist Discovery.bat"',
        "error"
      );
      return false;
    }
    return true;
  }

  if (!validatePage()) return;
  overlay("Checking local PLS " + CONFIG.years + " capture server on " + CONFIG.api + " ...", "info");
  fetchStatus()
    .then(function (status) {
      if (!validateServer(status)) return;
      if (status.paused) {
        overlay(
          "Local server is cooling down, but runner can be loaded.\n"
            + "Reason: " + (status.pauseReason || "paused")
            + "\nCompleted=" + (status.completed || 0)
            + " remaining=" + (status.remaining || 0),
          "warn"
        );
      }
      injectRunner(status);
    })
    .catch(function (error) {
      overlay(
        "Local capture server is not reachable at " + CONFIG.api + ".\n\n"
          + CONFIG.serverStartHint + "\n\n"
          + "After the server starts, paste this Chrome script again.\n"
          + "Error: " + (error && error.message ? error.message : error),
        "error"
      );
    });
})();
