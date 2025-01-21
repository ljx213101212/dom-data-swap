import React, { PropsWithChildren, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableProps {
  id: string;
}

export function Draggable(props: PropsWithChildren<DraggableProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    active,
    activatorEvent,
    activeNodeRect,
    node,
    isDragging,
    over,
  } = useDraggable({
    id: props.id,
  });

  // useEffect(() => {
  //   if (!isDragging) {

  //   }
  // }, [isDragging]);

  useEffect(() => {
    if (!isDragging) {
      console.log("is not dragging anymore", over);
    }
  }, [isDragging]);

  useEffect(() => {
    console.log("over:", over);
  }, [over]);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // console.log(
  //   "debug:",
  //   active,
  //   activatorEvent,
  //   attributes,
  //   activeNodeRect,
  //   node,
  //   over
  // );

  return (
    <div
      className="absolute w-32 h-32 bg-blue-500 rounded-full"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    ></div>
  );
}
