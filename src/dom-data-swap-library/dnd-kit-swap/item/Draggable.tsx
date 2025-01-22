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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    over,
    node,
  } = useDraggable({
    id: id,
    data: {
      rect,
    },
  });

  const [lastOver, setLastOver] = useState<Over | null>(null);

  useEffect(() => {
    if (over) {
      setLastOver(over);
    }
  }, [over]);

  useEffect(() => {
    if (!isDragging) {
      //set node z-index to 50
      (node.current as HTMLElement).style.zIndex = "50";
    }

    if (isDragging && !over) {
      setState("draggingNoHover");
    } else if (isDragging && over) {
      setState("draggingHoverAllowed");
    } else if (!isDragging && !over) {
      setState("idle");
    }
  }, [isDragging, over]);

  return (
    <div
      id={id}
      className={`absolute z-50`} //important
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
      <div className="absolute z-50">{rect?.apiData?.userId}</div>
    </div>
  );
});

export default Draggable;

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
      opacity: 0.4,
    };
  } else {
    return {
      ...baseStyle,
      backgroundColor: "#FDF4BF",
    };
  }
};
