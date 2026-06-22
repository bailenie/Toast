-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'moyu_otter',
    "bio" TEXT NOT NULL DEFAULT '',
    "salary" REAL NOT NULL DEFAULT 250,
    "workStart" TEXT NOT NULL DEFAULT '09:00',
    "workEnd" TEXT NOT NULL DEFAULT '18:00',
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🐟',
    "code" TEXT,
    "ownerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "memberCount" INTEGER NOT NULL DEFAULT 1,
    "petFishName" TEXT NOT NULL DEFAULT '懵懂胖金鱼',
    "petFishLevel" INTEGER NOT NULL DEFAULT 1,
    "petFishGrowth" INTEGER NOT NULL DEFAULT 0,
    "petFishType" TEXT NOT NULL DEFAULT '肥嘟嘟胖金鱼',
    "coinBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Circle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCircle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserCircle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCircle_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "circleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invite_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invite_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UnoCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "rarity" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnoCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MoyuStat" (
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
    CONSTRAINT "MoyuStat_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SignRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,
    "signDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SignRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SignRecord_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Decoration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "CircleDecoration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "circleId" TEXT NOT NULL,
    "decorationId" TEXT NOT NULL,
    "purchasedBy" TEXT NOT NULL,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CircleDecoration_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CircleDecoration_decorationId_fkey" FOREIGN KEY ("decorationId") REFERENCES "Decoration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CircleDecoration_purchasedBy_fkey" FOREIGN KEY ("purchasedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExchangeRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "circleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "decorationId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExchangeRecord_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExchangeRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExchangeRecord_decorationId_fkey" FOREIGN KEY ("decorationId") REFERENCES "Decoration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Circle_code_key" ON "Circle"("code");

-- CreateIndex
CREATE INDEX "Circle_code_idx" ON "Circle"("code");

-- CreateIndex
CREATE INDEX "Circle_ownerId_idx" ON "Circle"("ownerId");

-- CreateIndex
CREATE INDEX "UserCircle_userId_idx" ON "UserCircle"("userId");

-- CreateIndex
CREATE INDEX "UserCircle_circleId_idx" ON "UserCircle"("circleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCircle_userId_circleId_key" ON "UserCircle"("userId", "circleId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_code_key" ON "Invite"("code");

-- CreateIndex
CREATE INDEX "Invite_circleId_idx" ON "Invite"("circleId");

-- CreateIndex
CREATE INDEX "Invite_status_idx" ON "Invite"("status");

-- CreateIndex
CREATE INDEX "UnoCard_userId_idx" ON "UnoCard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UnoCard_userId_cardId_key" ON "UnoCard"("userId", "cardId");

-- CreateIndex
CREATE INDEX "MoyuStat_userId_idx" ON "MoyuStat"("userId");

-- CreateIndex
CREATE INDEX "MoyuStat_circleId_idx" ON "MoyuStat"("circleId");

-- CreateIndex
CREATE UNIQUE INDEX "MoyuStat_userId_circleId_key" ON "MoyuStat"("userId", "circleId");

-- CreateIndex
CREATE INDEX "SignRecord_userId_idx" ON "SignRecord"("userId");

-- CreateIndex
CREATE INDEX "SignRecord_circleId_idx" ON "SignRecord"("circleId");

-- CreateIndex
CREATE UNIQUE INDEX "SignRecord_userId_circleId_signDate_key" ON "SignRecord"("userId", "circleId", "signDate");

-- CreateIndex
CREATE INDEX "CircleDecoration_circleId_idx" ON "CircleDecoration"("circleId");

-- CreateIndex
CREATE UNIQUE INDEX "CircleDecoration_circleId_decorationId_key" ON "CircleDecoration"("circleId", "decorationId");

-- CreateIndex
CREATE INDEX "ExchangeRecord_circleId_idx" ON "ExchangeRecord"("circleId");

-- CreateIndex
CREATE INDEX "ExchangeRecord_createdAt_idx" ON "ExchangeRecord"("createdAt");
