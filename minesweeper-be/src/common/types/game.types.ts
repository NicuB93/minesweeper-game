export type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type Difficulty = 'medium';

export type GameState = 'ready' | 'playing' | 'won' | 'lost';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const GAME_CONFIGS: Record<Difficulty, GameConfig> = {
  medium: { rows: 16, cols: 16, mines: 40 },
};
