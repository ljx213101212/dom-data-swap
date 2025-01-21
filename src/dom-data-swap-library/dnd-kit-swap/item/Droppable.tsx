/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from "@emotion/react";
import { memo, PropsWithChildren, useEffect, useRef, useState } from "react";
import { type DragState } from "@/dom-data-swap-library/common/typesRuntime";
import { Rectangle } from "@/dom-data-swap-library/common/hook/useRandomRectangles";
import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  rect: Rectangle;
}

const Droppable = memo(
  ({ id, rect, children }: PropsWithChildren<DroppableProps>) => {
    const [state, setState] = useState<DragState>("idle");
    const [animationClass, setAnimationClass] = useState<string>("");
    const {
      isOver,
      setNodeRef,
      node: ref,
    } = useDroppable({
      id: id,
      data: {
        rect,
      },
    });

    // useEffect(() => {
    //   const el = ref.current;
    //   invariant(el);

    //   return dropTargetForElements({
    //     element: el,
    //     getData: () => ({ rect }),
    //     onDragEnter: ({ source }) => {
    //       console.log("onDragEnter", source, rect);
    //       //1. rect's apiData has userId
    //       //2. rect's apiData has not userId
    //       if (!rect.apiData?.userId) {
    //         setState("draggingHoverAllowed");
    //       }
    //     },
    //     onDragLeave: () => setState("idle"),
    //     onDrop: () => setState("idle"),
    //   });
    // }, [rect, children]);

    useEffect(() => {
      if (isOver) {
        if (!rect.apiData?.userId) {
          setState("draggingHoverAllowed");
        }
      } else {
        setState("idle");
      }
    }, [isOver]);

    useEffect(() => {
      setAnimationClass("");
      const handleAnimationEnd = () => {
        setAnimationClass("");
      };
      if (rect.shouldShowAnimation) {
        setAnimationClass("rotate-container-animation");
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
    }, [rect, children]);

    return (
      <div
        id={`container-${id}`}
        className={`absolute ${animationClass}`} //important
        key={id}
        style={{
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          border: `1px solid ${rect.color}`,
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          ...getStyle(state),
          //   userSelect: "none",
        }}
        ref={setNodeRef}
      >
        {children}
      </div>
    );
  }
);

export default Droppable;

const getStyle = (state: DragState) => {
  if (state === "idle") {
    return {
      backgroundColor: "#D6E0EA",
      border: "1.13px solid #1F62F5",
    };
  } else if (state === "draggingHoverAllowed") {
    return {
      backgroundColor: "#A8C1F4",
      border: "1.1px solid #1F62F5",
      borderStyle: "dashed",
    };
  }
};
