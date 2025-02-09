/*
  Warnings:

  - You are about to drop the column `hospitalAddress` on the `requests` table. All the data in the column will be lost.
  - Added the required column `name` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "hospitalAddress",
ADD COLUMN     "name" TEXT NOT NULL;
