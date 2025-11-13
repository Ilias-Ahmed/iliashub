"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { motion, useSpring } from "motion/react";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
  enabled?: boolean;
}

const CURSOR_OVERRIDE_ID = "custom-cursor-override";

const DefaultCursor = ({ color }: { color: string }) => {
  const translucentColor = `${color}33`;
  return (
    <div
      style={{
        position: "relative",
        width: "24px",
        height: "24px",
        mixBlendMode: "difference",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          border: `1.5px solid ${color}`,
          backgroundColor: "transparent",
          boxShadow: `0 0 10px ${translucentColor}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "6px",
          borderRadius: "9999px",
          backgroundColor: color,
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export function SmoothCursor({
  cursor,
  springConfig = {
    damping: 32,
    stiffness: 320,
    mass: 0.6,
    restDelta: 0.001,
  },
  enabled = true,
}: SmoothCursorProps) {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const cursorContent = useMemo(
    () => cursor ?? <DefaultCursor color={accentColors.primary} />,
    [cursor, accentColors.primary]
  );

  const [motionAllowed, setMotionAllowed] = useState(true);
  const [pointerSupported, setPointerSupported] = useState(true);
  const rafIdRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const scale = useSpring(0.6, { damping: 20, stiffness: 250 });
  const opacity = useSpring(0, { damping: 30, stiffness: 200 });

  const removeCursorOverride = useCallback(() => {
    if (typeof document === "undefined") return;

    document.body.style.cursor = "";
    document.documentElement.style.cursor = "";
    const existingStyle = document.getElementById(CURSOR_OVERRIDE_ID);
    if (existingStyle) {
      existingStyle.remove();
    }
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      opacity.set(0);
      scale.set(0.6);
    }, 1400);
  }, [opacity, scale]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionAllowed = () => setMotionAllowed(!mediaQuery.matches);

    updateMotionAllowed();
    mediaQuery.addEventListener("change", updateMotionAllowed);

    return () => mediaQuery.removeEventListener("change", updateMotionAllowed);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const anyFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    const touchPoints = navigator.maxTouchPoints ?? 0;
    const touchOnly = !finePointer && !anyFinePointer && touchPoints > 0;

    setPointerSupported(!touchOnly && (finePointer || anyFinePointer));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!pointerSupported) {
      removeCursorOverride();
      return;
    }

    if (!enabled || !motionAllowed) {
      removeCursorOverride();
      return;
    }

    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    if (!document.getElementById(CURSOR_OVERRIDE_ID)) {
      const style = document.createElement("style");
      style.id = CURSOR_OVERRIDE_ID;
      style.textContent = `
        *, *:hover, *:focus, *:active {
          cursor: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const handlePointerMove = (event: PointerEvent | MouseEvent) => {
      if (rafIdRef.current !== null) return;

      const { clientX, clientY } = event;
      rafIdRef.current = window.requestAnimationFrame(() => {
        cursorX.set(clientX);
        cursorY.set(clientY);
        opacity.set(0.95);
        scale.set(1);
        scheduleHide();
        rafIdRef.current = null;
      });
    };

    const handlePointerDown = () => {
      opacity.set(1);
      scale.set(0.85);
      scheduleHide();
    };

    const handlePointerUp = () => {
      scale.set(1.05);
      scheduleHide();
    };

    const handlePointerLeave = () => {
      opacity.set(0);
      scale.set(0.6);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("mousedown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, {
      passive: true,
    });
    window.addEventListener("mouseup", handlePointerUp, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("mouseleave", handlePointerLeave);

    scheduleHide();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("mouseleave", handlePointerLeave);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      removeCursorOverride();
    };
  }, [
    enabled,
    motionAllowed,
    cursorX,
    cursorY,
    opacity,
    scheduleHide,
    removeCursorOverride,
    scale,
    pointerSupported,
  ]);

  if (!enabled || !motionAllowed || !pointerSupported) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 100,
        pointerEvents: "none",
        willChange: "transform, opacity",
        scale,
        opacity,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
    >
      {cursorContent}
    </motion.div>
  );
}
