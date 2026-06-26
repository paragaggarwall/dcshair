-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_proformaInvoiceId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "customerId" INTEGER,
ALTER COLUMN "proformaInvoiceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_proformaInvoiceId_fkey" FOREIGN KEY ("proformaInvoiceId") REFERENCES "ProformaInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
