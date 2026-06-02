-- CreateTable
CREATE TABLE "DiaryEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "caseNumber" TEXT,
    "lastDate" DATETIME,
    "title" TEXT NOT NULL,
    "courtName" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "proceeding" TEXT,
    "nextDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DiaryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DiaryEntry_userId_nextDate_idx" ON "DiaryEntry"("userId", "nextDate");
