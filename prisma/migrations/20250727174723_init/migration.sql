-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('USD', 'VES');

-- CreateEnum
CREATE TYPE "RaffleStatus" AS ENUM ('draft', 'active', 'closed');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" SERIAL NOT NULL,
    "national_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Raffle" (
    "raffle_id" SERIAL NOT NULL,
    "adminId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "digits_length" INTEGER NOT NULL,
    "ticket_price" DECIMAL(65,30) NOT NULL,
    "total_tickets" INTEGER NOT NULL,
    "image_url" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "RaffleStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Raffle_pkey" PRIMARY KEY ("raffle_id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "payment_method_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "payment_data" JSONB NOT NULL,
    "minimum_payment_amount" DECIMAL(65,30) NOT NULL,
    "currency" "CurrencyType" NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("payment_method_id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "purchase_id" SERIAL NOT NULL,
    "raffleId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,
    "ticket_quantity" INTEGER NOT NULL,
    "payment_screenshot_url" TEXT NOT NULL,
    "bank_reference" TEXT NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'pending',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" SERIAL NOT NULL,
    "raffleId" INTEGER NOT NULL,
    "purchaseId" INTEGER,
    "ticket_number" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_national_id_key" ON "Customer"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_raffleId_ticket_number_key" ON "Ticket"("raffleId", "ticket_number");

-- AddForeignKey
ALTER TABLE "Raffle" ADD CONSTRAINT "Raffle_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("raffle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("payment_method_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle"("raffle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("purchase_id") ON DELETE SET NULL ON UPDATE CASCADE;
