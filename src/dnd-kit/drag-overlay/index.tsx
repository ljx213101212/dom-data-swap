import React, { useState } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import type {
  DropAnimation,
  Modifiers,
  Translate,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { Axis, Draggable, DraggableOverlay, Wrapper } from "./components";
import { Droppable } from "./components/Droppable";
import { GridContainer } from "./components/GridContainer";

interface Props {
  axis?: Axis;
  dragOverlayModifiers?: Modifiers;
  dropAnimation?: DropAnimation | null;
  handle?: boolean;
  label?: string;
  modifiers?: Modifiers;
  style?: React.CSSProperties;
}

function DragOverlayExample({
  axis,
  dropAnimation,
  handle,
  label,
  modifiers,
}: Props) {
  const item = <DraggableItem />;
  const [isDragging, setIsDragging] = useState(false);
  const [pendingId, setPendingId] = useState<UniqueIdentifier | null>(null);
  const containers = ["A"];

  console.log("STATE", isDragging, pendingId);
  return (
    <DndContext
      modifiers={modifiers}
      onDragStart={() => {
        console.log("onDragStart");
        setIsDragging(true);
      }}
      onDragEnd={({ over }) => {
        console.log("onDragEnd", over);
        setPendingId(over ? over.id : null);
        setIsDragging(false);
      }}
    >
      <Wrapper style={{ width: 350, flexShrink: 0 }}>
        {/* {pendingId === null ? <DraggableItem /> : null} */}
        <DraggableItem />
      </Wrapper>
      <Wrapper>
        {containers.map((id) => (
          <Droppable key={id} id={id} dragging={isDragging}>
            {pendingId === id ? <DraggableItem /> : null}
          </Droppable>
        ))}
      </Wrapper>
      <DraggableOverlay />
    </DndContext>
  );
}

interface DraggableItemProps {
  handle?: boolean;
}

function DraggableItem({ handle }: DraggableItemProps) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: "draggable-item",
  });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      listeners={listeners}
      style={{
        opacity: isDragging ? 0.5 : undefined,
      }}
    />
  );
}

export default DragOverlayExample;
