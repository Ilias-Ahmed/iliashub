import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { motion, MotionProps, useScroll } from "framer-motion";
import { useEffect, useState } from "react";

interface ScrollProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  progress?: number;
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  progress,
  className,
  ...props
}) => {
  const { scrollYProgress } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [visible, setVisible] = useState(false);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  useEffect(() => {
    if (progress !== undefined) {
      return;
    }

    let ticking = false;
    const lastValues = { percent: -1, visible: false };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const current = window.scrollY;
        const percent = height > 0 ? Math.round((current / height) * 100) : 0;
        const vis = current > 100;

        if (percent !== lastValues.percent) {
          lastValues.percent = percent;
          setScrollPercentage(percent);
        }
        if (vis !== lastValues.visible) {
          lastValues.visible = vis;
          setVisible(vis);
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [progress]);

  // If progress is provided externally, use it
  useEffect(() => {
    if (progress === undefined) {
      return;
    }

    setScrollPercentage(Math.round(progress * 100));
    setVisible(progress > 0);
  }, [progress]);

  // Get accent-based gradient - updated to use accent colors from theme
  const getAccentGradient = () => {
    // Use theme accent colors for dynamic theming
    return `linear-gradient(to right, ${accentColors.primary}, ${
      accentColors.secondary
    }, ${accentColors.tertiary || accentColors.primary})`;
  };

  // Fallback gradient for Magic UI style
  const getMagicUIGradient = () => {
    return "linear-gradient(to right, #A97CF8, #F38CB8, #FDCC92)";
  };

  return (
    <>
      {visible && (
        <>
          {/* Magic UI Style Progress Bar with Theme Integration */}
          <motion.div
            className={cn(
              "fixed inset-x-0 top-0 z-50 h-px origin-left",
              className
            )}
            style={{
              background: accentColors.primary
                ? getAccentGradient()
                : getMagicUIGradient(),
              scaleX: progress !== undefined ? progress : scrollYProgress,
            }}
            {...props}
          />

          {/* Additional functionality: Percentage indicator */}
          <div
            className={`fixed left-4 top-2 z-[51] text-xs font-medium transition-colors ${
              isDark ? "text-foreground/70" : "text-foreground/80"
            }`}
            style={{ color: accentColors.primary }}
          >
            {scrollPercentage}%
          </div>
        </>
      )}
    </>
  );
};

export default ScrollProgressBar;
