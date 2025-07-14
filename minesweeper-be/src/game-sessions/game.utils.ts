import { Cell } from '../common/types/game.types';

export class GameUtils {
  static createEmptyBoard(rows: number, cols: number): Cell[][] {
    const board: Cell[][] = [];
    for (let row = 0; row < rows; row++) {
      board[row] = [];
      for (let col = 0; col < cols; col++) {
        board[row][col] = {
          row,
          col,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    return board;
  }

  static placeMines(
    board: Cell[][],
    mineCount: number,
    excludeRow: number,
    excludeCol: number,
  ): Cell[][] {
    const rows = board.length;
    const cols = board[0].length;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    const availablePositions: { row: number; col: number }[] = [];

    // Get all positions except the first click and its neighbors
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isExcluded =
          Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1;
        if (!isExcluded) {
          availablePositions.push({ row, col });
        }
      }
    }

    // Randomly place mines
    for (let i = 0; i < mineCount && availablePositions.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      const { row, col } = availablePositions.splice(randomIndex, 1)[0];
      newBoard[row][col].isMine = true;
    }

    // Calculate neighbor mine counts
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          newBoard[row][col].neighborMines = this.countNeighborMines(
            newBoard,
            row,
            col,
          );
        }
      }
    }

    return newBoard;
  }

  static countNeighborMines(board: Cell[][], row: number, col: number): number {
    let count = 0;
    const rows = board.length;
    const cols = board[0].length;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          board[newRow][newCol].isMine
        ) {
          count++;
        }
      }
    }
    return count;
  }

  static revealCell(board: Cell[][], row: number, col: number): Cell[][] {
    const rows = board.length;
    const cols = board[0].length;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      newBoard[row][col].isRevealed ||
      newBoard[row][col].isFlagged
    ) {
      return newBoard;
    }

    newBoard[row][col].isRevealed = true;

    // If it's an empty cell (no neighboring mines), reveal neighbors
    if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (!newBoard[newRow][newCol].isRevealed) {
              return this.revealCell(newBoard, newRow, newCol);
            }
          }
        }
      }
    }

    return newBoard;
  }

  static revealAllMines(board: Cell[][]): Cell[][] {
    return board.map((row) =>
      row.map((cell) => ({
        ...cell,
        isRevealed: cell.isMine ? true : cell.isRevealed,
      })),
    );
  }

  static checkWinCondition(board: Cell[][]): boolean {
    for (const row of board) {
      for (const cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  }

  static toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (
      row >= 0 &&
      row < board.length &&
      col >= 0 &&
      col < board[0].length &&
      !newBoard[row][col].isRevealed
    ) {
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    }

    return newBoard;
  }

  static countFlags(board: Cell[][]): number {
    let count = 0;
    for (const row of board) {
      for (const cell of row) {
        if (cell.isFlagged) {
          count++;
        }
      }
    }
    return count;
  }
}
