import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
  quotes?: string[];
}

/**
 * Simplified, performance-optimized loading screen
 */
const LoadingScreen = ({
  onLoadingComplete,
  duration = 3000, // Reduced duration
  quotes = [
    "Crafting digital experiences...",
    "Building tomorrow's interfaces...",
    "Where innovation meets design...",
  ],
}: LoadingScreenProps) => {
  const { accent } = useTheme();
  const isMobile = useIsMobile();

  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  // Simplified progress animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setLoadingComplete(true);
        
        // Start exit animation
        setTimeout(() => {
          setExitAnimation(true);
        }, 500);

        // Complete loading
        setTimeout(() => {
          onLoadingComplete?.();
        }, 1000);
      }
    }, 50); // Update every 50ms instead of every frame

    return () => clearInterval(interval);
  }, [duration, onLoadingComplete]);

  // Simplified quote rotation
  useEffect(() => {
    if (loadingComplete) return;
    
    const interval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [quotes.length, loadingComplete]);

  const getAccentColor = () => {
    const colors = {
      purple: "147, 51, 234",
      blue: "59, 130, 246", 
      pink: "236, 72, 153",
      green: "34, 197, 94",
      orange: "249, 115, 22",
    };
    return colors[accent] || colors.purple;
  };

  if (exitAnimation) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, 
            rgba(0, 0, 0, 0.95) 0%, 
            rgba(${getAccentColor()}, 0.1) 50%, 
            rgba(0, 0, 0, 0.95) 100%)`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          scale: 1.1,
          transition: { duration: 0.8, ease: "easeInOut" }
        }}
      >
        {/* Main content */}
        <div className="flex flex-col items-center space-y-8 max-w-lg mx-auto px-6">
          {/* Logo/Brand */}
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Portfolio
            </h1>
            <p className="text-gray-400 mt-2">Crafting Digital Excellence</p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(${getAccentColor()}, 0.8) 0%, 
                    rgba(${getAccentColor()}, 1) 100%)`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Quote */}
          <motion.div
            className="text-center min-h-[3rem] flex items-center"
            key={activeQuoteIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-300 italic text-lg max-w-md">
              "{quotes[activeQuoteIndex]}"
            </p>
          </motion.div>

          {/* Simplified particles - only on desktop */}
          {!isMobile && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: `rgba(${getAccentColor()}, 0.6)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
