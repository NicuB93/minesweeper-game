import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MinesweeperGame } from "./components/MinesweeperGame";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MinesweeperGame />
    </QueryClientProvider>
  );
}

export default App;
