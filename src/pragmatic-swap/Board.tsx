import {
  ReactZoomPanPinchContentRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import useContainerDimensionsOnResize from "@/pragmatic-swap/hook/useContainerDimensionsOnResize";
import { useEffect, useRef, useState } from "react";
import { Layout, Spin } from "antd";

import boardImage from "@/pragmatic-swap/icons/board.svg";
import useRandomRectangles, {
  ApiData,
  Rectangle,
} from "@/pragmatic-swap/hook/useRandomRectangles";
import DraggableItem, { DraggableItemData } from "./item/DraggableItem";
import DraggableItemContainer from "./item/DraggableItemContainer";
import { calculateInitialTransform } from "./util";
import ZoomControls from "./zoom/Control";
import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export const ItemWidth = 100;
export default function Board() {
  const { containerRef, containerWidth, containerHeight } =
    useContainerDimensionsOnResize();
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>(null);

  const { x, y, scale } = calculateInitialTransform(
    containerWidth,
    containerHeight
  );

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

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }

        // 1) Get the unique ID from source and destination
        const sourceId = (source.data as unknown as DraggableItemData).rect.id;
        const destId = (destination.data as unknown as DraggableItemData).rect
          .id;
        if (sourceId == null || destId == null) {
          return;
        }

        // 2) Swap in state immutably
        setRectangles((prevRects) => {
          // Make a shallow copy of the array
          const newRects = [...prevRects];

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
          };

          newRects[destIndex] = {
            ...destRect,
            apiData: sourceRect.apiData, // 注意需要复制apiData, 不然memo会认为数据没有变化
          };

          return newRects;
        });
      },
    });
  }, [rectangles]);

  console.log("debug:", rectangles);

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
              initialScale={scale}
              minScale={scale * 0.5}
              maxScale={2}
              ref={transformComponentRef}
              doubleClick={{ disabled: true }}
              wheel={{ step: 2 }}
              smooth={true}
              zoomAnimation={{ animationType: "easeOut" }}
              limitToBounds={false}
              alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
              disabled={true}
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
                    {rectangles?.map((rect) => (
                      <DraggableItemContainer
                        id={String(rect.id)}
                        key={rect.id}
                        rect={rect}
                      >
                        {rect.apiData?.userId ? (
                          <DraggableItem
                            id={String(rect.id)}
                            key={rect.id}
                            rect={rect}
                          />
                        ) : null}
                      </DraggableItemContainer>
                    ))}
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

      {/* {containerWidth && containerHeight ? (
        <ZoomControls
          className="static"
          //   zoomIn={transformComponentRef?.current?.zoomIn ?? (() => {})}
          //   zoomOut={transformComponentRef?.current?.zoomOut ?? (() => {})}
          //   resetTransform={
          //     transformComponentRef?.current?.resetTransform ?? (() => {})
          //   }
        />
      ) : null} */}
    </Layout>
  );
}
