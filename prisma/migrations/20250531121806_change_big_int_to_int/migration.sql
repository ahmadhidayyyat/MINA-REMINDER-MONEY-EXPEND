/*
  Warnings:

  - You are about to alter the column `jumlah` on the `Expenses` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Expenses" ALTER COLUMN "jumlah" SET DATA TYPE INTEGER;
