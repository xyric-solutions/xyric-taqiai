-- CreateTable
CREATE TABLE "Matter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caseNo" TEXT,
    "court" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "role" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientCnic" TEXT,
    "opponentName" TEXT,
    "judgeName" TEXT,
    "dateFiled" DATETIME,
    "nextHearing" DATETIME,
    "notes" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Matter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatterHearing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matterId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "purpose" TEXT,
    "result" TEXT,
    "nextDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatterHearing_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "Matter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedJudgment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "citation" TEXT NOT NULL,
    "title" TEXT,
    "court" TEXT,
    "year" TEXT,
    "summary" TEXT,
    "content" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Matter_userId_status_idx" ON "Matter"("userId", "status");

-- CreateIndex
CREATE INDEX "Matter_userId_nextHearing_idx" ON "Matter"("userId", "nextHearing");

-- CreateIndex
CREATE INDEX "SavedJudgment_userId_idx" ON "SavedJudgment"("userId");
