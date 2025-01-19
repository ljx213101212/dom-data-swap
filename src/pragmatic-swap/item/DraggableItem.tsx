/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { memo, useEffect, useRef, useState } from "react";

import { css, jsx } from "@emotion/react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { ItemWidth } from "../Board";
import { ApiData, Rectangle } from "../hook/useRandomRectangles";
import { DragState } from "../typesRuntime";
import "./rotation.css";

interface ItemProps {
  id: string;
  rect: Rectangle;
}

export interface DraggableItemData {
  type: string;
  rect: Rectangle;
}

const DraggableItem = memo(({ id, rect }: ItemProps) => {
  const ref = useRef(null);
  const [state, setState] = useState<DragState>("idle");
  const [animationClass, setAnimationClass] = useState<string>("");

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ type: "item", rect }),
      onDragStart: ({ source, location }) => {
        setState("draggingNoHover");
      },
      onDrop: ({ source, location }) => {
        console.log("onDrop", source, location);
        if (location.current.dropTargets.length === 0) {
          setState("droppingNoSwap");
        } else {
          setState("droppingSwap");
        }
      }, // NEW
      // onGenerateDragPreview: disableNativeDragPreview,
    });
  }, [rect]);

  useEffect(() => {
    setAnimationClass("");
    const handleAnimationEnd = () => {
      setAnimationClass("");
    };
    if (rect.shouldShowAnimation) {
      setAnimationClass("rotate-item-animation");
      (ref.current as unknown as HTMLElement).addEventListener(
        "animationend",
        handleAnimationEnd
      );
    }
    return () => {
      (ref.current as unknown as HTMLElement).removeEventListener(
        "animationend",
        handleAnimationEnd
      );
    };
  }, [rect]);

  // console.log("TEST: ", image, alt, location, pieceType);

  return (
    <div
      id={id}
      className={`absolute z-50 ${animationClass}`} //important
      css={imageStyles({ width: ItemWidth - 2, height: ItemWidth - 2 })}
      style={{ ...getStyle(state) }}
      ref={ref}
    >
      {rect?.apiData?.userId}
    </div>
  );
});

export default DraggableItem;

interface ItemContainerProps {
  width: number;
  height: number;
}

const imageStyles = (prop: ItemContainerProps) =>
  css({
    width: prop.width,
    height: prop.height,
    fontSize: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

const getStyle = (state: DragState) => {
  if (state === "draggingNoHover") {
    return {
      backgroundColor: "#FDF4BF",
      opacity: 0,
    };
  } else {
    return {
      backgroundColor: "#FDF4BF",
    };
  }
};
