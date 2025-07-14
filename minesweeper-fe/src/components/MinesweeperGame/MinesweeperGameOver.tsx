import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type MinesweeperGameOverProps = {
  gameState: "ready" | "playing" | "won" | "lost";
  timer: number;
  onPlayAgain?: () => void;
  pendingWinTime?: number;
  showNameDialog: boolean;
};

export const MinesweeperGameOver = ({
  gameState,
  timer,
  onPlayAgain,
  pendingWinTime,
  showNameDialog,
}: MinesweeperGameOverProps) => {
  // Show game over dialog for:
  // 1. Lost games
  // 2. Won games where time didn't qualify for leaderboard (and not showing name dialog)
  const isGameOver =
    gameState === "lost" ||
    (gameState === "won" && pendingWinTime !== undefined && !showNameDialog);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
      : `${remainingSeconds}s`;
  };

  return (
    <Dialog open={isGameOver}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {gameState === "won" ? "🎉 Congratulations!" : "💥 Game Over!"}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {gameState === "won"
              ? `You won in ${formatTime(pendingWinTime || timer)}!${
                  pendingWinTime
                    ? "\nYour time didn't make it to the top 10."
                    : ""
                }`
              : "Better luck next time!"}
          </DialogDescription>
        </DialogHeader>

        {onPlayAgain && (
          <div className="flex justify-center mt-4">
            <button
              onClick={onPlayAgain}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Play Again
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
