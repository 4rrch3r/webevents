/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `fb_events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `tt_events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `tt_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalId` to the `fb_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `tt_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `tt_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fb_events" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tt_events" ADD COLUMN     "externalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tt_users" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "fb_events_externalId_key" ON "fb_events"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "tt_events_externalId_key" ON "tt_events"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "tt_users_externalId_key" ON "tt_users"("externalId");
