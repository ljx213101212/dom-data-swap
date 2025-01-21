import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  rectIntersection,
} from "@dnd-kit/core";

import { Draggable } from "@/dnd-kit/Draggable";
import { Droppable } from "@/dnd-kit/Droppable";
import { useState } from "react";

export default function Tutorial() {
  const containers = ["A", "B", "C"];
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggableMarkup = <Draggable id={"draggable"}>Drag Me!</Draggable>;

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-center items-center">
          {parent === null ? draggableMarkup : null}
        </div>

        <div className="w-full flex justify-center items-center">
          {containers.map((id) => (
            <Droppable key={id} id={id}>
              {parent === id ? draggableMarkup : "Drop Here"}
            </Droppable>
          ))}
        </div>

        {/* {!isDropped ? draggableMarkup : null}
      <Droppable>{isDropped ? draggableMarkup : "Drop Here"}</Droppable> */}
      </DndContext>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    // if (event.over && event.over.id === "droppable") {
    //   setIsDropped(true);
    // }
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}
