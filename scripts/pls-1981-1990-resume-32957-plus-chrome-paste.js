/*
 * Paste this whole file into Chrome DevTools Console on the logged-in
 * PakistanLawSite tab after starting:
 *
 *   D:\AI legal System\ai-legal-system\scripts\Start PLS 1981-1990 Resume 32957 Plus.bat
 *
 * The local server reads D:\AI legal System\data\pls_1981_1990_fast_capture.jsonl
 * and automatically skips the 32956 already captured judgments.
 */
(async function pls1981To1990Resume32957Plus() {
  "use strict";

  const api = "http://127.0.0.1:8784";
  const expectedCompletedAtLeast = 32956;

  function overlay(message, tone) {
    let box = document.getElementById("codex-pls-resume-32957-status");
    if (!box) {
      box = document.createElement("div");
      box.id = "codex-pls-resume-32957-status";
      box.style.cssText = [
        "position:fixed",
        "z-index:2147483647",
        "left:14px",
        "bottom:14px",
        "max-width:760px",
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
    const colors = { ok: "#059669", warn: "#92400e", error: "#991b1b", info: "#111827" };
    box.style.background = colors[tone || "info"] || colors.info;
    box.textContent = message;
  }

  if (!/pakistanlawsite\.com$/i.test(location.hostname)) {
    overlay("Open the logged-in PakistanLawSite tab first, then paste this script again.", "error");
    return;
  }

  overlay("Checking local 1981-1990 resume server on " + api + " ...", "info");

  let status;
  try {
    status = await fetch(api + "/status?t=" + Date.now(), { cache: "no-store" }).then((res) => {
      if (!res.ok) throw new Error("local server HTTP " + res.status);
      return res.json();
    });
  } catch (error) {
    overlay(
      "Local server is not running.\n\nRun this Windows script first:\n"
        + "D:\\AI legal System\\ai-legal-system\\scripts\\Start PLS 1981-1990 Resume 32957 Plus.bat\n\n"
        + "Then paste this Chrome script again.\nError: " + (error && error.message ? error.message : error),
      "error"
    );
    return;
  }

  if (status.years !== "1981-1990") {
    overlay("Wrong local server range: " + (status.years || "unknown") + ". Start the 1981-1990 resume server.", "error");
    return;
  }

  const completed = Number(status.completed || 0);
  const remaining = Number(status.remaining || 0);
  const tone = completed >= expectedCompletedAtLeast ? "ok" : "warn";
  overlay(
    "Resume server ready.\n"
      + "Completed=" + completed + " remaining=" + remaining + " total=" + (status.total || 0) + "\n"
      + (completed >= expectedCompletedAtLeast
          ? "Will continue from the remaining jobs after local capture 32956."
          : "Warning: completed is below 32956. Check the JSONL/state file before continuing."),
    tone
  );

  try {
    if (window.__codexPlsFastRunnerState) window.__codexPlsFastRunnerState.stop = true;
    window.__codexPlsFastRunnerActive = false;
  } catch (error) {}
  document.querySelectorAll("script[src*='pls_runner.js']").forEach((node) => node.remove());

  const runner = document.createElement("script");
  runner.async = true;
  runner.src =
    api + "/pls_runner.js"
      + "?workers=2"
      + "&batch=1"
      + "&delay=1200"
      + "&timeout=90000"
      + "&fetchRetries=8"
      + "&sessionStop=20"
      + "&sessionProbeMs=60000"
      + "&sessionProbeMax=5"
      + "&force=1"
      + "&t=" + Date.now();
  runner.onload = () => overlay("PLS 1981-1990 stable resume runner loaded. Remaining at start=" + remaining, "ok");
  runner.onerror = () => overlay("Could not load runner from " + runner.src, "error");
  document.documentElement.appendChild(runner);
})();
