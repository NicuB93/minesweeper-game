-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "playerInitials" VARCHAR(3),
    "board" JSONB NOT NULL,
    "gameState" TEXT NOT NULL,
    "timer" INTEGER NOT NULL DEFAULT 0,
    "flaggedCells" INTEGER NOT NULL DEFAULT 0,
    "firstClick" BOOLEAN NOT NULL DEFAULT true,
    "difficulty" TEXT NOT NULL,
    "rows" INTEGER NOT NULL,
    "cols" INTEGER NOT NULL,
    "mines" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);
