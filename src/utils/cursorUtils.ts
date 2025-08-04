/**
 * Utility functions to ensure custom cursor is always visible
 * and system cursor is always hidden
 */

import React from "react";

/**
 * Force hide cursor on a specific element and its children
 */
export const hideCursorOnElement = (element: HTMLElement) => {
  if (!element) return;

  element.style.cursor = "none";

  // Also apply to all children
  const children = element.querySelectorAll("*");
  children.forEach((child) => {
    if (child instanceof HTMLElement) {
      child.style.cursor = "none";
    }
  });
};

/**
 * Add event listeners to force cursor none on mouse events
 */
export const addCursorHideListeners = (element: HTMLElement) => {
  if (!element) return;

  const forceNoCursor = () => {
    element.style.cursor = "none";
    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";
  };

  element.addEventListener("mouseenter", forceNoCursor);
  element.addEventListener("mouseover", forceNoCursor);
  element.addEventListener("mousemove", forceNoCursor);
  element.addEventListener("mousedown", forceNoCursor);
  element.addEventListener("mouseup", forceNoCursor);
  element.addEventListener("click", forceNoCursor);

  return () => {
    element.removeEventListener("mouseenter", forceNoCursor);
    element.removeEventListener("mouseover", forceNoCursor);
    element.removeEventListener("mousemove", forceNoCursor);
    element.removeEventListener("mousedown", forceNoCursor);
    element.removeEventListener("mouseup", forceNoCursor);
    element.removeEventListener("click", forceNoCursor);
  };
};

/**
 * React hook to ensure cursor is hidden on a ref element
 */
export const useCursorHide = (ref: React.RefObject<HTMLElement>) => {
  React.useEffect(() => {
    if (!ref.current) return;

    hideCursorOnElement(ref.current);
    const cleanup = addCursorHideListeners(ref.current);

    return cleanup;
  }, [ref]);
};

/**
 * Global function to override any cursor styles
 */
export const enforceCustomCursor = () => {
  // Force cursor none on document
  document.body.style.cursor = "none";
  document.documentElement.style.cursor = "none";

  // Override any inline styles
  const allElements = document.querySelectorAll("*");
  allElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.style.cursor = "none";
    }
  });

  // Add CSS override if not present
  if (!document.getElementById("cursor-force-override")) {
    const style = document.createElement("style");
    style.id = "cursor-force-override";
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }

      *:hover, *:focus, *:active, *:focus-visible {
        cursor: none !important;
      }

      /* Target specific elements that commonly override cursor */
      button, a, input, textarea, select, [onclick], [role="button"] {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Auto-run on page load
if (typeof window !== "undefined") {
  // Run immediately
  enforceCustomCursor();

  // Run on DOM content loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enforceCustomCursor);
  }

  // Run periodically to catch dynamically added elements
  setInterval(enforceCustomCursor, 1000);
}
