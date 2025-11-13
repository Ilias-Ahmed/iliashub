import { useTheme } from "@/contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

const MIN_VISIBLE_MS = 600;

const LoadingScreen = ({
  onLoadingComplete,
  duration = 1200,
}: LoadingScreenProps) => {
  const { getAccentColors } = useTheme();
  const accentColors = useMemo(() => getAccentColors(), [getAccentColors]);

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const safeDuration = Math.max(duration, 400);

    const step = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }

      const elapsed = timestamp - startRef.current;
      const nextProgress = Math.min(elapsed / safeDuration, 1);

      setProgress(nextProgress);

      if (nextProgress < 1) {
        frameRef.current = window.requestAnimationFrame(step);
        return;
      }

      if (finishedRef.current) {
        return;
      }

      finishedRef.current = true;
      const holdFor = Math.max(MIN_VISIBLE_MS - elapsed, 0) + 160;

      completionTimeoutRef.current = window.setTimeout(() => {
        setVisible(false);
        onLoadingComplete?.();
      }, holdFor);
    };

    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      if (completionTimeoutRef.current !== null) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }

      finishedRef.current = false;
      startRef.current = null;
    };
  }, [duration, onLoadingComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-2 border-muted opacity-50" />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: accentColors.primary }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="h-1 w-32 overflow-hidden rounded-full bg-muted/40">
              <motion.div
                className="h-full origin-left"
                style={{
                  background: accentColors.gradient ?? accentColors.primary,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>

            <span className="text-xs font-medium text-muted-foreground">
              {Math.round(progress * 100)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
