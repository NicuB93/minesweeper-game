import type { Cell } from "../../../hooks/api/useGameSession";
import { CELL_COLORS } from "./constants";

export const getCellClassName = (cell: Cell): string => {
  let className =
    "w-8 h-8 text-xs font-bold transition-all duration-100 border border-border ";

  if (cell.isRevealed) {
    className += "bg-gray-200 ";
    if (cell.isMine) {
      className += "!bg-destructive text-destructive-foreground ";
    } else if (cell.neighborMines > 0) {
      className += CELL_COLORS[cell.neighborMines] + " ";
    }
  } else {
    className += "bg-card hover:bg-card/80 ";
    if (cell.isFlagged) {
      className += "!bg-yellow-600 text-white ";
    }
  }

  return className;
};

export const getCellContent = (cell: Cell): string | number => {
  if (cell.isRevealed) {
    if (cell.isMine) return "💣";
    if (cell.neighborMines > 0) return cell.neighborMines;
  } else if (cell.isFlagged) {
    return "🚩";
  }
  return "";
};

export const getStatusText = (
  gameState: "ready" | "playing" | "won" | "lost"
): string => {
  switch (gameState) {
    case "ready":
      return "Ready";
    case "playing":
      return "Playing";
    case "won":
      return "Won!";
    case "lost":
      return "Lost";
    default:
      return "Ready";
  }
};
