/*
  Warnings:

  - The `bids` column on the `Depth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `asks` column on the `Depth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[eventSlug]` on the table `Depth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentPrice` to the `Depth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Depth" ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL,
DROP COLUMN "bids",
ADD COLUMN     "bids" TEXT[],
DROP COLUMN "asks",
ADD COLUMN     "asks" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Depth_eventSlug_key" ON "Depth"("eventSlug");
