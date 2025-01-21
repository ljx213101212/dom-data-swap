/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { memo, useEffect, useRef, useState } from "react";

import { css, jsx } from "@emotion/react";
import { ItemWidth } from "../Board";
import { ApiData, Rectangle } from "../../common/hook/useRandomRectangles";
import { DragState } from "../../common/typesRuntime";
import "./rotation.css";
import { Over, useDraggable } from "@dnd-kit/core";
import { Transform } from "@dnd-kit/utilities";

interface ItemProps {
  id: string;
  rect: Rectangle;
  scale?: number;
}

export interface DraggableItemData {
  type: string;
  rect: Rectangle;
}

const Draggable = memo(({ id, rect, scale }: ItemProps) => {
  const ref = useRef(null);
  const [state, setState] = useState<DragState>("idle");
  const [animationClass, setAnimationClass] = useState<string>("");

  const { attributes, listeners, setNodeRef, transform, isDragging, over } =
    useDraggable({
      id: id,
      data: {
        rect,
      },
    });

  const [lastOver, setLastOver] = useState<Over | null>(null);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // useEffect(() => {
  //   const el = ref.current;
  //   invariant(el);

  //   return draggable({
  //     element: el,
  //     getInitialData: () => ({ type: "item", rect }),
  //     onDragStart: ({ source, location }) => {
  //       setState("draggingNoHover");
  //     },
  //     onDrop: ({ source, location }) => {
  //       console.log("onDrop", source, location);
  //       if (location.current.dropTargets.length === 0) {
  //         setState("droppingNoSwap");
  //       } else {
  //         setState("droppingSwap");
  //       }
  //     }, // NEW
  //     // onGenerateDragPreview: disableNativeDragPreview,
  //   });
  // }, [rect]);

  useEffect(() => {
    if (over) {
      setLastOver(over);
    }
  }, [over]);

  useEffect(() => {
    if (lastOver) {
      setState("droppingSwap");
    } else {
      setState("droppingNoSwap");
    }
  }, [isDragging]);

  useEffect(() => {
    if (!rect) return;
    setAnimationClass("");
    const handleAnimationEnd = () => {
      setAnimationClass("");
    };
    if (rect.shouldShowAnimation) {
      setAnimationClass("rotate-item-animation");
      (ref.current as unknown as HTMLElement)?.addEventListener(
        "animationend",
        handleAnimationEnd
      );
    }
    return () => {
      (ref.current as unknown as HTMLElement)?.removeEventListener(
        "animationend",
        handleAnimationEnd
      );
    };
  }, [rect, scale]);

  return (
    <div
      id={id}
      className={`absolute ${animationClass} z-50`} //important
      // css={imageStyles({ width: ItemWidth - 2, height: ItemWidth - 2 })}
      style={{
        width: ItemWidth - 2,
        height: ItemWidth - 2,
        fontSize: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...getStyle(state, transform, scale ?? 1),
      }}
      // style={{ ...style }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {rect?.apiData?.userId}
    </div>
  );
});

export default Draggable;

interface ItemContainerProps {
  width: number;
  height: number;
}
const getStyle = (
  state: DragState,
  transform: Transform | null,
  scale: number
) => {
  const scaleFactor = 1 / scale;
  const baseStyle = {
    left: transform ? `${transform.x * scaleFactor}px` : "auto",
    top: transform ? `${transform.y * scaleFactor}px` : "auto",
    // transform: transform
    //   ? `translate3D(${transform.x * scaleFactor}px, ${
    //       transform.y * scaleFactor
    //     }px, 0)`
    //   : "auto",
    // transformStyle: "preserve-3d",
    // transform: transform
  };

  if (state === "draggingNoHover") {
    return {
      ...baseStyle,
      backgroundColor: "#FDF4BF",
      opacity: 0,
    };
  } else {
    return {
      ...baseStyle,
      backgroundColor: "#FDF4BF",
    };
  }
};
