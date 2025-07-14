import { useCallback, useEffect, useState } from "react";
import {
  useGameSessionManager,
  useLeaderBoard,
  useSubmitGameResult,
  type StartGameRequest,
} from "../../../hooks/api";
import { getCellClassName, getCellContent, getStatusText } from "./gameStyles";

type Difficulty = "medium";

interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  medium: { rows: 16, cols: 16, mines: 40 },
};

const SESSION_STORAGE_KEY = "minesweeper-session-id";

// Helper functions for session storage
const saveSessionId = (sessionId: string) => {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  } catch (error) {
    console.warn("Failed to save session ID to session storage:", error);
  }
};

const loadSessionId = (): string | null => {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to load session ID from session storage:", error);
    return null;
  }
};

const clearSessionId = () => {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear session ID from session storage:", error);
  }
};

export const useMinesweeperGameWithBackend = () => {
  const [sessionId, setSessionId] = useState<string>();
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [playerName, setPlayerName] = useState<string>("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [pendingWinTime, setPendingWinTime] = useState<number>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load session ID from session storage on mount
  useEffect(() => {
    const savedSessionId = loadSessionId();
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
    setIsInitialized(true);
  }, []);

  const {
    gameSession,
    isLoading,
    error,
    startGame,
    revealCell: apiRevealCell,
    toggleFlag: apiToggleFlag,
    deleteSession,
    isStartingGame,
    isRevealingCell,
    isTogglingFlag,
  } = useGameSessionManager(sessionId);

  const { data: leaderboard } = useLeaderBoard({ variables: { limit: 10 } });
  const submitGameResultMutation = useSubmitGameResult();

  // Clear session storage if the saved session no longer exists
  useEffect(() => {
    if (isInitialized && sessionId && error) {
      // If we get an error for a saved session, it likely doesn't exist anymore
      const errorMessage = error.message?.toLowerCase();
      if (
        errorMessage?.includes("not found") ||
        errorMessage?.includes("404")
      ) {
        clearSessionId();
        setSessionId(undefined);
      }
    }
  }, [isInitialized, sessionId, error]);

  // Check if current time would be in top 10
  const isTimeInTop10 = useCallback(
    (time: number): boolean => {
      if (!leaderboard || leaderboard.length < 10) return true;

      const worstTime = Math.max(
        ...leaderboard.map(
          (entry: { completionTime: number }) => entry.completionTime
        )
      );
      return time < worstTime;
    },
    [leaderboard]
  );

  // Handle game won scenario
  useEffect(() => {
    if (
      gameSession?.gameState === "won" &&
      !showNameDialog &&
      !pendingWinTime
    ) {
      const winTime = gameSession.timer;

      if (isTimeInTop10(winTime)) {
        setPendingWinTime(winTime);
        setShowNameDialog(true);
      } else {
        // Time not in top 10, just show celebration without name input
        setPendingWinTime(winTime);
        // Clear session storage since game is completed
        clearSessionId();
      }
    }
  }, [
    gameSession?.gameState,
    gameSession?.timer,
    isTimeInTop10,
    showNameDialog,
    pendingWinTime,
  ]);

  // Handle game lost scenario
  useEffect(() => {
    if (gameSession?.gameState === "lost") {
      // Clear session storage since game is completed
      clearSessionId();
    }
  }, [gameSession?.gameState]);

  const initializeGame = useCallback(async () => {
    try {
      // Clean up previous session
      if (sessionId) {
        await deleteSession();
      }

      // Reset state and clear session storage
      setSessionId(undefined);
      setShowNameDialog(false);
      setPendingWinTime(undefined);
      clearSessionId();

      // Start new game
      const gameData: StartGameRequest = {
        difficulty,
      };

      const newSession = await startGame(gameData);
      setSessionId(newSession.id);
      saveSessionId(newSession.id);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  }, [difficulty, sessionId, deleteSession, startGame]);

  const revealCell = useCallback(
    async (row: number, col: number) => {
      if (!sessionId || isRevealingCell || !gameSession) return;

      // Don't allow moves if game is over
      if (gameSession.gameState === "won" || gameSession.gameState === "lost") {
        return;
      }

      const cell = gameSession.board[row]?.[col];
      if (!cell || cell.isRevealed || cell.isFlagged) {
        return;
      }

      try {
        await apiRevealCell(row, col);
      } catch (error) {
        console.error("Failed to reveal cell:", error);
      }
    },
    [sessionId, isRevealingCell, gameSession, apiRevealCell]
  );

  const toggleFlag = useCallback(
    async (row: number, col: number) => {
      if (!sessionId || isTogglingFlag || !gameSession) return;

      // Don't allow moves if game is over
      if (gameSession.gameState === "won" || gameSession.gameState === "lost") {
        return;
      }

      const cell = gameSession.board[row]?.[col];
      if (!cell || cell.isRevealed) {
        return;
      }

      try {
        await apiToggleFlag(row, col);
      } catch (error) {
        console.error("Failed to toggle flag:", error);
      }
    },
    [sessionId, isTogglingFlag, gameSession, apiToggleFlag]
  );

  const submitResult = useCallback(async () => {
    if (!pendingWinTime || !playerName.trim()) return;

    try {
      await submitGameResultMutation.mutateAsync({
        playerInitials: playerName.trim().toUpperCase(),
        completionTime: pendingWinTime,
        gameDate: new Date().toISOString(),
      });

      setShowNameDialog(false);
      setPlayerName("");
      clearSessionId(); // Clear session since game is completed
    } catch (error) {
      console.error("Failed to submit result:", error);
    }
  }, [pendingWinTime, playerName, submitGameResultMutation]);

  const skipSubmission = useCallback(() => {
    setShowNameDialog(false);
    setPlayerName("");
    clearSessionId(); // Clear session since game is completed
  }, []);

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  return {
    // Game state
    board: gameSession?.board || [],
    gameState: gameSession?.gameState || "ready",
    timer: gameSession?.timer || 0,
    flaggedCells: gameSession?.flaggedCells || 0,
    config: GAME_CONFIGS[difficulty],
    difficulty,

    // Loading states
    isLoading: isLoading || isStartingGame || !isInitialized,
    isRevealingCell,
    isTogglingFlag,

    // Actions
    initializeGame,
    revealCell,
    toggleFlag,
    changeDifficulty,

    // Name submission for leaderboard
    showNameDialog,
    playerName,
    setPlayerName,
    submitResult,
    skipSubmission,
    pendingWinTime,
    isSubmittingResult: submitGameResultMutation.isPending,

    // Utility functions
    getCellClassName,
    getCellContent,
    getStatusText: () => getStatusText(gameSession?.gameState || "ready"),

    // Error handling
    error,
  };
};
