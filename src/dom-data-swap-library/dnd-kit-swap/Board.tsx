import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import useContainerDimensionsOnResize from "@/dom-data-swap-library/common/hook/useContainerDimensionsOnResize";
import { useEffect, useRef, useState } from "react";
import { Layout, Spin } from "antd";

import boardImage from "@/dom-data-swap-library/common/icons/board.svg";
import useRandomRectangles, {
  ApiData,
  Rectangle,
} from "@/dom-data-swap-library/common/hook/useRandomRectangles";
import Draggable, { DraggableItemData } from "./item/Draggable";
import Droppable from "./item/Droppable";
import { calculateInitialTransform } from "../common/util";
import ZoomControls from "../common/zoom/Control";
import { DndContext, DragStartEvent, rectIntersection } from "@dnd-kit/core";

export const ItemWidth = 100;
export default function Board() {
  const { containerRef, containerWidth, containerHeight } =
    useContainerDimensionsOnResize();

  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>(null);

  const [zoomScale, setZoomScale] = useState(1);

  const {
    x,
    y,
    scale: initialScale,
  } = calculateInitialTransform(containerWidth, containerHeight);

  //随机在生成20个矩形数据
  const [rectangles, setRectangles] = useRandomRectangles(4, ItemWidth, 1476);

  const [pageStatus, setPageStatus] = useState<boolean>(false);

  useEffect(() => {
    if (containerWidth && containerHeight) {
      setPageStatus(true);
    }
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  }, [containerWidth, containerHeight]);

  const handleDragEnd = ({ active: source, over }: any) => {
    const destination = over;
    if (!destination) {
      // if dropped outside of any drop targets
      return;
    }

    // 1) Get the unique ID from source and destination
    const sourceId = (source.data.current as unknown as DraggableItemData).rect
      .id;
    const destId = (destination.data.current as unknown as DraggableItemData)
      .rect.id;
    if (sourceId == null || destId == null || sourceId === destId) {
      return;
    }

    // 2) Swap in state immutably
    setRectangles((prevRects) => {
      // Make a shallow copy of the array, reset shouldShowAnimation
      const newRects = prevRects.map((pr) => ({
        ...pr,
        shouldShowAnimation: false,
      }));

      // Find source/destination indexes by ID
      const sourceIndex = newRects.findIndex((r) => r.id === sourceId);
      const destIndex = newRects.findIndex((r) => r.id === destId);
      if (sourceIndex < 0 || destIndex < 0) {
        return prevRects; // no swap if either is missing
      }

      const sourceRect = newRects[sourceIndex];
      const destRect = newRects[destIndex];

      newRects[sourceIndex] = {
        ...sourceRect,
        apiData: destRect.apiData, // 注意需要复制apiData, 不然memo会认为数据没有变化
        shouldShowAnimation: false,
      };

      newRects[destIndex] = {
        ...destRect,
        apiData: sourceRect.apiData, // 注意需要复制apiData, 不然memo会认为数据没有变化
        shouldShowAnimation: true,
      };

      return newRects;
    });
  };

  const handleOnStart = (event: DragStartEvent) => {
    console.log("handleOnStart", event.activatorEvent.target);
    if (event.activatorEvent.target) {
      //set event.activatorEvent.target zindex 50px
      (event.activatorEvent.target as HTMLElement).style.zIndex = "9999";
    }
    cancelAnimation();
  };

  const cancelAnimation = () => {
    setRectangles((prevRects) => {
      return prevRects.map((pr) => ({
        ...pr,
        shouldShowAnimation: false,
      }));
    });
  };

  const handleTransform = (
    ref: ReactZoomPanPinchRef,
    state: {
      scale: number;
      positionX: number;
      positionY: number;
    }
  ) => {
    setZoomScale(state.scale);
  };

  return (
    <Layout>
      <Layout.Content className="flex justify-center h-screen">
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            maxWidth: "1476px",
          }}
        >
          {containerWidth && containerHeight ? (
            <TransformWrapper
              initialPositionX={x}
              initialPositionY={y}
              initialScale={initialScale}
              minScale={initialScale * 0.5}
              maxScale={2}
              ref={transformComponentRef}
              doubleClick={{ disabled: true }}
              wheel={{ step: 2 }}
              smooth={true}
              zoomAnimation={{ animationType: "easeOut" }}
              limitToBounds={false}
              alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
              disabled={true}
              onTransformed={handleTransform}
            >
              <Spin spinning={false} size="large" className="!max-h-full">
                <TransformComponent
                  wrapperStyle={{
                    width: "1476px",
                    maxHeight: "calc(100svh - (56px + 40px))", // header + padding-top
                    overflow: "visible",
                  }}
                >
                  <div className="relative">
                    <img
                      src={boardImage}
                      alt="board"
                      className="size-full"
                      loading="lazy"
                    />
                    <DndContext
                      collisionDetection={rectIntersection}
                      onDragEnd={handleDragEnd}
                      onDragStart={handleOnStart}
                    >
                      {rectangles?.map((rect) => (
                        <Droppable
                          id={String(rect.id)}
                          key={rect.id}
                          rect={rect}
                        >
                          {rect.apiData?.userId ? (
                            <Draggable
                              id={String(rect.id)}
                              key={rect.id}
                              rect={rect}
                              scale={zoomScale}
                            />
                          ) : null}
                        </Droppable>
                      ))}
                    </DndContext>
                  </div>
                </TransformComponent>
              </Spin>
            </TransformWrapper>
          ) : null}
        </div>
      </Layout.Content>

      {pageStatus ? (
        <Layout.Sider
          width={355}
          theme="light"
          className="relative !bg-transparent pb-0 pl-5 [&_.ant-card-body]:pt-[20px]"
        >
          <ZoomControls
            className="fixed bottom-5 right-5"
            zoomIn={transformComponentRef?.current?.zoomIn}
            zoomOut={transformComponentRef?.current?.zoomOut}
            resetTransform={transformComponentRef?.current?.resetTransform}
          />
        </Layout.Sider>
      ) : null}
    </Layout>
  );
}
