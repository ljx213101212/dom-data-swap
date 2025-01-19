import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

// get container dimensions when user resize the window
function useContainerDimensionsOnResize() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setContainerDimensions((prevDimensions) => {
      if (
        prevDimensions.width === rect.width &&
        prevDimensions.height === rect.height
      ) {
        return prevDimensions;
      }
      return { width: rect.width, height: rect.height };
    });
  }, []);

  const debouncedHandleResize = useDebouncedCallback(handleResize, 100);

  useLayoutEffect(() => {
    debouncedHandleResize();
    const resizeObserver = new ResizeObserver(debouncedHandleResize);
    const currentContainer = containerRef?.current;

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, [debouncedHandleResize]);

  return {
    containerRef,
    containerWidth: containerDimensions.width,
    containerHeight: containerDimensions.height,
  };
}

export default useContainerDimensionsOnResize;
