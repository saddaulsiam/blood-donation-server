-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'OTHERS';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender";
