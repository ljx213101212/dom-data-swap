import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useDndContext } from "../../DndContext";
import { draggableWidth } from "./Draggable";

interface CardPreviewProps {
  rect: DOMRect;
}

export default function CardPreview({
  rect,
  children,
}: PropsWithChildren<CardPreviewProps>) {
  const { scale } = useDndContext();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    //how to get current fontSize in number?
    const fontSize = getComputedStyle(previewRef.current)?.fontSize;
    const fontSizeNumber = parseInt(fontSize, 10); // Extracts only the number part
    setFontSize(fontSizeNumber);
    // const fontSize = getComputedStyle(previewRef.current)?.fontSize;
    console.log("fontSize", fontSizeNumber, fontSizeNumber * scale);

    //get fontsize number
  }, []);

  return (
    <div
      ref={previewRef}
      className={`flex justify-center items-center bg-[#FDF4BF]`}
      style={{
        width: draggableWidth,
        height: draggableWidth,
        transform: `scale(${scale})`,
      }}
    >
      {/* {children} */}
    </div>
  );
}
