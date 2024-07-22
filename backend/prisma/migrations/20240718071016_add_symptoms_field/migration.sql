/*
  Warnings:

  - You are about to drop the column `complaint` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "complaint",
ADD COLUMN     "symptoms" JSONB;
