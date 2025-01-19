import { ReactNode } from "react";

export type PieceProps = {
  location: Coord;
  pieceType: PieceType;
  image: string;
  alt: string;
};

export type Coord = [number, number];

export type PieceRecord = {
  type: PieceType;
  location: Coord;
};

export interface SquareProps {
  pieces: PieceRecord[];
  location: Coord;
  children: ReactNode;
}

export type State =
  | { pieceSelected: false }
  | {
      pieceSelected: true;
      isDraggedOver: boolean;
      isValidMove: boolean;
    };

export enum PieceTypeEnum {
  king = "king",
  pawn = "pawn",
}

export type PieceType = keyof typeof PieceTypeEnum;

export enum HoveredStateEnum {
  idle = "idle",
  validMove = "validMove",
  invalidMove = "invalidMove",
}

export type HoveredState = keyof typeof HoveredStateEnum;
