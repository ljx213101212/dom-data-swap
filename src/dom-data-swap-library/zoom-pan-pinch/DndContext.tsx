import { createContext, PropsWithChildren, useContext, useState } from "react";

type DndContextType = {
  isHoverOnDraggable: boolean;
  setIsHoverOnDraggable: (isHoverOnDraggable: boolean) => void;
  scale: number;
  setScale: (scale: number) => void;
};

const DndContext = createContext<DndContextType>({
  isHoverOnDraggable: false,
  setIsHoverOnDraggable: () => {},
  scale: 1,
  setScale: () => {},
});

const DndProvider = ({ children }: PropsWithChildren) => {
  const [scale, setScale] = useState(1);
  const [isHoverOnDraggable, setIsHoverOnDraggable] = useState(false);

  console.log("DndProvider isHoverOnDraggable", isHoverOnDraggable);
  return (
    <DndContext.Provider
      value={{
        isHoverOnDraggable,
        setIsHoverOnDraggable,
        scale,
        setScale,
      }}
    >
      {children}
    </DndContext.Provider>
  );
};

const useDndContext = () => {
  return useContext(DndContext);
};

export { DndProvider, useDndContext };
