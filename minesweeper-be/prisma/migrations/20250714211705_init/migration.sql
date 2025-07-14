-- CreateTable
CREATE TABLE "game_results" (
    "id" TEXT NOT NULL,
    "playerInitials" VARCHAR(3) NOT NULL,
    "completionTime" INTEGER NOT NULL,
    "gameDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_results_pkey" PRIMARY KEY ("id")
);
