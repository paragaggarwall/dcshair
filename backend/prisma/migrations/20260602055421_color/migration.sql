/*
  Warnings:

  - You are about to drop the column `buyerId` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `buyerId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `buyerId` on the `PackingList` table. All the data in the column will be lost.
  - You are about to drop the column `buyerId` on the `ProformaInvoice` table. All the data in the column will be lost.
  - You are about to drop the `Buyer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Buyer" DROP CONSTRAINT "Buyer_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "PackingList" DROP CONSTRAINT "PackingList_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "ProformaInvoice" DROP CONSTRAINT "ProformaInvoice_buyerId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "buyerId";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "buyerId";

-- AlterTable
ALTER TABLE "PackingList" DROP COLUMN "buyerId";

-- AlterTable
ALTER TABLE "ProformaInvoice" DROP COLUMN "buyerId";

-- AlterTable
ALTER TABLE "ProformaInvoiceItem" ALTER COLUMN "colour" DROP NOT NULL;

-- DropTable
DROP TABLE "Buyer";
