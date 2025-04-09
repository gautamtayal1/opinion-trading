/*
  Warnings:

  - Added the required column `otherUserId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "otherUserId" TEXT NOT NULL;
