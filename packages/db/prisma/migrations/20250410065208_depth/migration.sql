/*
  Warnings:

  - You are about to alter the column `currentPrice` on the `Depth` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Depth" ALTER COLUMN "currentPrice" SET DATA TYPE INTEGER;
