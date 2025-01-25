/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { memo, useEffect, useRef, useState } from "react";

import { css, jsx } from "@emotion/react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import clsx from "clsx";
import { useDndContext } from "../../DndContext";
import { DragState } from "@/dom-data-swap-library/common/typesRuntime";

interface ItemProps {
  id: string;
}

export interface DraggableItemData {
  type: string;
}

const draggableWidth = 98;
const Draggable = ({ id }: ItemProps) => {
  const ref = useRef(null);
  const [state, setState] = useState<DragState>("idle");
  const { setIsHoverOnDraggable } = useDndContext();

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ type: "item" }),
      onDragStart: ({ source, location }) => {
        console.log("onDragStart");
        setState("draggingNoHover");
      },
      onDrop: ({ source, location }) => {
        console.log("onDrop", source, location);
        if (location.current.dropTargets.length === 0) {
          setState("idle");
        } else {
          setState("droppingSwap");
        }
      }, // NEW
      // onGenerateDragPreview: disableNativeDragPreview,
    });
  }, []);

  return (
    <div
      id={id}
      className={clsx(
        `absolute z-50`,
        // `w-[${draggableWidth}px] h-[${draggableWidth}px]`,
        {
          "bg-[#FDF4BF]": state === "idle",
          "bg-[#FDF4BF] opacity-[0.4]": state === "draggingNoHover",
        }
      )}
      style={{
        width: `${draggableWidth}px`,
        height: `${draggableWidth}px`,
      }}
      ref={ref}
      onMouseEnter={() => {
        console.log("onMouseEnter");
        setIsHoverOnDraggable(true);
      }} // Set to true when hovered
      onMouseLeave={() => setIsHoverOnDraggable(false)} // Set to false when hover ends
    ></div>
  );
};

export default Draggable;
