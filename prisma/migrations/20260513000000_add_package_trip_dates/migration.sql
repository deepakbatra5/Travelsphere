-- CreateTable
CREATE TABLE "PackageTripDate" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageTripDate_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "tripDateId" TEXT;

-- CreateIndex
CREATE INDEX "PackageTripDate_startDate_idx" ON "PackageTripDate"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "PackageTripDate_packageId_startDate_key" ON "PackageTripDate"("packageId", "startDate");

-- AddForeignKey
ALTER TABLE "PackageTripDate" ADD CONSTRAINT "PackageTripDate_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tripDateId_fkey" FOREIGN KEY ("tripDateId") REFERENCES "PackageTripDate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
