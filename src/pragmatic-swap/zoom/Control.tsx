import { useEffect } from "react";
import {
  useControls,
  type ReactZoomPanPinchHandlers,
} from "react-zoom-pan-pinch";
import { twMerge } from "tailwind-merge";

import CrossHair from "@/pragmatic-swap/icons/CrossHair";
import Minus from "@/pragmatic-swap/icons/Minus";
import Plus from "@/pragmatic-swap/icons/Plus";
import { Tooltip } from "antd";

interface ZoomControlsProps extends Partial<ReactZoomPanPinchHandlers> {
  className?: string;
}

function ZoomControls({
  zoomIn,
  zoomOut,
  resetTransform,
  className,
}: ZoomControlsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        zoomIn?.();
      } else if (event.ctrlKey && (event.key === "-" || event.key === "_")) {
        event.preventDefault();
        zoomOut?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomIn, zoomOut]);

  const buttonClasses =
    "flex size-11 items-center justify-center rounded-lg bg-white shadow-[0px_0px_1px_rgba(0,0,0,0.3),0px_4px_14px_-1px_rgba(0,0,0,0.05)] hover:bg-gray-100 hover:shadow-[0px_0px_1px_rgba(0,0,0,0.3),0px_6px_16px_-1px_rgba(0,0,0,0.08)] transition-all duration-200";

  console.log(zoomIn);
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
      <Tooltip title="重置缩放" placement="left">
        <button
          className={buttonClasses}
          onClick={() => resetTransform?.()}
          type="button"
          disabled={!resetTransform}
        >
          <CrossHair />
        </button>
      </Tooltip>
      <Tooltip title="放大: Ctrl + 加号键" placement="left">
        <button
          className={buttonClasses}
          onClick={() => zoomIn?.()}
          type="button"
          disabled={!zoomIn}
        >
          <Plus />
        </button>
      </Tooltip>
      <Tooltip title="缩小: Ctrl + 减号键" placement="left">
        <button
          className={buttonClasses}
          onClick={() => zoomOut?.()}
          type="button"
          disabled={!zoomOut}
        >
          <Minus />
        </button>
      </Tooltip>
    </div>
  );
}

export default ZoomControls;
