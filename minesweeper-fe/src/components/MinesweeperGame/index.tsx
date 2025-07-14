import { Button } from "@/components/ui/button";
import { MinesweeperBoard } from "./MinesweeperBoard";
import { MinesweeperGameOver } from "./MinesweeperGameOver";
import { MinesweeperInfo } from "./MinesweeperInfo";
import { MinesweeperLeaderBoard } from "./MinesweeperLeaderBoard";
import { MinesweeperWrapper } from "./MinesweeperWrapper";
import { NameInputDialog } from "./NameInputDialog";
import { useMinesweeperGameWithBackend } from "./utils/useBackendGame";

export const MinesweeperGame = () => {
  const {
    initializeGame,
    timer,
    flaggedCells,
    getStatusText,
    board,
    revealCell,
    toggleFlag,
    getCellClassName,
    getCellContent,
    gameState,
    config,
    isLoading,
    error,
    showNameDialog,
    playerName,
    setPlayerName,
    submitResult,
    skipSubmission,
    pendingWinTime,
    isSubmittingResult,
  } = useMinesweeperGameWithBackend();

  if (error) {
    return (
      <MinesweeperWrapper>
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="text-red-500">{error.message}</p>
          <Button onClick={initializeGame} variant="outline">
            Try Again
          </Button>
        </div>
      </MinesweeperWrapper>
    );
  }

  if (isLoading && board.length === 0) {
    return (
      <MinesweeperWrapper>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Loading game...</p>
        </div>
      </MinesweeperWrapper>
    );
  }

  return (
    <MinesweeperWrapper>
      <MinesweeperInfo
        timer={timer}
        flaggedCells={flaggedCells}
        getStatusText={getStatusText}
        config={config}
      />

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-2 justify-center">
          <Button
            onClick={initializeGame}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "New Game"}
          </Button>
        </div>

        {/* Only medium difficulty (16x16, 40 mines) available */}
      </div>

      {board.length > 0 ? (
        <MinesweeperBoard
          board={board}
          revealCell={revealCell}
          toggleFlag={toggleFlag}
          getCellClassName={getCellClassName}
          getCellContent={getCellContent}
          gameState={gameState}
          config={config}
        />
      ) : (
        !isLoading && (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No active game</p>
            <Button onClick={initializeGame} variant="default">
              Start New Game
            </Button>
          </div>
        )
      )}

      <MinesweeperGameOver
        gameState={gameState}
        timer={timer}
        onPlayAgain={initializeGame}
        pendingWinTime={pendingWinTime}
        showNameDialog={showNameDialog}
      />

      <NameInputDialog
        isOpen={showNameDialog}
        playerName={playerName}
        setPlayerName={setPlayerName}
        onSubmit={submitResult}
        onSkip={skipSubmission}
        winTime={pendingWinTime || 0}
        isSubmitting={isSubmittingResult}
      />

      <MinesweeperLeaderBoard />
    </MinesweeperWrapper>
  );
};
