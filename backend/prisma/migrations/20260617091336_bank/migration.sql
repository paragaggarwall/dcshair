/*
  Warnings:

  - You are about to drop the column `amount` on the `BankSale` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceId]` on the table `BankSale` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BankSale" DROP COLUMN "amount";

-- CreateIndex
CREATE UNIQUE INDEX "BankSale_invoiceId_key" ON "BankSale"("invoiceId");
