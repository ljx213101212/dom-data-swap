import React, { Component, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";

import boardImage from "@/dom-data-swap-library/common/icons/board.svg";
import Draggable from "./components/pragmatic/Draggable";
import { Layout, Spin } from "antd";
import Droppable from "./components/pragmatic/Droppable";
import { DndProvider, useDndContext } from "./DndContext";
import ZoomControls from "../common/zoom/Control";
import useContainerDimensionsOnResize from "../common/hook/useContainerDimensionsOnResize";
import { calculateInitialTransform } from "../common/util";

const App = () => {
  const { isHoverOnDraggable, setScale, scale } = useDndContext();
  const [pageStatus, setPageStatus] = useState<boolean>(false);
  const { containerRef, containerWidth, containerHeight } =
    useContainerDimensionsOnResize();
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>(null);

  const {
    x: initialX,
    y: initialY,
    scale: initialScale,
  } = calculateInitialTransform(
    containerWidth,
    containerHeight,
    1476,
    1476,
    0,
    0
  );

  console.log("isHoverOnDraggable changed", isHoverOnDraggable);

  useEffect(() => {
    if (containerWidth && containerHeight) {
      setPageStatus(true);
      setScale(initialScale);
    }
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  }, [containerWidth, containerHeight]);

  // console.log(
  //   "Initial",
  //   initialX,
  //   initialY,
  //   initialScale,
  //   containerWidth,
  //   containerHeight
  // );
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
              ref={transformComponentRef}
              initialScale={1}
              minScale={0.2}
              maxScale={2}
              initialPositionX={initialX}
              initialPositionY={initialY}
              doubleClick={{ disabled: true }}
              wheel={{ wheelDisabled: true }}
              smooth={true}
              zoomAnimation={{ animationType: "easeOut" }}
              limitToBounds={false}
              disabled={false}
              panning={{ allowLeftClickPan: !isHoverOnDraggable }}
              onTransformed={(transform) => {
                console.log("onTransformed", transform);
                setScale(transform.state.scale);
              }}
            >
              <Spin spinning={false} size="large" className="!max-h-full">
                <TransformComponent
                  wrapperStyle={{
                    // width: "1476px",
                    width: `${containerWidth}px`,
                    height: `${containerHeight}px`,
                    // maxHeight: "calc(100svh - (56px + 40px))", // header + padding-top
                    overflow: "visible",
                  }}
                >
                  <div className="relative">
                    <div>Scale: ${scale}</div>
                    <img
                      src={boardImage}
                      alt="board"
                      className="size-full"
                      loading="lazy"
                    />

                    <Droppable id={"1"}>
                      <Draggable id={"1-1"} />
                    </Droppable>
                  </div>
                </TransformComponent>
              </Spin>
            </TransformWrapper>
          ) : null}
        </div>
      </Layout.Content>

      {pageStatus ? (
        <Layout.Sider
          width={100}
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
};

export default App;
