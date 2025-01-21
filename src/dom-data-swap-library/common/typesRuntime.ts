export enum DragStateEnum {
  idle = "idle",
  draggingNoHover = "draggingNoHover",
  draggingHoverDisallowed = "draggingHoverDisallowed",
  draggingHoverAllowed = "draggingHover",

  droppingNoSwap = "droppingNoSwap",
  droppingSwap = "droppingSwap",
}

export type DragState = keyof typeof DragStateEnum;
