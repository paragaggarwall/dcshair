-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_contractId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "contractId" DROP NOT NULL,
ALTER COLUMN "sizeScale" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;
