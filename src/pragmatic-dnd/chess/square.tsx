/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { css, jsx } from "@emotion/react";
import { memo, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { canMove, isCoord, isPieceType } from "./util";
import type { HoveredState, SquareProps } from "../typesRuntime";

const Square = memo(({ pieces, location, children }: SquareProps) => {
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      onDragEnter: ({ source }) => {
        // console.log("onDragEnter", source.data.location, location, pieces);
        // source is the piece being dragged over the drop target
        if (
          // type guards
          !isCoord(source.data.location) ||
          !isPieceType(source.data.pieceType)
        ) {
          return;
        }

        if (
          canMove(source.data.location, location, source.data.pieceType, pieces)
        ) {
          setState("validMove");
        } else {
          console.log(
            "onDragEnter - invalidMove",
            source.data.location,
            location
          );
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, [location, pieces]);

  const isDark = (location[0] + location[1]) % 2 === 1;

  //export const isEqualCoord = (c1: coord, c2: coord): boolean => c1[0] === c2[0] && c1[1] === c2[1];

  return (
    <div
      id={`square-${location[0]}-${location[1]}`}
      key={`${location[0]}-${location[1]}`}
      css={squareStyles}
      style={{ backgroundColor: getColor(state, isDark) }}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default Square;

const squareStyles = css({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

// const getColor = (state: State, isDark: boolean): string => {
//   if (state.pieceSelected && state.isValidMove && state.isDraggedOver) {
//     return "lightgreen";
//   }
//   if (state.pieceSelected && !state.isValidMove && state.isDraggedOver) {
//     return "pink";
//   }

//   return isDark ? "lightgrey" : "white";
// };

function getColor(state: HoveredState, isDark: boolean): string {
  if (state === "validMove") {
    return "lightgreen";
  } else if (state === "invalidMove") {
    return "pink";
  }
  return isDark ? "lightgrey" : "white";
}
