-- 修改 UnoCard 表的外键约束为级联删除
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_UnoCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "rarity" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnoCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UnoCard_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_UnoCard" ("id", "userId", "circleId", "cardId", "cardName", "count", "rarity", "color", "createdAt", "updatedAt")
SELECT "id", "userId", "circleId", "cardId", "cardName", "count", "rarity", "color", "createdAt", "updatedAt" FROM "UnoCard";

DROP TABLE "UnoCard";
ALTER TABLE "new_UnoCard" RENAME TO "UnoCard";

CREATE INDEX "UnoCard_userId_idx" ON "UnoCard"("userId");
CREATE INDEX "UnoCard_circleId_idx" ON "UnoCard"("circleId");
CREATE UNIQUE INDEX "UnoCard_circleId_cardId_key" ON "UnoCard"("circleId", "cardId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- 修改 UserCircle 表的外键约束为级联删除
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_UserCircle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserCircle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCircle_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_UserCircle" ("id", "userId", "circleId", "joinedAt", "createdAt")
SELECT "id", "userId", "circleId", "createdAt", "createdAt" FROM "UserCircle";

DROP TABLE "UserCircle";
ALTER TABLE "new_UserCircle" RENAME TO "UserCircle";

CREATE UNIQUE INDEX "UserCircle_userId_circleId_key" ON "UserCircle"("userId", "circleId");
CREATE INDEX "UserCircle_userId_idx" ON "UserCircle"("userId");
CREATE INDEX "UserCircle_circleId_idx" ON "UserCircle"("circleId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- 为其他表添加级联删除
-- MoyuStat 表
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_MoyuStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "todayCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "lastMoyuDate" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MoyuStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MoyuStat_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_MoyuStat" ("id", "userId", "userName", "circleId", "todayCount", "totalCount", "lastMoyuDate", "createdAt", "updatedAt")
SELECT "id", "userId", "userName", "circleId", "todayCount", "totalCount", "lastMoyuDate", "createdAt", "updatedAt" FROM "MoyuStat";

DROP TABLE "MoyuStat";
ALTER TABLE "new_MoyuStat" RENAME TO "MoyuStat";

CREATE UNIQUE INDEX "MoyuStat_userId_circleId_key" ON "MoyuStat"("userId", "circleId");
CREATE INDEX "MoyuStat_userId_idx" ON "MoyuStat"("userId");
CREATE INDEX "MoyuStat_circleId_idx" ON "MoyuStat"("circleId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- SignRecord 表
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_SignRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "signDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignRecord_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_SignRecord" ("id", "userId", "circleId", "signDate", "createdAt")
SELECT "id", "userId", "circleId", "signDate", "createdAt" FROM "SignRecord";

DROP TABLE "SignRecord";
ALTER TABLE "new_SignRecord" RENAME TO "SignRecord";

CREATE UNIQUE INDEX "SignRecord_userId_circleId_signDate_key" ON "SignRecord"("userId", "circleId", "signDate");
CREATE INDEX "SignRecord_userId_idx" ON "SignRecord"("userId");
CREATE INDEX "SignRecord_circleId_idx" ON "SignRecord"("circleId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CircleDecoration 表
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_CircleDecoration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "circleId" TEXT NOT NULL,
    "decorationId" TEXT NOT NULL,
    "purchasedBy" TEXT NOT NULL,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CircleDecoration_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CircleDecoration_decorationId_fkey" FOREIGN KEY ("decorationId") REFERENCES "Decoration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CircleDecoration_purchasedBy_fkey" FOREIGN KEY ("purchasedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_CircleDecoration" ("id", "circleId", "decorationId", "purchasedBy", "purchasedAt")
SELECT "id", "circleId", "decorationId", "purchasedBy", "purchasedAt" FROM "CircleDecoration";

DROP TABLE "CircleDecoration";
ALTER TABLE "new_CircleDecoration" RENAME TO "CircleDecoration";

CREATE UNIQUE INDEX "CircleDecoration_circleId_decorationId_key" ON "CircleDecoration"("circleId", "decorationId");
CREATE INDEX "CircleDecoration_circleId_idx" ON "CircleDecoration"("circleId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- ExchangeRecord 表
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_ExchangeRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "circleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decorationId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeRecord_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExchangeRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExchangeRecord_decorationId_fkey" FOREIGN KEY ("decorationId") REFERENCES "Decoration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_ExchangeRecord" ("id", "circleId", "userId", "decorationId", "cost", "createdAt")
SELECT "id", "circleId", "userId", "decorationId", "cost", "createdAt" FROM "ExchangeRecord";

DROP TABLE "ExchangeRecord";
ALTER TABLE "new_ExchangeRecord" RENAME TO "ExchangeRecord";

CREATE INDEX "ExchangeRecord_circleId_idx" ON "ExchangeRecord"("circleId");
CREATE INDEX "ExchangeRecord_createdAt_idx" ON "ExchangeRecord"("createdAt");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;