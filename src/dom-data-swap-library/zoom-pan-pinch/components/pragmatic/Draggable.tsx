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
import type {
  DraggableState,
  DragState,
} from "@/dom-data-swap-library/common/typesRuntime";
import CrossHair from "@/dom-data-swap-library/common/icons/CrossHair";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { Input } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { createPortal } from "react-dom";
import DragPreview from "./DragPreview";

interface ItemProps {
  id: string;
}

export interface DraggableItemData {
  type: string;
}

export const draggableWidth = 98;
const Draggable = ({ id }: ItemProps) => {
  const ref = useRef(null);
  const [state, setState] = useState<DragState>("idle");
  const { setIsHoverOnDraggable, scale } = useDndContext();
  const [draggableState, setDraggableState] = useState<DraggableState>({
    type: "idle",
  });

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ type: "item" }),
      onDragStart: ({ source, location }) => {
        console.log("onDragStart");
        setState("draggingNoHover");
        const rect = source.element.getBoundingClientRect();

        console.log("Original bounding box:", rect);
      },
      onGenerateDragPreview: ({ source, nativeSetDragImage, location }) => {
        console.log(
          "show offset",
          source.element.getBoundingClientRect().x,
          location.current.input.clientX
        );
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: preserveOffsetOnSource({
            element: source.element,
            input: location.current.input,
          }),
          render({ container }) {
            const preview = source.element.cloneNode(true) as HTMLElement;
            //Apply scale to portal
            //preview.style.transform = `scale(${scale})`;
            container.appendChild(preview);
            setDraggableState({
              type: "preview",
              container,
              rect: (el as HTMLElement).getBoundingClientRect(),
            });
            return () =>
              setDraggableState({
                type: "is-dragging",
              });
          },
          // render: ({ container }) => {
          //   setPreviewContainer(container);
          //   // return () => {
          //   //   setPreviewContainer(null);
          //   // };
          // },
          // render({ container }) {
          //   setDraggableState({
          //     type: "preview",
          //     container,
          //     rect: (el as HTMLElement).getBoundingClientRect(),
          //   });

          //   console.log("[Font]", source.element.style.fontSize);
          //   const preview = source.element.cloneNode(true) as HTMLElement;
          //   container.appendChild(preview);
          //   return () =>
          //     setDraggableState({
          //       type: "is-dragging",
          //     });
          // },
        });
      },
      onDrag: ({ source, location }) => {
        console.log("onDrag", source, location.initial);
        const honeyPotSelector = "[data-pdnd-honey-pot]";
        const honeyPot = document.querySelector(honeyPotSelector);
        console.log("honeyPot", honeyPot?.clientWidth, honeyPot?.clientHeight);
      },
      onDrop: ({ source, location }) => {
        console.log("onDrop", source, location);
        // if (location.current.dropTargets.length === 0) {
        //   setState("idle");
        // } else {
        //   setState("droppingSwap");
        // }
        setState("idle");
      }, // NEW
      // onGenerateDragPreview: disableNativeDragPreview,
    });
  }, [scale]);

  return (
    <div>
      <div
        id={id}
        className={clsx(
          `absolute z-50 flex justify-center items-center text-2xl`,
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
      >
        {id}
      </div>
      {draggableState.type === "preview"
        ? createPortal(
            <DragPreview rect={draggableState.rect} />,
            draggableState.container
          )
        : null}
      {/* {draggableState.type === "preview"
        ? createPortal(
            <div
              className="w-[100px] h-[100px]"
              style={{
                transform: `scale(${scale})`,
              }}
            />,
            draggableState.container
          )
        : null} */}
    </div>
  );
};

export default Draggable;
