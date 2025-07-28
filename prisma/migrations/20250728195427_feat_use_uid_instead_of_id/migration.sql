/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_id` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_id` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `PaymentMethod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `payment_method_id` on the `PaymentMethod` table. All the data in the column will be lost.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `purchase_id` on the `Purchase` table. All the data in the column will be lost.
  - The primary key for the `Raffle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `raffle_id` on the `Raffle` table. All the data in the column will be lost.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ticket_id` on the `Ticket` table. All the data in the column will be lost.
  - The required column `uid` was added to the `Admin` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uid` was added to the `Customer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uid` was added to the `PaymentMethod` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uid` was added to the `Purchase` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uid` was added to the `Raffle` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uid` was added to the `Ticket` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_raffleId_fkey";

-- DropForeignKey
ALTER TABLE "Raffle" DROP CONSTRAINT "Raffle_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_purchaseId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_raffleId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "admin_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "customer_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "PaymentMethod" DROP CONSTRAINT "PaymentMethod_pkey",
DROP COLUMN "payment_method_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_pkey",
DROP COLUMN "purchase_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ALTER COLUMN "raffleId" SET DATA TYPE TEXT,
ALTER COLUMN "customerId" SET DATA TYPE TEXT,
ALTER COLUMN "paymentMethodId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Raffle" DROP CONSTRAINT "Raffle_pkey",
DROP COLUMN "raffle_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ALTER COLUMN "adminId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Raffle_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_pkey",
DROP COLUMN "ticket_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ALTER COLUMN "raffleId" SET DATA TYPE TEXT,
ALTER COLUMN "purchaseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("uid");

-- AddForeignKey
ALTER TABLE "Raffle" ADD CONSTRAINT "Raffle_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
