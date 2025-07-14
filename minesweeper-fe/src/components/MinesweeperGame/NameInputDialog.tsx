import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NameInputDialogProps = {
  isOpen: boolean;
  playerName: string;
  setPlayerName: (name: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  winTime: number;
  isSubmitting: boolean;
};

export const NameInputDialog = ({
  isOpen,
  playerName,
  setPlayerName,
  onSubmit,
  onSkip,
  winTime,
  isSubmitting,
}: NameInputDialogProps) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0
      ? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
      : `${remainingSeconds}s`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length > 0) {
      onSubmit();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🎉 Congratulations!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            You won in {formatTime(winTime)}!<br />
            Your time qualifies for the leaderboard!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter your name (3 characters max):
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) =>
                setPlayerName(e.target.value.slice(0, 3).toUpperCase())
              }
              className="w-full px-3 py-2 border rounded-md text-center text-lg font-mono"
              placeholder="ABC"
              maxLength={3}
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              type="submit"
              disabled={playerName.trim().length === 0 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit to Leaderboard"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              disabled={isSubmitting}
            >
              Skip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
