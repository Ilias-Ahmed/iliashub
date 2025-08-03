import { useEffect, useRef } from "react";

export const usePerformanceMonitor = (
  componentName: string,
  enabled = false
) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = performance.now();
    const currentRenderCount = ++renderCount.current;

    return () => {
      const renderTime = performance.now() - renderStartTime.current;

      // Log performance metrics only in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[Performance] ${componentName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: currentRenderCount,
          memoryUsage: getMemoryUsage(),
        });

        // Warn about slow renders
        if (renderTime > 16.67) {
          // 60fps threshold
          console.warn(
            `[Performance Warning] ${componentName} took ${renderTime.toFixed(
              2
            )}ms to render`
          );
        }
      }
    };
  });

  const markPerformance = (label: string) => {
    if (enabled && process.env.NODE_ENV === "development") {
      performance.mark(`${componentName}-${label}`);
    }
  };

  const measurePerformance = (startLabel: string, endLabel: string) => {
    if (enabled && process.env.NODE_ENV === "development") {
      const measureName = `${componentName}-${startLabel}-to-${endLabel}`;
      performance.measure(
        measureName,
        `${componentName}-${startLabel}`,
        `${componentName}-${endLabel}`
      );

      const measure = performance.getEntriesByName(measureName)[0];
      console.log(
        `[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`
      );
    }
  };

  return { markPerformance, measurePerformance };
};

const getMemoryUsage = (): string => {
  if ("memory" in performance) {
    interface MemoryInfo {
      usedJSHeapSize: number;
    }
    const memory = (performance as Performance & { memory: MemoryInfo }).memory;
    return `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`;
  }
  return "N/A";
};

export default usePerformanceMonitor;
