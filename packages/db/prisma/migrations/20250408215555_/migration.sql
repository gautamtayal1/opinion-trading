/*
  Warnings:

  - You are about to drop the column `executedQty` on the `Trade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "executedQty" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "executedQty";
