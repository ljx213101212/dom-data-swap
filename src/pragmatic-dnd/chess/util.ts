import type { Coord, PieceRecord, PieceType } from "../typesRuntime";

export const pieceTypes: PieceType[] = ["king", "pawn"];

export const isPieceType = (value: unknown): value is PieceType =>
  typeof value === "string" && pieceTypes.includes(value as PieceType);

export const isCoord = (coord: unknown): coord is Coord => {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    coord.every((val) => typeof val === "number")
  );
};

export const isEqualCoord = (c1: Coord, c2: Coord): boolean =>
  c1[0] === c2[0] && c1[1] === c2[1];

export const canMove = (
  start: Coord,
  destination: Coord,
  pieceType: PieceType,
  pieces: PieceRecord[]
) => {
  const rowDist = Math.abs(start[0] - destination[0]);
  const colDist = Math.abs(start[1] - destination[1]);

  if (pieces.find((piece) => isEqualCoord(piece.location, destination))) {
    return false;
  }

  switch (pieceType) {
    case "king":
      return [0, 1].includes(rowDist) && [0, 1].includes(colDist);
    case "pawn":
      return colDist === 0 && start[0] - destination[0] === -1;
    default:
      return false;
  }
};
