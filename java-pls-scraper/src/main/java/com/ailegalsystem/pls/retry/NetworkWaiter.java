package com.ailegalsystem.pls.retry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

public final class NetworkWaiter {
  private static final Logger log = LoggerFactory.getLogger(NetworkWaiter.class);
  private final HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
  private final List<URI> probes = List.of(
      URI.create("https://www.pakistanlawsite.com/Login/Check"),
      URI.create("https://www.google.com/generate_204")
  );

  public void waitUntilOnline(String reason) {
    boolean announced = false;
    while (!Thread.currentThread().isInterrupted()) {
      if (isOnline()) {
        if (announced) log.info("Internet available again; resuming {}", reason);
        return;
      }
      if (!announced) {
        log.warn("Internet appears offline; waiting before resuming {}", reason);
        announced = true;
      }
      try {
        Thread.sleep(5000);
      } catch (InterruptedException interrupted) {
        Thread.currentThread().interrupt();
        return;
      }
    }
  }

  private boolean isOnline() {
    for (URI probe : probes) {
      try {
        HttpRequest req = HttpRequest.newBuilder(probe)
            .timeout(Duration.ofSeconds(5))
            .GET()
            .build();
        int status = client.send(req, HttpResponse.BodyHandlers.discarding()).statusCode();
        if (status > 0 && status < 500) return true;
      } catch (Exception ignored) {
      }
    }
    return false;
  }
}
