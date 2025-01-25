import React, { Component, useRef, useState } from "react";
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

const App = () => {
  const { isHoverOnDraggable } = useDndContext();
  const [pageStatus, setPageStatus] = useState<boolean>(false);
  const { containerRef, containerWidth, containerHeight } =
    useContainerDimensionsOnResize();
  const transformComponentRef = useRef<ReactZoomPanPinchContentRef>(null);

  console.log("isHoverOnDraggable changed", isHoverOnDraggable);
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
          <TransformWrapper
            initialScale={0.5}
            minScale={0.5}
            maxScale={1}
            initialPositionX={200}
            initialPositionY={100}
            doubleClick={{ disabled: true }}
            wheel={{ wheelDisabled: true }}
            smooth={true}
            zoomAnimation={{ animationType: "easeOut" }}
            limitToBounds={false}
            disabled={false}
            panning={{ allowLeftClickPan: !isHoverOnDraggable }}
          >
            <Spin spinning={false} size="large" className="!max-h-full">
              <TransformComponent
                wrapperStyle={{
                  width: "1476px",
                  maxHeight: "calc(100svh - (56px + 40px))", // header + padding-top
                  overflow: "visible",
                }}
              >
                <div className="myWrapper relative">
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
};

export default App;
