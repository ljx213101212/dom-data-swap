/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState, type ReactElement } from "react";

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from "@emotion/react";

import { King, Pawn } from "@/pragmatic-dnd/chess/pieces";
import Square from "./chess/square";

import king from "@/pragmatic-dnd/icons/king.png";
import pawn from "@/pragmatic-dnd/icons/pawn.png";
import type { Coord, PieceRecord, PieceType } from "./typesRuntime";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { canMove, isCoord, isPieceType } from "./chess/util";

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
  return c1[0] === c2[0] && c1[1] === c2[1];
}

export const pieceLookup: {
  [Key in PieceType]: (location: Coord) => ReactElement;
} = {
  king: (location) => (
    <King location={location} pieceType={"king"} image={king} alt={"King"} />
  ),
  pawn: (location) => (
    <Pawn location={location} pieceType={"pawn"} image={pawn} alt={"Pawn"} />
  ),
};

function renderSquares(pieces: PieceRecord[]) {
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareCoord: Coord = [row, col];

      const piece = pieces.find((piece) =>
        isEqualCoord(piece.location, squareCoord)
      );
      squares.push(
        <Square key={`${row}-${col}`} pieces={pieces} location={squareCoord}>
          {piece && pieceLookup[piece.type](piece.location)}
        </Square>
      );
    }
  }
  return squares;
}

function Chessboard() {
  const [pieces, setPieces] = useState<PieceRecord[]>([
    { type: "king", location: [3, 2] },
    { type: "pawn", location: [1, 6] },
  ]);
  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }
        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;
        const pieceType = source.data.pieceType;

        // console.log(
        //   "monitorForElements",
        //   destination,
        //   sourceLocation,
        //   pieceType
        // );

        if (
          // type guarding
          !isCoord(destinationLocation) ||
          !isCoord(sourceLocation) ||
          !isPieceType(pieceType)
        ) {
          return;
        }

        const piece = pieces.find((p) =>
          isEqualCoord(p.location, sourceLocation)
        );
        const restOfPieces = pieces.filter((p) => p !== piece);

        if (
          canMove(sourceLocation, destinationLocation, pieceType, pieces) &&
          piece !== undefined
        ) {
          // moving the piece!
          setPieces([
            { type: piece.type, location: destinationLocation },
            ...restOfPieces,
          ]);
        }
      },
    });
  }, [pieces]);

  //   console.log("current pieces", pieces);

  return <div css={chessboardStyles}>{renderSquares(pieces)}</div>;
}

const chessboardStyles = css({
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gridTemplateRows: "repeat(8, 1fr)",
  width: "500px",
  height: "500px",
  border: "3px solid lightgrey",
});

const squareStyles = css({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default Chessboard;
