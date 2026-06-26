-- AlterTable
ALTER TABLE "ContactPerson" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "pinCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "usciNo" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "usciNo" TEXT;
