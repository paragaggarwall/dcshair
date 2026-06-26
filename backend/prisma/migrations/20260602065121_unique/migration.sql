/*
  Warnings:

  - A unique constraint covering the columns `[proformaInvoiceNo]` on the table `ProformaInvoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProformaInvoice_proformaInvoiceNo_key" ON "ProformaInvoice"("proformaInvoiceNo");
