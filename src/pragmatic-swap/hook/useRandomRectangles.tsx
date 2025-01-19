import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type ApiData = {
  userId: string | undefined;
};

export interface Rectangle {
  id: number;
  width: number;
  height: number;
  color: string;
  left: number;
  top: number;
  apiData?: ApiData; //需要替换的数据
  shouldShowAnimation?: boolean;
}

const useRandomRectangles = (
  num: number = 10,
  rectangleWidth: number = 100,
  containerSize: number = 1476
): [Rectangle[], Dispatch<SetStateAction<Rectangle[]>>] => {
  // 随机生成 min - max 之间的整数
  const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const [rectangles, setRectangles] = useState<Rectangle[]>([]);

  useEffect(() => {
    console.log("generateRandomRectangles");
    generateRandomRectangles();
  }, []);

  const doesOverlap = (
    newRect: Rectangle,
    existingRects: Rectangle[]
  ): boolean => {
    return existingRects.some((rect) => {
      return (
        newRect.left < rect.left + rect.width &&
        newRect.left + newRect.width > rect.left &&
        newRect.top < rect.top + rect.height &&
        newRect.top + newRect.height > rect.top
      );
    });
  };

  const generateRandomRectangles = () => {
    const rectangles: Rectangle[] = [];
    while (rectangles.length < num) {
      const size = rectangleWidth;
      const newRect: Rectangle = {
        id: rectangles.length + 1,
        width: size,
        height: size,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        left: getRandomInt(0, containerSize - size),
        top: getRandomInt(0, containerSize - size),
        apiData:
          rectangles.length + 1 <= Math.floor(num / 2)
            ? { userId: String(rectangles.length + 1) }
            : { userId: "" },
      };

      if (!doesOverlap(newRect, rectangles)) {
        rectangles.push(newRect);
      }
    }
    setRectangles(rectangles);
  };

  return [rectangles, setRectangles] as [
    Rectangle[],
    Dispatch<SetStateAction<Rectangle[]>>
  ];
};

export default useRandomRectangles;
