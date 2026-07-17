package com.ailegalsystem.pls.progress;

import com.ailegalsystem.pls.config.AppConfig;
import com.ailegalsystem.pls.model.WorkItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.util.List;

public final class ProgressManager {
  private static final Logger log = LoggerFactory.getLogger(ProgressManager.class);
  private final AppConfig config;
  private final ObjectMapper mapper = new ObjectMapper();

  public ProgressManager(AppConfig config) {
    this.config = config;
  }

  public List<WorkItem> loadWorklist() throws Exception {
    if (!Files.exists(config.worklistPath())) {
      throw new IllegalArgumentException("Worklist not found: " + config.worklistPath());
    }
    List<WorkItem> items = mapper.readValue(config.worklistPath().toFile(), new TypeReference<List<WorkItem>>() {});
    for (WorkItem item : items) {
      item.validateYearRange(config.fromYear(), config.toYear());
    }
    log.info("Loaded {} worklist rows={} from {}", config.rangeSlug(), items.size(), config.worklistPath());
    return items;
  }
}
