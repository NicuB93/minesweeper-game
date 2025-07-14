export const MinesweeperWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-white/10">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          💣 Minesweeper
        </h1>

        {children}
      </div>
    </div>
  );
};
