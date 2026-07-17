package com.ailegalsystem.pls.model;

public record InsertResult(
    boolean inserted,
    boolean duplicate,
    int legalJudgmentId,
    String message
) {
  public static InsertResult inserted(int id) {
    return new InsertResult(true, false, id, "inserted");
  }

  public static InsertResult duplicate(int id, String message) {
    return new InsertResult(false, true, id, message);
  }
}
