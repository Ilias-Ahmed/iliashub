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
 */
export function initSmoothScrolling(): Lenis | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  // Reuse existing instance if present
  if (window.__lenis) return window.__lenis;

  const lenis = new Lenis({
    // Tweak as needed
    duration: 1.2,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    syncTouch: true,
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

  const { offset = 0, behavior = "smooth" } = options;

  const lenis = window.__lenis;
  if (lenis) {
    // Lenis supports HTMLElement or number with options
    await lenis.scrollTo(target, { offset });
  } else {
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
