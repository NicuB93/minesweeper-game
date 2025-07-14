interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const GAME_CONFIG: GameConfig = {
  rows: 16,
  cols: 16,
  mines: 40,
};

export const CELL_COLORS = [
  "",
  "text-blue-400",
  "text-green-400",
  "text-red-400",
  "text-purple-400",
  "text-red-300",
  "text-teal-400",
  "text-foreground",
  "text-muted-foreground",
];
