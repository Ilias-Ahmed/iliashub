import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef, useState } from "react";

export interface SmoothCursorProps {
  enabled?: boolean;
}

export function SmoothCursor({ enabled = true }: SmoothCursorProps) {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | undefined>(undefined);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    const checkTouch = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasPointer = window.matchMedia("(pointer: fine)").matches;
      setIsTouchDevice(hasTouch && !hasPointer);
    };

    checkTouch();
  }, []);

  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;
    if (!dot || !outline) return;

    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      // Smooth following effect
      const dotSpeed = 0.2;
      const outlineSpeed = 0.12;

      dotX += (currentX - dotX) * dotSpeed;
      dotY += (currentY - dotY) * dotSpeed;
      outlineX += (currentX - outlineX) * outlineSpeed;
      outlineY += (currentY - outlineY) * outlineSpeed;

      // Apply transforms
      dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      outline.style.transform = `translate(${outlineX - 20}px, ${
        outlineY - 20
      }px)`;

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
      positionRef.current = { x: e.clientX, y: e.clientY };

      if (!isVisible) {
        setIsVisible(true);
      }

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        'a, button, input, textarea, select, [role="button"], [onclick]'
      );
      setIsPointer(!!isInteractive);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      if (dot && outline) {
        dot.style.transform += " scale(0.8)";
        outline.style.transform += " scale(1.3)";
      }
    };

    const handleMouseUp = () => {
      if (dot && outline) {
        dot.style.transform = dot.style.transform.replace(" scale(0.8)", "");
        outline.style.transform = outline.style.transform.replace(
          " scale(1.3)",
          ""
        );
      }
    };

    // Hide default cursor
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(style);

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      // Cleanup
      document.body.style.cursor = "";
      style.remove();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled, isTouchDevice, isVisible]);

  if (!enabled || isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* Cursor Dot */}
      <div
        ref={cursorDotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          backgroundColor: accentColors.primary,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          transition: "opacity 0.3s ease, transform 0.15s ease",
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
        }}
      />

      {/* Cursor Outline */}
      <div
        ref={cursorOutlineRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          border: `2px solid ${accentColors.primary}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transition:
            "opacity 0.3s ease, width 0.2s ease, height 0.2s ease, transform 0.15s ease",
          opacity: isVisible ? 0.5 : 0,
          ...(isPointer && {
            width: "60px",
            height: "60px",
            opacity: 0.3,
          }),
          willChange: "transform",
        }}
      />
    </>
  );
}
