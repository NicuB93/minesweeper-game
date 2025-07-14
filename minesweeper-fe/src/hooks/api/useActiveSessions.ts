import { createQuery } from "react-query-kit";
import type { GameSession } from "./useGameSession";

type GetActiveSessionsVariables = {
  limit?: number;
};

export const useGetActiveSessions = createQuery<
  GameSession[],
  GetActiveSessionsVariables,
  Error
>({
  queryKey: ["active-sessions"],
  fetcher: async (variables) => {
    const baseUrl = import.meta.env.VITE_BE_API_URL || "http://localhost:3000";

    const params = new URLSearchParams();
    if (variables.limit) {
      params.append("limit", variables.limit.toString());
    }

    const queryString = params.toString();
    const url = `${baseUrl}/game-sessions${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch active sessions: ${response.statusText}`
      );
    }

    return response.json();
  },
});
