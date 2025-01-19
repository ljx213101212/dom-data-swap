/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { memo, useEffect, useRef, useState } from "react";

import { css, jsx } from "@emotion/react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import type { PieceProps } from "../typesRuntime";

const Piece = memo(({ image, alt, location, pieceType }: PieceProps) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);
    return draggable({
      element: el,
      getInitialData: () => ({ type: "grid-item", location, pieceType }),
      onDragStart: () => setDragging(true), // NEW
      onDrop: () => setDragging(false), // NEW
    });
  }, [location, pieceType]);

  // console.log("TEST: ", image, alt, location, pieceType);

  return (
    <img
      id={`${pieceType}-${location[0]}-${location[1]}`}
      css={imageStyles}
      style={dragging ? { opacity: 0.4 } : {}}
      src={image}
      alt={alt}
      ref={ref}
    />
  );
});

export function King(props: PieceProps) {
  return (
    <Piece
      location={props.location}
      image={props.image}
      alt={props.alt}
      pieceType={props.pieceType}
    />
  );
}

export function Pawn(props: PieceProps) {
  return (
    <Piece
      location={props.location}
      image={props.image}
      alt={props.alt}
      pieceType={props.pieceType}
    />
  );
}

const imageStyles = css({
  width: 45,
  height: 45,
  padding: 4,
  borderRadius: 6,
  boxShadow:
    "1px 3px 3px rgba(9, 30, 66, 0.25),0px 0px 1px rgba(9, 30, 66, 0.31)",
  "&:hover": {
    backgroundColor: "rgba(168, 168, 168, 0.25)",
  },
});
