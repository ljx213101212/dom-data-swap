import React, { PropsWithChildren } from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
}

export function Droppable(props: PropsWithChildren<DroppableProps>) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
    border: `${isOver ? "3px" : "1px"} solid green`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-48 h-48 flex-1 flex justify-center items-center"
    >
      {props.children}
    </div>
  );
}
