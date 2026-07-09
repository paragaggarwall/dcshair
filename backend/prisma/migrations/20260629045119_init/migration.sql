/*
  Warnings:

  - You are about to drop the column `note` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ContractItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `ContractItem` table. All the data in the column will be lost.
  - You are about to drop the column `ewayBillNo` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `lrNo` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `railOut` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `railOutDateTime` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `transporterName` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `InvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerKg` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `colour` on the `ProformaInvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ProformaInvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `ProformaInvoiceItem` table. All the data in the column will be lost.
  - You are about to drop the `PackingList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackingListItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Amount` to the `ContractItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ContractItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Amount` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Amount` to the `ProformaInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ProformaInvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PackingList" DROP CONSTRAINT "PackingList_consigneeId_fkey";

-- DropForeignKey
ALTER TABLE "PackingList" DROP CONSTRAINT "PackingList_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "PackingList" DROP CONSTRAINT "PackingList_notifyPartyId_fkey";

-- DropForeignKey
ALTER TABLE "PackingListItem" DROP CONSTRAINT "PackingListItem_packingListId_fkey";

-- DropForeignKey
ALTER TABLE "PackingListItem" DROP CONSTRAINT "PackingListItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_contractId_fkey";

-- DropIndex
DROP INDEX "Invoice_ewayBillNo_key";

-- DropIndex
DROP INDEX "Invoice_lrNo_key";

-- AlterTable
ALTER TABLE "BankSale" ADD COLUMN     "bankRefDateFormat" TEXT,
ADD COLUMN     "dateOfRealisationFormat" TEXT,
ADD COLUMN     "realisationdueDateFormat" TEXT;

-- AlterTable
ALTER TABLE "BillOfExchange" ADD COLUMN     "draftDateFormat" TEXT;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "note",
ADD COLUMN     "cartonweight" DOUBLE PRECISION,
ADD COLUMN     "currency" "Currency" DEFAULT 'USD',
ADD COLUMN     "expectedDeliveryDateFormat" TEXT,
ADD COLUMN     "expectedDepartureDateFormat" TEXT,
ADD COLUMN     "flightNo" TEXT,
ADD COLUMN     "invoicepaymentterm" "invoicepayment",
ADD COLUMN     "otherRefrence" TEXT,
ADD COLUMN     "shipingMark" TEXT,
ADD COLUMN     "sizeScale" TEXT,
ALTER COLUMN "createdBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ContractItem" DROP COLUMN "quantity",
DROP COLUMN "totalAmount",
ADD COLUMN     "Amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "CustomSale" ADD COLUMN     "drawBackDateReceivedFormat" TEXT,
ADD COLUMN     "focusDateReceivedFormat" TEXT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "ewayBillNo",
DROP COLUMN "lrNo",
DROP COLUMN "railOut",
DROP COLUMN "railOutDateTime",
DROP COLUMN "transporterName",
ADD COLUMN     "awbNoDate" TIMESTAMP(3),
ADD COLUMN     "awbNoDateFormat" TEXT,
ADD COLUMN     "cartonweight" DOUBLE PRECISION,
ADD COLUMN     "cha" TEXT,
ADD COLUMN     "containerStuffingDateFormat" TEXT,
ADD COLUMN     "courierCompany" TEXT,
ADD COLUMN     "deliveredDateFormat" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dispatchDateFormat" TEXT,
ADD COLUMN     "ebrcDate" TIMESTAMP(3),
ADD COLUMN     "ebrcDateFormat" TEXT,
ADD COLUMN     "ebrcNarration" TEXT,
ADD COLUMN     "ebrcReceive" BOOLEAN,
ADD COLUMN     "epCopy" BOOLEAN,
ADD COLUMN     "epDate" TIMESTAMP(3),
ADD COLUMN     "epDateFormat" TEXT,
ADD COLUMN     "epNarration" TEXT,
ADD COLUMN     "exporterCopy" BOOLEAN,
ADD COLUMN     "exporterDate" TIMESTAMP(3),
ADD COLUMN     "exporterDateFormat" TEXT,
ADD COLUMN     "exporterNarration" TEXT,
ADD COLUMN     "grDate" TIMESTAMP(3),
ADD COLUMN     "grDateFormat" TEXT,
ADD COLUMN     "grNarration" TEXT,
ADD COLUMN     "grRelease" BOOLEAN,
ADD COLUMN     "invoiceDateFormat" TEXT,
ADD COLUMN     "lcDate" TIMESTAMP(3),
ADD COLUMN     "lcDateFormat" TEXT,
ADD COLUMN     "lcNumber" TEXT,
ADD COLUMN     "lorryInCustomWarehouseDateTimeFormat" TEXT,
ADD COLUMN     "lorryOutFromCustomWarehouseDateTimeFormat" TEXT,
ADD COLUMN     "netWeight" DOUBLE PRECISION,
ADD COLUMN     "passedShipmentFromCustomDateFormat" TEXT,
ADD COLUMN     "shipingMark" TEXT,
ADD COLUMN     "shippingDateFormat" TEXT,
ADD COLUMN     "stockOutDateTimeFormat" TEXT,
ADD COLUMN     "trainOut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trainOutDateTime" TIMESTAMP(3),
ADD COLUMN     "trainOutDateTimeFormat" TEXT,
ALTER COLUMN "packing" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "totalAmount",
ADD COLUMN     "Amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" TEXT,
ALTER COLUMN "colour" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "color",
DROP COLUMN "contractId",
DROP COLUMN "pricePerKg",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "ProformaInvoice" ADD COLUMN     "cartonweight" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "flightNo" TEXT,
ADD COLUMN     "lcDateFormat" TEXT,
ADD COLUMN     "packing" TEXT,
ADD COLUMN     "proformaInvoiceDateFormat" TEXT,
ADD COLUMN     "shipingMark" TEXT,
ADD COLUMN     "sizeScale" TEXT;

-- AlterTable
ALTER TABLE "ProformaInvoiceItem" DROP COLUMN "colour",
DROP COLUMN "quantity",
DROP COLUMN "totalAmount",
ADD COLUMN     "Amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "PackingList";

-- DropTable
DROP TABLE "PackingListItem";

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_color_key" ON "Color"("color");

-- CreateIndex
CREATE UNIQUE INDEX "Size_size_key" ON "Size"("size");

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
