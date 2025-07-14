import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import {
  useDeleteGameSession,
  useRevealCell,
  useStartGame,
  useSubmitGameResult,
  useToggleFlag,
  useUpdateTimer,
  type StartGameRequest,
} from "./useGameMutations";
import type { GameSession } from "./useGameSession";

const baseUrl = import.meta.env.VITE_BE_API_URL || "http://localhost:3000";

export const useGameSessionManager = (sessionId?: string) => {
  // Query for getting game session using standard useQuery
  const {
    data: gameSession,
    isLoading,
    error,
    refetch,
  } = useQuery<GameSession>({
    queryKey: ["game-session", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("Session ID is required");

      const response = await fetch(`${baseUrl}/game-sessions/${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch game session: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!sessionId,
  });

  // Mutations
  const startGameMutation = useStartGame();
  const revealCellMutation = useRevealCell();
  const toggleFlagMutation = useToggleFlag();
  const updateTimerMutation = useUpdateTimer();
  const submitGameResultMutation = useSubmitGameResult();
  const deleteGameSessionMutation = useDeleteGameSession();

  // Auto-update timer for playing games
  useEffect(() => {
    if (!sessionId || !gameSession || gameSession.gameState !== "playing") {
      return;
    }

    const interval = setInterval(() => {
      updateTimerMutation.mutate({ sessionId });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId, gameSession, updateTimerMutation]);

  // Actions
  const startGame = useCallback(
    (config: StartGameRequest) => {
      return startGameMutation.mutateAsync(config);
    },
    [startGameMutation]
  );

  const revealCell = useCallback(
    (row: number, col: number) => {
      if (!sessionId) return;
      return revealCellMutation.mutateAsync({ sessionId, row, col });
    },
    [sessionId, revealCellMutation]
  );

  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (!sessionId) return;
      return toggleFlagMutation.mutateAsync({ sessionId, row, col });
    },
    [sessionId, toggleFlagMutation]
  );

  const submitGameResult = useCallback(
    (playerInitials: string) => {
      if (!gameSession) return;
      return submitGameResultMutation.mutateAsync({
        playerInitials,
        completionTime: gameSession.timer,
        gameDate: new Date().toISOString(),
      });
    },
    [gameSession, submitGameResultMutation]
  );

  const deleteSession = useCallback(() => {
    if (!sessionId) return;
    return deleteGameSessionMutation.mutateAsync({ sessionId });
  }, [sessionId, deleteGameSessionMutation]);

  const refreshSession = useCallback(() => {
    return refetch();
  }, [refetch]);

  return {
    // Data
    gameSession,
    isLoading,
    error,

    // Actions
    startGame,
    revealCell,
    toggleFlag,
    submitGameResult,
    deleteSession,
    refreshSession,

    // Mutation states
    isStartingGame: startGameMutation.isPending,
    isRevealingCell: revealCellMutation.isPending,
    isTogglingFlag: toggleFlagMutation.isPending,
    isSubmittingResult: submitGameResultMutation.isPending,
    isDeletingSession: deleteGameSessionMutation.isPending,

    // Mutation errors
    startGameError: startGameMutation.error,
    revealCellError: revealCellMutation.error,
    toggleFlagError: toggleFlagMutation.error,
    submitGameResultError: submitGameResultMutation.error,
    deleteSessionError: deleteGameSessionMutation.error,
  };
};
