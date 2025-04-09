/*
  Warnings:

  - You are about to drop the column `eventId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `max_bet` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `min_bet` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Event_eventId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventId",
DROP COLUMN "expiresAt",
DROP COLUMN "max_bet",
DROP COLUMN "min_bet",
DROP COLUMN "quantity";
