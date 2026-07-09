/*
  Warnings:

  - You are about to drop the column `productId` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Size` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_productId_fkey";

-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_productId_fkey";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Size" DROP COLUMN "productId";
