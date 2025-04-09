/*
  Warnings:

  - You are about to drop the column `otp` on the `OTP` table. All the data in the column will be lost.
  - You are about to drop the column `otpId` on the `OTP` table. All the data in the column will be lost.
  - Added the required column `code` to the `OTP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `OTP` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OTP_otpId_key";

-- DropIndex
DROP INDEX "OTP_otp_key";

-- AlterTable
ALTER TABLE "OTP" DROP COLUMN "otp",
DROP COLUMN "otpId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
