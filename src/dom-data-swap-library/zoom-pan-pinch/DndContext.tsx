import { createContext, PropsWithChildren, useContext, useState } from "react";

type DndContextType = {
  isHoverOnDraggable: boolean;
  setIsHoverOnDraggable: (isHoverOnDraggable: boolean) => void;
};

const DndContext = createContext<DndContextType>({
  isHoverOnDraggable: false,
  setIsHoverOnDraggable: () => {},
});

const DndProvider = ({ children }: PropsWithChildren) => {
  const [isHoverOnDraggable, setIsHoverOnDraggable] = useState(false);

  console.log("DndProvider isHoverOnDraggable", isHoverOnDraggable);
  return (
    <DndContext.Provider
      value={{
        isHoverOnDraggable,
        setIsHoverOnDraggable,
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
