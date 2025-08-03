import { useTheme } from "@/contexts/ThemeContext";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

/**
 * Award-winning loading screen with sophisticated animations
 */
const LoadingScreen = ({
  onLoadingComplete,
  duration = 6000, // Industry standard: 4-8 seconds
}: LoadingScreenProps) => {
  const { accent } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showExit, setShowExit] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [minTimeComplete, setMinTimeComplete] = useState(false);

  // Mouse tracking for subtle parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 50 });

  const stages = useMemo(
    () => [
      {
        label: "Initializing System",
        end: 15,
        assets: ["core.js", "main.css"],
      },
      {
        label: "Loading Core Assets",
        end: 35,
        assets: ["components.js", "icons.svg", "fonts.woff"],
      },
      {
        label: "Processing Components",
        end: 55,
        assets: ["animations.js", "effects.css"],
      },
      {
        label: "Preparing Interface",
        end: 75,
        assets: ["layout.css", "responsive.css"],
      },
      {
        label: "Optimizing Performance",
        end: 90,
        assets: ["chunks.js", "lazy.js"],
      },
      {
        label: "Finalizing Experience",
        end: 100,
        assets: ["analytics.js", "sw.js"],
      },
    ],
    []
  );

  const getAccentColors = () => {
    const colorMap = {
      purple: { rgb: "147, 51, 234", hex: "#9333EA" },
      blue: { rgb: "59, 130, 246", hex: "#3B82F6" },
      pink: { rgb: "236, 72, 153", hex: "#EC4899" },
      green: { rgb: "34, 197, 94", hex: "#22C55E" },
      orange: { rgb: "249, 115, 22", hex: "#F97316" },
    };
    return colorMap[accent] || colorMap.purple;
  };

  // Enhanced progress animation with realistic timing
  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);

      // Realistic loading curve - slower at start, faster in middle, slower at end
      let easedProgress;
      if (rawProgress < 10) {
        // Very slow start (0-10%)
        easedProgress = rawProgress * 0.3;
      } else if (rawProgress < 80) {
        // Normal speed (10-80%)
        const normalizedProgress = (rawProgress - 10) / 70;
        easedProgress = 3 + normalizedProgress * 77;
      } else {
        // Slow down near end (80-100%)
        const normalizedProgress = (rawProgress - 80) / 20;
        const slowEnd = 1 - Math.pow(1 - normalizedProgress, 2);
        easedProgress = 80 + slowEnd * 20;
      }

      setProgress(easedProgress);

      // Update stage based on progress
      const activeStage = stages.findIndex(
        (stage) => easedProgress <= stage.end
      );
      const newStage = activeStage >= 0 ? activeStage : stages.length - 1;
      setCurrentStage(newStage);

      // Update loading text with current asset
      const currentStageData = stages[newStage];
      if (currentStageData?.assets) {
        const assetIndex = Math.floor(
          ((easedProgress - (newStage > 0 ? stages[newStage - 1].end : 0)) /
            (currentStageData.end -
              (newStage > 0 ? stages[newStage - 1].end : 0))) *
            currentStageData.assets.length
        );
        const asset =
          currentStageData.assets[
            Math.min(assetIndex, currentStageData.assets.length - 1)
          ];
        setLoadingText(asset);
      }

      if (rawProgress >= 100) {
        // Ensure minimum loading time of 3 seconds for UX
        if (!minTimeComplete) {
          setTimeout(
            () => setMinTimeComplete(true),
            Math.max(0, 3000 - elapsed)
          );
        }

        // Only exit when both progress is complete AND minimum time has passed
        if (minTimeComplete || elapsed >= 3000) {
          setTimeout(() => setShowExit(true), 1200);
          setTimeout(() => onLoadingComplete?.(), 2000);
        } else {
          animationFrame = requestAnimationFrame(updateProgress);
        }
      } else {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    // Start the animation
    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [duration, onLoadingComplete, stages, minTimeComplete]);

  // Ensure minimum loading time (industry standard UX practice)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeComplete(true);
    }, 3000); // Minimum 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) * 0.01);
        mouseY.set((e.clientY - centerY) * 0.01);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const colors = getAccentColors();

  return (
    <AnimatePresence>
      {!showExit && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-99 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at center,
              rgba(${colors.rgb}, 0.08) 0%,
              rgba(0, 0, 0, 0.95) 40%,
              rgba(0, 0, 0, 1) 100%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(${colors.rgb}, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(${colors.rgb}, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
                x: springX,
                y: springY,
              }}
              animate={{
                backgroundPosition: ["0px 0px", "50px 50px"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Main Content */}
          <motion.div
            className="relative z-10 h-full flex flex-col items-center justify-center px-6"
            style={{ x: springX, y: springY }}
          >
            {/* Logo Section */}
            <motion.div
              className="text-center mb-16"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.h1
                className="text-7xl md:text-9xl font-black"
                style={{
                  background: `linear-gradient(45deg,
                    #ffffff 0%,
                    ${colors.hex} 50%,
                    #ffffff 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundSize: "300% 300%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                PORTFOLIO
              </motion.h1>

              <motion.div
                className="mt-4 text-xl text-gray-400 font-light tracking-[0.3em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                DIGITAL ARTISTRY
              </motion.div>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* Progress Ring */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 120 120"
                >
                  {/* Background ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    fill="transparent"
                  />

                  {/* Progress ring */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke={colors.hex}
                    strokeWidth="2"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={339.292} // 2 * PI * 54
                    initial={{ strokeDashoffset: 339.292 }}
                    animate={{
                      strokeDashoffset: 339.292 - (progress / 100) * 339.292,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                      filter: `drop-shadow(0 0 8px ${colors.hex})`,
                    }}
                  />

                  {/* Animated dot */}
                  <motion.circle
                    cx={
                      60 +
                      54 *
                        Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)
                    }
                    cy={
                      60 +
                      54 *
                        Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)
                    }
                    r="4"
                    fill={colors.hex}
                    style={{
                      filter: `drop-shadow(0 0 12px ${colors.hex})`,
                    }}
                  >
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </motion.circle>
                </svg>

                {/* Center percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-3xl font-bold text-white">
                      {Math.round(progress)}%
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Stage indicator */}
              <motion.div
                className="text-center"
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-gray-400 text-sm font-medium tracking-widest uppercase mb-2">
                  {stages[currentStage]?.label}
                </div>
                {loadingText && (
                  <motion.div
                    className="text-gray-500 text-xs font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Loading: {loadingText}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + i * 7}%`,
                    top: `${20 + Math.sin(i) * 60}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + Math.sin(i) * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${colors.hex} 0%, transparent 70%)`,
                      boxShadow: `0 0 20px ${colors.hex}`,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Completion animation */}
          {progress >= 100 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle,
                    ${colors.hex}20 0%,
                    transparent 50%)`,
                }}
                animate={{
                  scale: [0, 3],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
