import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { css, jsx } from "@emotion/react";
import {
  memo,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import invariant from "tiny-invariant";
import clsx from "clsx";
import { DragState } from "@/dom-data-swap-library/common/typesRuntime";

interface DraggableItemContainerProps {
  id: string;
}

const droppableWidth = 100;

const Droppable = ({
  id,
  children,
}: PropsWithChildren<DraggableItemContainerProps>) => {
  const ref = useRef(null);
  const [state, setState] = useState<DragState>("idle");
  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({}),
      onDragEnter: ({ source }) => {
        console.log("onDragEnter", source);
        //1. rect's apiData has userId
        //2. rect's apiData has not userId
        //   if (!rect.apiData?.userId) {
        //     setState("draggingHoverAllowed");
        //   }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, [children]);

  return (
    <div
      id={`container-${id}`}
      className={clsx(
        `absolute`,
        // `w-[${droppableWidth}px] h-[${droppableWidth}px]`,
        {
          "bg-[#D6E0EA] shadow-[0_0_0_1px_#1F62F5]": state === "idle",
          "bg-[#A8C1F4] shadow-[0_0_0_1px_#1F62F5]":
            state === "draggingHoverAllowed",
        }
      )}
      key={id}
      style={{
        width: `${droppableWidth}px`,
        height: `${droppableWidth}px`,
        // border: `1px solid ${rect.color}`,
        left: `100px`,
        top: `100px`,
        // ...getStyle(state),
        //   userSelect: "none",
      }}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default Droppable;
