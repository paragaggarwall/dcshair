/*
  Warnings:

  - You are about to drop the column `amount` on the `CustomSale` table. All the data in the column will be lost.
  - You are about to drop the column `shippingBillDate` on the `CustomSale` table. All the data in the column will be lost.
  - You are about to drop the column `shippingBillNo` on the `CustomSale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomSale" DROP COLUMN "amount",
DROP COLUMN "shippingBillDate",
DROP COLUMN "shippingBillNo";
