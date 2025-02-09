/*
  Warnings:

  - You are about to drop the column `reason` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "reason",
ADD COLUMN     "city" TEXT;
