import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GameSession } from "./useGameSession";

const baseUrl = import.meta.env.VITE_BE_API_URL || "http://localhost:3000";

// Start New Game
export type StartGameRequest = {
  difficulty: "medium";
  playerInitials?: string;
};

export const useStartGame = () => {
  const queryClient = useQueryClient();

  return useMutation<GameSession, Error, StartGameRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${baseUrl}/game-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to start game: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Cache the new game session
      queryClient.setQueryData(["game-session", data.id], data);
    },
  });
};

// Reveal Cell
export type RevealCellRequest = {
  sessionId: string;
  row: number;
  col: number;
};

export const useRevealCell = () => {
  const queryClient = useQueryClient();

  return useMutation<GameSession, Error, RevealCellRequest>({
    mutationFn: async ({ sessionId, row, col }) => {
      const response = await fetch(
        `${baseUrl}/game-sessions/${sessionId}/reveal`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ row, col }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to reveal cell: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update the cached game session
      queryClient.setQueryData(["game-session", data.id], data);
    },
  });
};

// Toggle Flag
export type ToggleFlagRequest = {
  sessionId: string;
  row: number;
  col: number;
};

export const useToggleFlag = () => {
  const queryClient = useQueryClient();

  return useMutation<GameSession, Error, ToggleFlagRequest>({
    mutationFn: async ({ sessionId, row, col }) => {
      const response = await fetch(
        `${baseUrl}/game-sessions/${sessionId}/flag`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ row, col }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to toggle flag: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update the cached game session
      queryClient.setQueryData(["game-session", data.id], data);
    },
  });
};

// Update Timer
export type UpdateTimerRequest = {
  sessionId: string;
};

export const useUpdateTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<GameSession, Error, UpdateTimerRequest>({
    mutationFn: async ({ sessionId }) => {
      const response = await fetch(
        `${baseUrl}/game-sessions/${sessionId}/timer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update timer: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Update the cached game session
      queryClient.setQueryData(["game-session", data.id], data);
    },
  });
};

// Submit Game Result (when game is completed)
export type SubmitGameResultRequest = {
  playerInitials: string;
  completionTime: number;
  gameDate?: string;
};

export type GameResultResponse = {
  id: string;
  playerInitials: string;
  completionTime: number;
  gameDate: string;
  createdAt: string;
  updatedAt: string;
};

export const useSubmitGameResult = () => {
  const queryClient = useQueryClient();

  return useMutation<GameResultResponse, Error, SubmitGameResultRequest>({
    mutationFn: async (data) => {
      const response = await fetch(`${baseUrl}/game-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit game result: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate leaderboard to refresh it
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
};

// Delete Game Session
export type DeleteGameSessionRequest = {
  sessionId: string;
};

export const useDeleteGameSession = () => {
  const queryClient = useQueryClient();

  return useMutation<GameSession, Error, DeleteGameSessionRequest>({
    mutationFn: async ({ sessionId }) => {
      const response = await fetch(`${baseUrl}/game-sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete game session: ${response.statusText}`
        );
      }

      return response.json();
    },
    onSuccess: (_, { sessionId }) => {
      // Remove the game session from cache
      queryClient.removeQueries({ queryKey: ["game-session", sessionId] });
      // Invalidate active sessions query
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
  });
};
