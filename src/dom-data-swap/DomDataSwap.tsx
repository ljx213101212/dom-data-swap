import React, { useEffect, useRef, useState } from "react";
import useRandomRectangles, { Rectangle } from "./useRandomRectangles";

interface DomDataSwapProps {
  rectangleNumber: number;
  containerSize: number;
}

const DomDataSwap: React.FC<DomDataSwapProps> = (props: DomDataSwapProps) => {
  //随机在生成10个矩形数据
  const [rectangles, setRectangles] = useRandomRectangles(
    props.rectangleNumber,
    props.containerSize
  ) as [Rectangle[], (rects: Rectangle[]) => void];

  const scrollRef = useRef<HTMLDivElement>(null);
  // 拖拽范围容器
  const containerRef = useRef<HTMLDivElement>(null);
  // 起始拖拽的DOM id （并非拖拽中的dummy DOM)
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // 被dummy DOM 所覆盖的DOM
  const [targetId, setTargetId] = useState<string | null>(null);
  // 起始拖拽点 到 dummyDOM 左上角的偏移量
  const offset = useRef({ x: 0, y: 0 });
  // 起始拖拽时生成的 dummyDOM
  const [dummyEl, setDummyEl] = useState<HTMLDivElement | null>(null);

  //测试数据
  const [dummyPosition, setDummyPosition] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });
  const [scrollPositon, setScrollPositon] = useState<{
    left: number;
    top: number;
  }>({ left: 0, top: 0 });

  useEffect(() => {
    const handleDocumentMouseUp = () => handleMouseUp(); // 小心闭包陷阱
    const handleDocumentMouseMove = (event: any) => {
      handleMouseMove(event); // 小心闭包陷阱
    };

    // 考虑到鼠标在容器之外的情况，需要监听全局的鼠标 抬起 和 移动事件.
    document.addEventListener("mouseup", handleDocumentMouseUp); // 松开鼠标 -> 取消或命中
    document.addEventListener("mousemove", handleDocumentMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
    };
  }); //解决闭包陷阱

  const haveIntersection = (r1: DOMRect, r2: DOMRect) => {
    return !(
      r2.x > r1.x + r1.width || //r2的左边界 在 r1的右边界 右侧
      r2.x + r2.width < r1.x || //r2的右边界 在 r1的左边界 左侧
      r2.y > r1.y + r1.height || //r2的上边界 在 r1的下边界 下方
      r2.y + r2.height < r1.y //r2的下边界 在 r1的上边界 上方
    );
  };

  const addIntersectionEffect = (el: HTMLDivElement) => {
    el.style.borderWidth = "3px";
  };

  const removeIntersectionEffect = (el: HTMLDivElement) => {
    el.style.borderWidth = "1px";
  };

  const resetEffect = () => {
    const container = containerRef.current;
    if (!container) return;
    //重置container的样式
    container.style.border = "1px solid black";

    //重置container 下面所有div 的样式
    const children = Array.from(container.children) as HTMLDivElement[];
    for (const item of children) {
      removeIntersectionEffect(item);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !scrollRef.current) return;

    // 重新点击并重置样式
    resetEffect();
    const original = event.currentTarget as HTMLDivElement;
    const id = original.id;
    const rect = original.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // 保存鼠标点击点到元素左上角的偏移量
    // 注意: event.clientX 只是到viewport, 需要加入scroll的偏移量,才能得到正确相对于页面最左上角的位置.
    offset.current = {
      x: event.clientX - rect.left + scrollRef.current.scrollLeft,
      y: event.clientY - rect.top + scrollRef.current.scrollTop,
    };

    // 创建一个dummy DOM 来模拟拖拽的效果
    const clone = original.cloneNode(true) as HTMLDivElement;

    clone.id = `${original.id}-clone`;
    clone.style.position = "absolute"; //相对于最近 包含块（container）

    clone.style.left = `${rect.left - containerRect.left}px`;
    clone.style.top = `${rect.top - containerRect.top}px`;
    clone.style.cursor = "grabbing";
    clone.style.pointerEvents = "none";

    // 把dummy DOM 插入到container中
    containerRef.current.appendChild(clone);

    // 记录当前拖拽的id
    // 记录当前拖拽的dummy DOM
    setDraggingId(id);
    setDummyEl(clone);

    // [测试数据]
    setDummyPosition({ left: clone.offsetLeft, top: clone.offsetTop });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // 不满足条件，不做处理
    if (
      draggingId === null ||
      !dummyEl ||
      !containerRef.current ||
      !scrollRef.current
    )
      return;

    const container = containerRef.current;
    const scroll = scrollRef.current;
    const containerRect = container.getBoundingClientRect();

    // 计算新的位置 (DOM 左上角) -> 相对于container
    let newX =
      event.clientX - containerRect.left - offset.current.x + scroll.scrollLeft;
    let newY =
      event.clientY - containerRect.top - offset.current.y + scroll.scrollTop;

    const dummyRect = new DOMRect(
      newX,
      newY,
      dummyEl.offsetWidth,
      dummyEl.offsetHeight
    );

    // 遍历container下所有的子元素(不包括dummy)
    const children = Array.from(container.children).filter(
      (child) => child !== dummyEl
    ) as HTMLDivElement[];

    let isOverlapping = false;
    for (const item of children) {
      if (item.id === draggingId) {
        // 跳过dummy
        continue;
      }

      const itemRect = new DOMRect(
        item.getBoundingClientRect().x + scroll.scrollLeft,
        item.getBoundingClientRect().y + scroll.scrollTop,
        item.offsetWidth,
        item.offsetHeight
      );

      //当前子元素 与 dummy DOM 是否碰撞
      if (haveIntersection(itemRect, dummyRect)) {
        addIntersectionEffect(item);
        setTargetId(item.id); //记录碰撞的子元素id
        isOverlapping = true;
      } else {
        removeIntersectionEffect(item);
      }
    }

    if (!isOverlapping) {
      // 没有碰撞的子元素 -> 重置碰撞的子元素id
      setTargetId(null);
    }

    // 检查 dummy 是否接触到 container 的边界
    const borderRect = container.getBoundingClientRect();
    const isTouchingRight =
      dummyRect.x - scroll.scrollLeft + dummyRect.width >=
      borderRect.x + borderRect.width;
    const isTouchingLeft = dummyRect.x - scroll.scrollLeft <= borderRect.x;
    const isTouchingTop = dummyRect.y - scroll.scrollTop <= borderRect.y;
    const isTouchingBottom =
      dummyRect.y - scroll.scrollTop + dummyRect.height >=
      borderRect.y + borderRect.height;

    if (isTouchingRight) {
      newX =
        borderRect.x + borderRect.width - dummyRect.width + scroll.scrollLeft; // 紧贴右边界
    }

    if (isTouchingLeft) {
      newX = borderRect.x + scroll.scrollLeft; // 紧贴左边界
    }

    if (isTouchingTop) {
      newY = borderRect.y + scroll.scrollTop; // 紧贴上边界
    }

    if (isTouchingBottom) {
      newY =
        borderRect.y + borderRect.height - dummyRect.height + scroll.scrollTop; // 紧贴下边界
    }

    // 移动dummy DOM
    dummyEl.style.left = `${newX}px`;
    dummyEl.style.top = `${newY}px`;

    if (
      isTouchingRight ||
      isTouchingLeft ||
      isTouchingTop ||
      isTouchingBottom
    ) {
      container.style.border = "3px solid red";
    } else {
      container.style.border = "1px solid black";
    }

    // [测试数据]
    setDummyPosition({ left: newX, top: newY });
    setScrollPositon({ left: scroll.scrollLeft, top: scroll.scrollTop });
  };

  // 松开鼠标 -> 取消或命中
  const handleMouseUp = () => {
    // 有拖动中的元素 且 有碰撞的元素
    if (draggingId !== null && targetId !== null) {
      // 交换元素内容 -> 交换apiData
      swapElementContent(String(draggingId), String(targetId));
    }
    // 移除dummy DOM
    if (dummyEl && containerRef.current) {
      containerRef.current.removeChild(dummyEl);
    }

    // 重置所有状态和样式
    setDummyEl(null);
    setDraggingId(null);
    setTargetId(null);
    resetEffect();

    // [测试数据]
    setDummyPosition({ left: 0, top: 0 });
  };

  // 交换元素内容 -> 交换apiData -> 重新渲染页面
  const swapElementContent = (id1: string, id2: string) => {
    const rect1 = rectangles.find((r) => r.id === Number(id1));
    const rect2 = rectangles.find((r) => r.id === Number(id2));
    if (!rect1 || !rect2) return;

    [rect1.apiData, rect2.apiData] = [rect2.apiData, rect1.apiData];
    setRectangles([...rectangles]); //重新渲染页面
  };

  return (
    <div ref={scrollRef} className="overflow-scroll h-screen w-screen">
      <div
        ref={containerRef}
        className={`relative border border-black overflow-hidden`}
        style={{
          width: `${props.containerSize}px`,
          height: `${props.containerSize}px`,
        }}
      >
        {rectangles.map((rect) => (
          <div
            id={String(rect.id)}
            key={rect.id}
            className={`absolute flex items-center justify-center font-bold rounded-md`}
            style={{
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              border: `1px solid ${rect.color}`,
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              cursor: "grab",
              userSelect: "none",
            }}
            onMouseDown={(event) => handleMouseDown(event)}
          >
            <div>
              <div className="text-center">{`id: ${rect.id}`}</div>
              <div className="text-center">{`${rect.apiData}`}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-5 right-0">
        <div>[测试数据]</div>
        <div>{"draggingId: " + draggingId}</div>
        <div>{"targetId: " + targetId}</div>
        <div>{"dummyEl Id: " + dummyEl?.id}</div>
        <div>{"dummyEl left: " + dummyPosition.left + "px"}</div>
        <div>{"dummyEl top: " + dummyPosition.top + "px"}</div>
        <div>{"scroll left: " + scrollPositon.left + "px"}</div>
        <div>{"scroll top: " + scrollPositon.top + "px"}</div>
      </div>
    </div>
  );
};

export default DomDataSwap;
