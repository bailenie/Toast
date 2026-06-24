/*
  Warnings:

  - Added the required column `circleId` to the `UnoCard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
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
    CONSTRAINT "UnoCard_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UnoCard" ("cardId", "cardName", "color", "count", "createdAt", "id", "rarity", "updatedAt", "userId") SELECT "cardId", "cardName", "color", "count", "createdAt", "id", "rarity", "updatedAt", "userId" FROM "UnoCard";
DROP TABLE "UnoCard";
ALTER TABLE "new_UnoCard" RENAME TO "UnoCard";
CREATE INDEX "UnoCard_userId_idx" ON "UnoCard"("userId");
CREATE INDEX "UnoCard_circleId_idx" ON "UnoCard"("circleId");
CREATE UNIQUE INDEX "UnoCard_circleId_cardId_key" ON "UnoCard"("circleId", "cardId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
