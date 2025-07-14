import { createQuery } from "react-query-kit";

type LeaderBoardResponse = {
  id: string;
  playerInitials: string;
  completionTime: number;
  gameDate: string;
  createdAt: string;
  updatedAt: string;
}[];

type Variables = {
  limit?: number;
};

export const useLeaderBoard = createQuery<
  LeaderBoardResponse,
  Variables,
  Error
>({
  queryKey: ["leaderboard"],
  fetcher: async (variables) => {
    const baseurl = import.meta.env.VITE_BE_API_URL || "http://localhost:3000";

    const params = new URLSearchParams();
    if (variables.limit) {
      params.append("limit", variables.limit.toString());
    }

    const queryString = params.toString();
    const url = `${baseurl}/game-results/leaderboard${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return response.json();
  },
});
