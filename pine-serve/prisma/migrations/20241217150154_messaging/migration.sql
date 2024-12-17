-- CreateTable
CREATE TABLE "messaging" (
    "id" SERIAL NOT NULL,
    "thread_id" TEXT NOT NULL,
    "channel" TEXT[],
    "booking_id" TEXT NOT NULL,
    "notified_count" TEXT NOT NULL,
    "send_count" TEXT NOT NULL,
    "total_messages" TEXT NOT NULL,
    "average_time" DOUBLE PRECISION NOT NULL,
    "max_time" DOUBLE PRECISION NOT NULL,
    "min_time" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "sync_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messaging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "messaging_thread_id_key" ON "messaging"("thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "messaging_booking_id_key" ON "messaging"("booking_id");
