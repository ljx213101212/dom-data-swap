export enum DragStateEnum {
  idle = "idle",
  draggingNoHover = "draggingNoHover",
  draggingHoverDisallowed = "draggingHoverDisallowed",
  draggingHoverAllowed = "draggingHover",

  droppingNoSwap = "droppingNoSwap",
  droppingSwap = "droppingSwap",
}

export type DragState = keyof typeof DragStateEnum;

export type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "is-dragging" }
  | { type: "is-over" };
