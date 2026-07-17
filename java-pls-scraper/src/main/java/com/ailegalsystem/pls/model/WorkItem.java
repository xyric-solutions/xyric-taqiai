package com.ailegalsystem.pls.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkItem {
  @JsonProperty("caseTypeId")
  private String caseTypeId;
  private String category;
  private String citation;
  private String court;
  private String title;
  private int year;
  @JsonProperty("row_no")
  private int rowNo;

  public WorkItem() {
  }

  public String caseTypeId() {
    return caseTypeId;
  }

  public String category() {
    return category;
  }

  public String citation() {
    return citation;
  }

  public String court() {
    return court;
  }

  public String title() {
    return title;
  }

  public int year() {
    return year;
  }

  public int rowNo() {
    return rowNo;
  }

  public void setCaseTypeId(String caseTypeId) {
    this.caseTypeId = caseTypeId;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public void setCitation(String citation) {
    this.citation = citation;
  }

  public void setCourt(String court) {
    this.court = court;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setYear(int year) {
    this.year = year;
  }

  @JsonProperty("row_no")
  public void setRowNo(int rowNo) {
    this.rowNo = rowNo;
  }

  public void validateYearRange(int fromYear, int toYear) {
    if (year < fromYear || year > toYear) {
      throw new IllegalArgumentException("Refusing out-of-range work item " + caseTypeId + " year=" + year + " range=" + fromYear + "-" + toYear);
    }
    if (caseTypeId == null || caseTypeId.isBlank()) {
      throw new IllegalArgumentException("Work item missing caseTypeId");
    }
  }

}
