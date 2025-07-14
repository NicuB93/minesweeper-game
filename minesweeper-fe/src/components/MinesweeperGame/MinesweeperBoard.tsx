import type { Cell } from "../../hooks/api/useGameSession";

type MinesweeperBoardProps = {
  board: Cell[][];
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  getCellClassName: (cell: Cell) => string;
  getCellContent: (cell: Cell) => string | number;
  gameState: "ready" | "playing" | "won" | "lost";
  config: { cols: number; rows: number; mines: number };
};

export const MinesweeperBoard = ({
  board,
  revealCell,
  toggleFlag,
  getCellClassName,
  getCellContent,
  gameState,
  config,
}: MinesweeperBoardProps) => {
  return (
    <div
      className="inline-block bg-gray-900 p-2 rounded-lg shadow-inner"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
        gap: "1px",
      }}
    >
      {board.map((row) =>
        row.map((cell) => (
          <button
            key={`${cell.row}-${cell.col}`}
            className={getCellClassName(cell)}
            onClick={() => revealCell(cell.row, cell.col)}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleFlag(cell.row, cell.col);
            }}
            disabled={gameState === "won" || gameState === "lost"}
          >
            {getCellContent(cell)}
          </button>
        ))
      )}
    </div>
  );
};
