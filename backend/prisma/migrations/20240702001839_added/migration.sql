/*
  Warnings:

  - Added the required column `sex` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "sex" TEXT NOT NULL;
