-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "dueDate" TEXT,
ADD COLUMN     "invoiceDate" TEXT,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "subtotal" DOUBLE PRECISION,
ADD COLUMN     "taxAmount" DOUBLE PRECISION,
ADD COLUMN     "totalAmount" DOUBLE PRECISION,
ADD COLUMN     "vendorName" TEXT;
