package com.ailegalsystem.pls.scraper;

import com.ailegalsystem.pls.config.AppConfig;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Cookie;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.WaitUntilState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

public final class PlaywrightSessionManager implements AutoCloseable {
  private static final Logger log = LoggerFactory.getLogger(PlaywrightSessionManager.class);
  private final AppConfig config;
  private Playwright playwright;
  private BrowserContext context;
  private Page page;
  private String cookieHeader;
  private long lastCookieRefresh;

  public PlaywrightSessionManager(AppConfig config) {
    this.config = config;
  }

  public synchronized String cookieHeader() {
    if (cookieHeader == null || System.currentTimeMillis() - lastCookieRefresh > 120_000) {
      refreshBrowserAndCookies(false);
    }
    return cookieHeader;
  }

  public synchronized void refreshBrowserAndCookies(boolean forceRestart) {
    try {
      if (forceRestart) closeContext();
      ensureBrowser();
      ensureLoggedIn();
      List<Cookie> cookies = context.cookies("https://www.pakistanlawsite.com");
      cookieHeader = cookies.stream()
          .filter(cookie -> cookie.name != null && cookie.value != null)
          .map(cookie -> cookie.name + "=" + cookie.value)
          .collect(Collectors.joining("; "));
      lastCookieRefresh = System.currentTimeMillis();
      if (cookieHeader.isBlank()) {
        throw new IllegalStateException("PakistanLawSite cookie header is empty after login check");
      }
      log.info("Refreshed PakistanLawSite cookies from Playwright profile; cookies={}", cookies.size());
    } catch (RuntimeException error) {
      closeContext();
      throw error;
    } catch (Exception error) {
      closeContext();
      throw new IllegalStateException("Could not refresh PakistanLawSite browser session", error);
    }
  }

  private void ensureBrowser() throws Exception {
    if (playwright == null) playwright = Playwright.create();
    if (context != null && page != null) return;
    Files.createDirectories(config.browserProfileDir());
    BrowserType.LaunchPersistentContextOptions options = new BrowserType.LaunchPersistentContextOptions()
        .setHeadless(config.headless())
        .setTimeout(60_000);
    context = playwright.chromium().launchPersistentContext(config.browserProfileDir(), options);
    page = context.pages().isEmpty() ? context.newPage() : context.pages().get(0);
  }

  private void ensureLoggedIn() {
    page.navigate("https://www.pakistanlawsite.com/Login/Check", new Page.NavigateOptions()
        .setWaitUntil(WaitUntilState.DOMCONTENTLOADED)
        .setTimeout(60_000));
    for (int i = 0; i < 120; i++) {
      String url = page.url();
      String content = page.content();
      if (!looksLikeLoginOrShell(url, content)) {
        return;
      }
      if (i == 0) {
        log.warn("PakistanLawSite login/session page detected. Please login in the opened Playwright browser. The scraper will continue automatically.");
      }
      page.waitForTimeout(5000);
      page.reload(new Page.ReloadOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED).setTimeout(60_000));
    }
    throw new IllegalStateException("PakistanLawSite login was not completed within 10 minutes");
  }

  private boolean looksLikeLoginOrShell(String url, String html) {
    String combined = ((url == null ? "" : url) + " " + (html == null ? "" : html)).toLowerCase(Locale.ROOT);
    return combined.contains("password")
        || combined.contains("sign in")
        || combined.contains("captcha")
        || combined.contains("subscription expired")
        || combined.contains("unauthorized");
  }

  private void closeContext() {
    try {
      if (context != null) context.close();
    } catch (Exception ignored) {
    }
    context = null;
    page = null;
    cookieHeader = null;
  }

  @Override
  public synchronized void close() {
    closeContext();
    try {
      if (playwright != null) playwright.close();
    } catch (Exception ignored) {
    }
    playwright = null;
  }
}
