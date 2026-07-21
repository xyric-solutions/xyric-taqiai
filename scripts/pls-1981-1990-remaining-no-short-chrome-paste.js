/*
 * Paste this into Chrome DevTools Console on the logged-in PakistanLawSite tab.
 *
 * Start this first:
 *   D:\AI legal System\ai-legal-system\scripts\Start PLS 1981-1990 Remaining No Short Capture.bat
 */
(async () => {
  const api = "http://127.0.0.1:8786";

  const status = await fetch(api + "/status?t=" + Date.now(), { cache: "no-store" }).then((response) => {
    if (!response.ok) throw new Error("local server HTTP " + response.status);
    return response.json();
  });
  console.log("PLS remaining/no-short status:", status);

  document.querySelectorAll("script[src*='pls_runner.js']").forEach((script) => script.remove());

  if (window.__codexPlsFastRunnerState) {
    window.__codexPlsFastRunnerState.stop = true;
  }
  window.__codexPlsFastRunnerActive = false;

  const script = document.createElement("script");
  script.async = true;
  script.src =
    api + "/pls_runner.js"
    + "?workers=2"
    + "&batch=1"
    + "&delay=1200"
    + "&timeout=90000"
    + "&fetchRetries=4"
    + "&shortSkip=500"
    + "&sessionStop=20"
    + "&sessionProbeMs=60000"
    + "&sessionProbeMax=5"
    + "&force=1"
    + "&t=" + Date.now();

  script.onload = () => console.log("PLS remaining/no-short runner loaded:", script.src);
  document.documentElement.appendChild(script);
})();
