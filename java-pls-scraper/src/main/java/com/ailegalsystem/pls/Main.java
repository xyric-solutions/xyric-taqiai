package com.ailegalsystem.pls;

import com.ailegalsystem.pls.config.AppConfig;
import com.ailegalsystem.pls.scraper.PakistanLawSiteScraper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class Main {
  private static final Logger log = LoggerFactory.getLogger(Main.class);

  private Main() {
  }

  public static void main(String[] args) {
    try {
      if (args.length > 0 && "--help".equals(args[0])) {
        printHelp();
        return;
      }
      AppConfig config = AppConfig.fromArgs(args);
      log.info("PakistanLawSite Java scraper range={}..{} worklist={} env={}",
          config.fromYear(), config.toYear(), config.worklistPath(), config.envPath());
      new PakistanLawSiteScraper(config).run();
    } catch (Throwable error) {
      log.error("Fatal scraper error", error);
      System.exit(1);
    }
  }

  private static void printHelp() {
    System.out.println("""
        Production Java PakistanLawSite scraper.

        Required:
          .env with DATABASE_URL=postgresql://...

        Example:
          java -jar target/java-pls-scraper-1.0.0.jar --from 1981 --to 1990 --workers 4 --batch 1

        Important options:
          --env <path>                         default ../.env
          --worklist <path>                    default ../../data/pls_all_courts_<from>_<to>_worklist.json
          --browser-profile <path>             persistent Playwright profile, keeps PLS login
          --workers <1-8>                      default 4
          --batch <1-10>                       default 1
          --max-attempts <n>                   default 10
          --fetch-headnotes                    enabled by default in config
          --headless                           run browser headless after a saved login exists
          --keep-display-awake                 also prevent display sleep on Windows
        """);
  }
}
