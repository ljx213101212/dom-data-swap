import React, { PropsWithChildren } from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
}

export function Draggable(props: PropsWithChildren<DraggableProps>) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="w-32 h-32 bg-blue-500 rounded-full"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    ></div>
  );
}
