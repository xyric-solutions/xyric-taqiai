package com.ailegalsystem.pls.util;

import com.sun.jna.Library;
import com.sun.jna.Native;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Locale;

public final class WindowsSleepPreventer implements AutoCloseable {
  private static final Logger log = LoggerFactory.getLogger(WindowsSleepPreventer.class);
  private static final int ES_CONTINUOUS = 0x80000000;
  private static final int ES_SYSTEM_REQUIRED = 0x00000001;
  private static final int ES_DISPLAY_REQUIRED = 0x00000002;
  private static final int ES_AWAYMODE_REQUIRED = 0x00000040;

  private final boolean enabled;

  private WindowsSleepPreventer(boolean enabled) {
    this.enabled = enabled;
  }

  public static WindowsSleepPreventer enable(boolean keepDisplayAwake) {
    if (!System.getProperty("os.name", "").toLowerCase(Locale.ROOT).contains("windows")) {
      return new WindowsSleepPreventer(false);
    }
    int flags = ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_AWAYMODE_REQUIRED;
    if (keepDisplayAwake) flags |= ES_DISPLAY_REQUIRED;
    try {
      Kernel32 kernel32 = Native.load("kernel32", Kernel32.class);
      kernel32.SetThreadExecutionState(flags);
      log.info("Windows sleep prevention enabled while scraper runs");
      return new WindowsSleepPreventer(true);
    } catch (Throwable error) {
      log.warn("Could not enable Windows sleep prevention: {}", error.toString());
      return new WindowsSleepPreventer(false);
    }
  }

  @Override
  public void close() {
    if (!enabled) return;
    try {
      Kernel32 kernel32 = Native.load("kernel32", Kernel32.class);
      kernel32.SetThreadExecutionState(ES_CONTINUOUS);
      log.info("Windows sleep prevention released");
    } catch (Throwable error) {
      log.warn("Could not release Windows sleep prevention: {}", error.toString());
    }
  }

  private interface Kernel32 extends Library {
    int SetThreadExecutionState(int flags);
  }
}
