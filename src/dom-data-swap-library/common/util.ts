export function calculateInitialTransform(
  containerWidth: number,
  containerHeight: number
) {
  const diagramWidth = 1476;
  const diagramHeight = 1476;
  const headerHeight = 56; // Height of the header
  const topPadding = 40; // Top padding
  const availableHeight = containerHeight - headerHeight - topPadding;

  const scale = Math.min(
    containerWidth / diagramWidth,
    availableHeight / diagramHeight
  );

  const scaledWidth = diagramWidth * scale;
  const scaledHeight = diagramHeight * scale;

  const x = (containerWidth - scaledWidth) / 2;
  const y = (availableHeight - scaledHeight) / 2 + topPadding;

  return { x, y, scale };
}
