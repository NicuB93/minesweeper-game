type MinesweeperInfoProps = {
  timer: number;
  flaggedCells: number;
  getStatusText: () => string;
  config: { rows: number; cols: number; mines: number };
};

export const MinesweeperInfo = ({
  flaggedCells,
  getStatusText,
  config,
}: MinesweeperInfoProps) => {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <div className="bg-white/20 dark:bg-black/30 px-4 py-2 rounded-lg text-white font-bold">
        Mines: {config.mines - flaggedCells}
      </div>

      <div className="bg-white/20 dark:bg-black/30 px-4 py-2 rounded-lg text-white font-bold">
        Status: {getStatusText()}
      </div>
    </div>
  );
};
