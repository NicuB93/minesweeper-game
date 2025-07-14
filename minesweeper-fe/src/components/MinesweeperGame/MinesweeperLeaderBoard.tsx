import { useLeaderBoard } from "../../hooks/api/useLeaderBoard";

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0
    ? `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    : `${remainingSeconds}s`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface MinesweeperLeaderBoardProps {
  limit?: number;
}

export function MinesweeperLeaderBoard({
  limit = 10,
}: MinesweeperLeaderBoardProps) {
  const {
    data: leaderboard,
    isLoading,
    error,
  } = useLeaderBoard({
    variables: { limit },
  });

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            🏆 Leaderboard
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            🏆 Leaderboard
          </h2>
          <div className="text-center text-muted-foreground">
            <p>Failed to load leaderboard</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            🏆 Leaderboard
          </h2>
          <div className="text-center text-muted-foreground">
            <p>No games played yet</p>
            <p className="text-sm mt-1">Be the first to complete a game!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">🏆 Leaderboard</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                  Rank
                </th>
                <th className="text-left py-3 px-2 font-semibold text-muted-foreground">
                  Player
                </th>
                <th className="text-right py-3 px-2 font-semibold text-muted-foreground">
                  Time
                </th>
                <th className="text-right py-3 px-2 font-semibold text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => {
                const isTopThree = index < 3;
                const rankEmoji =
                  index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : "";

                return (
                  <tr
                    key={entry.id}
                    className={`border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                      isTopThree ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground min-w-[20px]">
                          #{index + 1}
                        </span>
                        {rankEmoji && (
                          <span className="text-lg">{rankEmoji}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`font-bold tracking-wider ${
                          isTopThree ? "text-primary" : ""
                        }`}
                      >
                        {entry.playerInitials}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`font-mono text-sm ${
                          isTopThree
                            ? "font-bold text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(entry.completionTime)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.gameDate)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {leaderboard.length >= limit && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing top {limit} results
          </div>
        )}
      </div>
    </div>
  );
}
