-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "physicianId" INTEGER,
ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "Physician"("id") ON DELETE CASCADE ON UPDATE CASCADE;
