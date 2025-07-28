/*
  Warnings:

  - You are about to drop the column `adminId` on the `Raffle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Raffle" DROP CONSTRAINT "Raffle_adminId_fkey";

-- AlterTable
ALTER TABLE "Raffle" DROP COLUMN "adminId";
