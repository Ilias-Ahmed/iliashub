/**
 * Performance optimization utilities
 */

// Throttle function for limiting function calls
export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Debounce function for delaying function calls
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Optimized requestAnimationFrame with throttling
export const throttledAnimationFrame = (
  callback: () => void,
  targetFPS: number = 60
) => {
  let lastTime = 0;
  const interval = 1000 / targetFPS;

  const animate = (currentTime: number) => {
    if (currentTime - lastTime >= interval) {
      callback();
      lastTime = currentTime;
    }
    requestAnimationFrame(animate);
  };

  return requestAnimationFrame(animate);
};

// Check if device is low-end
export const isLowEndDevice = (): boolean => {
  // Check available cores
  const cores = navigator.hardwareConcurrency || 1;
  if (cores < 4) return true;

  // Check memory if available
  if ("memory" in performance) {
    const memory = (
      performance as Performance & {
        memory: { jsHeapSizeLimit: number };
      }
    ).memory;
    if (memory.jsHeapSizeLimit < 50 * 1024 * 1024) return true; // Less than 50MB
  }

  // Check device pixel ratio
  if (window.devicePixelRatio < 1.5) return true;

  // Check if mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  if (isMobile) return true;

  return false;
};

// Intersection Observer helper for animation triggers
export const createVisibilityObserver = (
  callback: (isVisible: boolean) => void,
  options: IntersectionObserverInit = { threshold: 0.1 }
) => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.isIntersecting);
    });
  }, options);
};

// Animation frame manager for better control
export class AnimationManager {
  private animationId: number | null = null;
  private isRunning = false;
  private callbacks: (() => void)[] = [];
  private targetFPS = 60;
  private lastTime = 0;

  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    const interval = 1000 / this.targetFPS;

    const animate = (currentTime: number) => {
      if (!this.isRunning) return;

      if (currentTime - this.lastTime >= interval) {
        this.callbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            console.error("Animation callback error:", error);
          }
        });
        this.lastTime = currentTime;
      }

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  addCallback(callback: () => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  isActive() {
    return this.isRunning;
  }

  setFPS(fps: number) {
    this.targetFPS = fps;
  }
}

// Memory cleanup helper
export const cleanupMemory = () => {
  // Force garbage collection if available (development only)
  if (
    process.env.NODE_ENV === "development" &&
    (window as Window & { gc?: () => void }).gc
  ) {
    (window as Window & { gc: () => void }).gc();
  }
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }
};
