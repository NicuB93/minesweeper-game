import { createQuery } from "react-query-kit";

export type GameSession = {
  id: string;
  playerInitials: string | null;
  board: Cell[][];
  gameState: "ready" | "playing" | "won" | "lost";
  timer: number;
  flaggedCells: number;
  firstClick: boolean;
  difficulty: "medium";
  rows: number;
  cols: number;
  mines: number;
  createdAt: string;
  updatedAt: string;
};

export type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type GetGameSessionVariables = {
  sessionId: string;
};

export const useGetGameSession = createQuery<
  GameSession,
  GetGameSessionVariables,
  Error
>({
  queryKey: ["game-session"],
  fetcher: async (variables) => {
    const baseUrl = import.meta.env.VITE_BE_API_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/game-sessions/${variables.sessionId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch game session: ${response.statusText}`);
    }

    return response.json();
  },
});
