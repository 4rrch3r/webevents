-- CreateTable
CREATE TABLE "fb_users" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "fb_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_engagement_top" (
    "id" TEXT NOT NULL,
    "action_time" TIMESTAMP(3) NOT NULL,
    "referrer" TEXT NOT NULL,
    "video_id" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "fb_engagement_top_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_engagement_bottom" (
    "id" TEXT NOT NULL,
    "ad_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "click_position" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "purchase_amount" DOUBLE PRECISION,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "fb_engagement_bottom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fb_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnel_stage" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "engagement_top_id" TEXT,
    "engagement_bottom_id" TEXT,

    CONSTRAINT "fb_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "tt_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_engagement_top" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "watch_time" INTEGER NOT NULL,
    "percentage_watched" INTEGER NOT NULL,
    "device" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tt_engagement_top_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_engagement_bottom" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT,
    "purchased_item" TEXT,
    "purchase_amount" DOUBLE PRECISION,
    "action_time" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tt_engagement_bottom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tt_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnel_stage" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "engagement_top_id" TEXT,
    "engagement_bottom_id" TEXT,

    CONSTRAINT "tt_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fb_users_externalId_key" ON "fb_users"("externalId");

-- AddForeignKey
ALTER TABLE "fb_engagement_top" ADD CONSTRAINT "fb_engagement_top_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "fb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fb_engagement_bottom" ADD CONSTRAINT "fb_engagement_bottom_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "fb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fb_events" ADD CONSTRAINT "fb_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "fb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fb_events" ADD CONSTRAINT "fb_events_engagement_top_id_fkey" FOREIGN KEY ("engagement_top_id") REFERENCES "fb_engagement_top"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fb_events" ADD CONSTRAINT "fb_events_engagement_bottom_id_fkey" FOREIGN KEY ("engagement_bottom_id") REFERENCES "fb_engagement_bottom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tt_engagement_top" ADD CONSTRAINT "tt_engagement_top_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tt_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tt_engagement_bottom" ADD CONSTRAINT "tt_engagement_bottom_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tt_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tt_events" ADD CONSTRAINT "tt_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tt_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tt_events" ADD CONSTRAINT "tt_events_engagement_top_id_fkey" FOREIGN KEY ("engagement_top_id") REFERENCES "tt_engagement_top"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tt_events" ADD CONSTRAINT "tt_events_engagement_bottom_id_fkey" FOREIGN KEY ("engagement_bottom_id") REFERENCES "tt_engagement_bottom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
