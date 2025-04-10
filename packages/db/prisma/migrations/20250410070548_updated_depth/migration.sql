/*
  Warnings:

  - Changed the type of `bids` on the `Depth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `asks` on the `Depth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Depth" DROP COLUMN "bids",
ADD COLUMN     "bids" JSONB NOT NULL,
DROP COLUMN "asks",
ADD COLUMN     "asks" JSONB NOT NULL;
