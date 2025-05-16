-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "permanentNumber" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Constructor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Constructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver_Championship" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,
    "wins" INTEGER NOT NULL,
    "driverId" TEXT NOT NULL,
    "constructorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_Championship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL,
    "season" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,
    "raceName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT,
    "circuitId" TEXT NOT NULL,
    "circuitName" TEXT NOT NULL,
    "circuitUrl" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "constructorId" TEXT NOT NULL,
    "grid" INTEGER NOT NULL,
    "laps" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "timeMillis" TEXT,
    "fastestLapRank" INTEGER,
    "fastestLap" INTEGER,
    "fastestLapTime" TEXT,
    "fastestLapSpeed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_Championship_season_driverId_key" ON "Driver_Championship"("season", "driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Race_season_round_key" ON "Race"("season", "round");

-- AddForeignKey
ALTER TABLE "Driver_Championship" ADD CONSTRAINT "Driver_Championship_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver_Championship" ADD CONSTRAINT "Driver_Championship_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Race" ADD CONSTRAINT "Race_constructorId_fkey" FOREIGN KEY ("constructorId") REFERENCES "Constructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
