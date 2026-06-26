/*
  Warnings:

  - You are about to drop the column `speacialCondition` on the `Contract` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "invoicepayment" AS ENUM ('CFR', 'CIF', 'CPT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR', 'EUR');

-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "usciNo" TEXT;

-- AlterTable
ALTER TABLE "Consignee" ADD COLUMN     "usciNo" TEXT;

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "speacialCondition",
ADD COLUMN     "specialCondition" TEXT;

-- AlterTable
ALTER TABLE "NotifyParty" ADD COLUMN     "usciNo" TEXT;

-- CreateTable
CREATE TABLE "ProformaInvoice" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,
    "proformaInvoiceNo" TEXT NOT NULL,
    "proformaInvoiceDate" TIMESTAMP(3) NOT NULL,
    "invoicepaymentterm" "invoicepayment",
    "currency" "Currency" DEFAULT 'USD',
    "operatingAirlines" TEXT,
    "lcNumber" TEXT,
    "lcDate" TIMESTAMP(3),
    "otherRefrence" TEXT,
    "countryOfOrigin" TEXT NOT NULL,
    "countryOfDestination" TEXT NOT NULL,
    "preCarriageBy" "Carrier",
    "portOfLoading" TEXT,
    "portOfFinalDestination" TEXT,
    "consigneeId" INTEGER,
    "buyerId" INTEGER,
    "notifyPartyId" INTEGER,
    "contactPersonId" INTEGER,
    "termsOfPaymentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "ProformaInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProformaInvoiceItem" (
    "id" SERIAL NOT NULL,
    "proformaInvoiceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "colour" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProformaInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "contractId" INTEGER NOT NULL,
    "proformaInvoiceId" INTEGER NOT NULL,
    "consigneeId" INTEGER,
    "buyerId" INTEGER,
    "notifyPartyId" INTEGER,
    "contactPersonId" INTEGER,
    "termsOfPaymentId" INTEGER NOT NULL,
    "preCarriageBy" "Carrier",
    "invoicepaymentterm" "invoicepayment",
    "operatingAirlines" TEXT,
    "countryOfOrigin" TEXT NOT NULL,
    "countryOfDestination" TEXT NOT NULL,
    "sizeScale" TEXT NOT NULL,
    "packing" TEXT NOT NULL,
    "portOfLoading" TEXT,
    "portOfFinalDestination" TEXT,
    "otherRefrence" TEXT,
    "cartonWeight" INTEGER,
    "currency" "Currency" DEFAULT 'USD',
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingBillNo" TEXT,
    "shippingDate" TIMESTAMP(3),
    "awbNo" TEXT,
    "grossWeight" DOUBLE PRECISION,
    "narration" TEXT,
    "stockOutFromPKSGodown" BOOLEAN NOT NULL DEFAULT false,
    "stockOutDateTime" TIMESTAMP(3),
    "factoryCode" TEXT,
    "lorryNo" TEXT,
    "shipmentTakenBy" TEXT,
    "shipmentHandedOverTo" TEXT,
    "lorryInCustomWarehouse" BOOLEAN NOT NULL DEFAULT false,
    "lorryInCustomWarehouseDateTime" TIMESTAMP(3),
    "lorryOutFromCustomWarehouse" BOOLEAN NOT NULL DEFAULT false,
    "lorryOutFromCustomWarehouseDateTime" TIMESTAMP(3),
    "passedShipmentFromCustom" BOOLEAN NOT NULL DEFAULT false,
    "passedShipmentFromCustomDate" TIMESTAMP(3),
    "containerNo" TEXT,
    "containerStuffing" BOOLEAN NOT NULL DEFAULT false,
    "containerStuffingDate" TIMESTAMP(3),
    "containerSealNo" TEXT,
    "flightNo" TEXT,
    "trainNo" TEXT,
    "railOut" BOOLEAN NOT NULL DEFAULT false,
    "railOutDateTime" TIMESTAMP(3),
    "dispatchDate" TIMESTAMP(3),
    "transporterName" TEXT,
    "vehicleNo" TEXT,
    "driverName" TEXT,
    "driverPhone" TEXT,
    "ewayBillNo" TEXT,
    "lrNo" TEXT,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredDate" TIMESTAMP(3),
    "deliveryNarration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "colour" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomSale" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "customExchangeRate" DOUBLE PRECISION NOT NULL,
    "shippingBillNo" TEXT NOT NULL,
    "shippingBillDate" TIMESTAMP(3),
    "cifCfrValue" DOUBLE PRECISION,
    "lessFreight" DOUBLE PRECISION,
    "lessInsurance" DOUBLE PRECISION,
    "lessCommission" DOUBLE PRECISION,
    "customFobValue" DOUBLE PRECISION,
    "drawBackPercentage" DOUBLE PRECISION,
    "drawBackValue" DOUBLE PRECISION,
    "drawBackDateReceived" TIMESTAMP(3),
    "drawBackNarration" TEXT,
    "focusPercentage" DOUBLE PRECISION,
    "focusValue" DOUBLE PRECISION,
    "focusDateReceived" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "CustomSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankSale" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bankExchangeRate" DOUBLE PRECISION,
    "bankRefNo" TEXT,
    "bankRefDate" TIMESTAMP(3),
    "negotiationAmount" DOUBLE PRECISION,
    "lessFreight" DOUBLE PRECISION,
    "lessInsurance" DOUBLE PRECISION,
    "lessCommissionIfAny" DOUBLE PRECISION,
    "bankFobValue" DOUBLE PRECISION,
    "dateOfRealisation" TIMESTAMP(3),
    "realisationNarration" TEXT,
    "realisationdueDate" TIMESTAMP(3),
    "courierCompany" TEXT,
    "trackingNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "BankSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackingList" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "consigneeId" INTEGER,
    "buyerId" INTEGER,
    "notifyPartyId" INTEGER,
    "packingListNo" TEXT NOT NULL,
    "packingListDate" TIMESTAMP(3) NOT NULL,
    "exporterRef" TEXT,
    "lcNo" TEXT,
    "lcDate" TIMESTAMP(3),
    "otherRefrence" TEXT,
    "iecNo" TEXT,
    "packing" TEXT,
    "packingMeasurement" TEXT,
    "preCarriageBy" "Carrier",
    "portOfLoading" TEXT,
    "portOfFinalDestination" TEXT,
    "countryOfOrigin" TEXT NOT NULL,
    "countryOfDestination" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "PackingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackingListItem" (
    "id" SERIAL NOT NULL,
    "packingListId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "grossWeight" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "PackingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillOfExchange" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "draftNo" TEXT NOT NULL,
    "draftDate" TIMESTAMP(3) NOT NULL,
    "exchangeAmount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" DEFAULT 'USD',
    "paymentTenor" TEXT,
    "payToBank" TEXT,
    "payToBankAddress" TEXT,
    "payToBankSwiftCode" TEXT,
    "draweeName" TEXT,
    "draweeAddress" TEXT,
    "draweeUsciNo" TEXT,
    "acWithBank" TEXT,
    "acWithBankAddress" TEXT,
    "acWithBankSwiftCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "BillOfExchange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_shippingBillNo_key" ON "Invoice"("shippingBillNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_awbNo_key" ON "Invoice"("awbNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_ewayBillNo_key" ON "Invoice"("ewayBillNo");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_lrNo_key" ON "Invoice"("lrNo");

-- CreateIndex
CREATE UNIQUE INDEX "CustomSale_invoiceId_key" ON "CustomSale"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomSale_shippingBillNo_key" ON "CustomSale"("shippingBillNo");

-- CreateIndex
CREATE UNIQUE INDEX "BankSale_bankRefNo_key" ON "BankSale"("bankRefNo");

-- CreateIndex
CREATE UNIQUE INDEX "PackingList_invoiceId_key" ON "PackingList"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "BillOfExchange_invoiceId_key" ON "BillOfExchange"("invoiceId");

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_notifyPartyId_fkey" FOREIGN KEY ("notifyPartyId") REFERENCES "NotifyParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "ContactPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_termsOfPaymentId_fkey" FOREIGN KEY ("termsOfPaymentId") REFERENCES "TermsOfPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceItem" ADD CONSTRAINT "ProformaInvoiceItem_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProformaInvoiceItem" ADD CONSTRAINT "ProformaInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_notifyPartyId_fkey" FOREIGN KEY ("notifyPartyId") REFERENCES "NotifyParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "ContactPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_termsOfPaymentId_fkey" FOREIGN KEY ("termsOfPaymentId") REFERENCES "TermsOfPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomSale" ADD CONSTRAINT "CustomSale_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankSale" ADD CONSTRAINT "BankSale_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Consignee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingList" ADD CONSTRAINT "PackingList_notifyPartyId_fkey" FOREIGN KEY ("notifyPartyId") REFERENCES "NotifyParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "PackingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackingListItem" ADD CONSTRAINT "PackingListItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillOfExchange" ADD CONSTRAINT "BillOfExchange_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
