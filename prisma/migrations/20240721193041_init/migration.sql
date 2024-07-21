-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "spotifyTrackId" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "spotifyPreviewUrl" TEXT,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "occurrences" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_spotifyTrackId_key" ON "Track"("spotifyTrackId");

-- CreateIndex
CREATE INDEX "Track_updatedAt_id_idx" ON "Track"("updatedAt" DESC, "id");
