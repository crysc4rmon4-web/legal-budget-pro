/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `subtotal` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `taxAmount` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `total` on the `Budget` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `lineTotal` on the `BudgetLine` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `BudgetLine` table. All the data in the column will be lost.
  - Added the required column `clientAddressSnapshot` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientNameSnapshot` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientNifSnapshot` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerAddressSnapshot` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerNameSnapshot` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuerNifSnapshot` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineTotalInCents` to the `BudgetLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPriceInCents` to the `BudgetLine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerificationToken";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "series" TEXT NOT NULL DEFAULT 'PRE',
    "budgetNumber" INTEGER NOT NULL,
    "issuerNameSnapshot" TEXT NOT NULL,
    "issuerNifSnapshot" TEXT NOT NULL,
    "issuerAddressSnapshot" TEXT NOT NULL,
    "clientNameSnapshot" TEXT NOT NULL,
    "clientNifSnapshot" TEXT NOT NULL,
    "clientAddressSnapshot" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "taxAmount" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" TEXT,
    "previousHash" TEXT,
    "isVerifactuSync" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Budget_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Budget_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget" ("budgetNumber", "clientId", "companyId", "createdAt", "hash", "id", "isVerifactuSync", "issueDate", "previousHash", "series", "status", "subtotal", "taxAmount", "total", "updatedAt") SELECT "budgetNumber", "clientId", "companyId", "createdAt", "hash", "id", "isVerifactuSync", "issueDate", "previousHash", "series", "status", "subtotal", "taxAmount", "total", "updatedAt" FROM "Budget";
DROP TABLE "Budget";
ALTER TABLE "new_Budget" RENAME TO "Budget";
CREATE UNIQUE INDEX "Budget_hash_key" ON "Budget"("hash");
CREATE UNIQUE INDEX "Budget_series_budgetNumber_key" ON "Budget"("series", "budgetNumber");
CREATE TABLE "new_BudgetLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "budgetId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "unitPriceInCents" INTEGER NOT NULL,
    "taxRate" REAL NOT NULL,
    "lineTotalInCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BudgetLine_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BudgetLine" ("budgetId", "concept", "createdAt", "id", "quantity", "taxRate", "updatedAt") SELECT "budgetId", "concept", "createdAt", "id", "quantity", "taxRate", "updatedAt" FROM "BudgetLine";
DROP TABLE "BudgetLine";
ALTER TABLE "new_BudgetLine" RENAME TO "BudgetLine";
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("address", "createdAt", "email", "id", "name", "nif", "phone", "updatedAt") SELECT "address", "createdAt", "email", "id", "name", "nif", "phone", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_nif_companyId_key" ON "Client"("nif", "companyId");
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "sector" TEXT NOT NULL DEFAULT 'OTHER',
    "defaultVAT" REAL NOT NULL DEFAULT 21.0,
    "defaultIRPF" REAL NOT NULL DEFAULT 0.0,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("address", "createdAt", "email", "id", "name", "nif", "phone", "updatedAt", "userId") SELECT "address", "createdAt", "email", "id", "name", "nif", "phone", "updatedAt", "userId" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_nif_key" ON "Company"("nif");
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
