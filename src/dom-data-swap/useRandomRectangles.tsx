import { useEffect, useState } from "react";

export interface Rectangle {
  id: number;
  width: number;
  height: number;
  color: string;
  left: number;
  top: number;
  apiData?: string; //需要替换的数据
}

const useRandomRectangles = (num: number = 10) => {
  // 随机生成 min - max 之间的整数
  const getRandomInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const containerSize = 1476;

  useEffect(() => {
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
      const size = 100;
      const newRect: Rectangle = {
        id: rectangles.length + 1,
        width: size,
        height: size,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        left: getRandomInt(0, containerSize - size),
        top: getRandomInt(0, containerSize - size),
        apiData: `Item ${rectangles.length + 1}`,
      };

      if (!doesOverlap(newRect, rectangles)) {
        rectangles.push(newRect);
      }
    }
    setRectangles(rectangles);
  };

  return [rectangles, setRectangles];
};

export default useRandomRectangles;
