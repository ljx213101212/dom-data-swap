import { DndProvider } from "./DndContext";
import App from "./App";

const Board = () => {
  return (
    <DndProvider>
      <App />
    </DndProvider>
  );
};

export default Board;
