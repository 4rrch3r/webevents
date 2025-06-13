/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `fb_events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `fb_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `tt_events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `tt_users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "fb_events_externalId_key" ON "fb_events"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "fb_users_externalId_key" ON "fb_users"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "tt_events_externalId_key" ON "tt_events"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "tt_users_externalId_key" ON "tt_users"("externalId");
