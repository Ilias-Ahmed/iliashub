import Lenis from "lenis";

export interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior; // 'smooth' | 'auto'
}

declare global {
  // Augment window to store a shared Lenis instance
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Initializes a single Lenis instance for smooth scrolling and stores it on window.__lenis.
 * If running in a non-DOM environment, returns null.
 * On mobile devices, Lenis is disabled for better native touch scrolling performance.
 */
export function initSmoothScrolling(): Lenis | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  // Detect mobile devices - disable Lenis for better touch scrolling
  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 768px)").matches;

  // Skip Lenis on mobile devices - use native scrolling instead
  if (isMobile) {
    return null;
  }

  // Reuse existing instance if present
  if (window.__lenis) return window.__lenis;

  const lenis = new Lenis({
    // Optimized settings for desktop only
    duration: 1.2,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    syncTouch: false, // Disabled for better performance
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  window.__lenis = lenis;
  return lenis;
}

/**
 * Scroll to a section by id using Lenis when available, or native scroll behavior as fallback.
 * On mobile, uses instant scrolling for better touch response.
 */
export async function scrollToSection(
  sectionId: string,
  options: ScrollOptions = {}
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  // Detect mobile for instant scrolling
  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 768px)").matches;

  const { offset = 0, behavior = isMobile ? "auto" : "smooth" } = options;

  const lenis = window.__lenis;
  if (lenis && !isMobile) {
    // Lenis supports HTMLElement or number with options (desktop only)
    await lenis.scrollTo(target, { offset });
  } else {
    // Native scrolling - instant on mobile, smooth on desktop
    const rect = target.getBoundingClientRect();
    const y = window.scrollY + rect.top + offset;
    window.scrollTo({ top: y, behavior });
  }
}

/**
 * Determine which section id is currently in view.
 * Returns the id with the closest top to the viewport top, preferring those on-screen.
 */
export function getCurrentSection(sectionIds: string[]): string | null {
  if (typeof document === "undefined") return null;

  let bestId: string | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();

    // Consider within viewport if at least partly visible
    const visible =
      rect.top < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.2;
    const score = Math.abs(rect.top); // distance from top of viewport

    if (visible && score < bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  // Fallback: choose the section whose top has passed the viewport top most recently
  if (!bestId) {
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) bestId = id; // header offset heuristic
    }
  }

  return bestId;
}
