import { useTheme } from "@/contexts/ThemeContext";
// haptics removed
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Project } from "./types";

interface ProjectShowcaseProps {
  projects: Project[];
  autoplay?: boolean;
  showNavigation?: boolean;
}

const ProjectShowcase = ({
  projects,
  autoplay = true,
  showNavigation = true,
}: ProjectShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(autoplay && !prefersReducedMotion);
  const [direction, setDirection] = useState(0);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const resetMouse = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-play functionality - only when component is visible
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const currentIntervalRef = intervalRef.current;

    if (isPlaying && projects.length > 1) {
      // Use intersection observer to only auto-play when visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              intervalId = setInterval(() => {
                setDirection(1);
                setCurrentIndex((prev) => (prev + 1) % projects.length);
              }, 5000);
              intervalRef.current = intervalId;
            } else {
              if (intervalId) {
                clearInterval(intervalId);
                intervalId = undefined!;
              }
            }
          });
        },
        { threshold: 0.3 }
      );

      const showcaseElement = document.querySelector(
        '[data-testid="project-showcase"]'
      );
      if (showcaseElement) {
        observer.observe(showcaseElement);
      }

      return () => {
        observer.disconnect();
        if (intervalId) clearInterval(intervalId);
        if (currentIntervalRef) clearInterval(currentIntervalRef);
      };
    }

    return () => {
      if (currentIntervalRef) {
        clearInterval(currentIntervalRef);
      }
    };
  }, [isPlaying, projects.length]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    // haptics removed
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    // haptics removed
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    // haptics removed
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // haptics removed
  };

  const currentProject = projects[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const formattedIndex = useMemo(() => {
    const total = projects.length;
    const current = currentIndex + 1;
    const pad = total >= 100 ? 3 : 2;
    return `${String(current).padStart(pad, "0")} / ${String(total).padStart(
      pad,
      "0"
    )}`;
  }, [currentIndex, projects.length]);

  return (
    <div
      className="relative w-full max-w-7xl mx-auto"
      data-testid="project-showcase"
    >
      {/* Main canvas */}
      <div
        className="relative h-[420px] sm:h-[520px] md:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden bg-[oklch(0.18_0_0)] border border-white/10 backdrop-blur-md"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetMouse}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.4 },
            }}
            drag={prefersReducedMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                goToNext();
              } else if (swipe > swipeConfidenceThreshold) {
                goToPrevious();
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{
              rotateX: prefersReducedMotion ? 0 : rotateX,
              rotateY: prefersReducedMotion ? 0 : rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Content: editorial, minimal */}
            <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 p-6 md:p-10">
              {/* Media area: supports video, iframe demo, or image */}
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 group/preview">
                {currentProject.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    src={currentProject.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : currentProject.demoUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={currentProject.demoUrl}
                    title={`${currentProject.title} demo`}
                    loading="lazy"
                  />
                ) : (
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {!prefersReducedMotion && (
                  <div
                    className="shine-sweep pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Info area */}
              <div
                className="flex flex-col justify-between"
                style={{ transform: "translateZ(30px)" }}
              >
                <div className="space-y-4">
                  <div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${accentColors.primary}20`,
                        color: accentColors.primary,
                        border: `1px solid ${accentColors.primary}40`,
                      }}
                    >
                      {currentProject.category || "Case Study"}
                    </span>
                  </div>
                  <h3 className="use-display-on-lg text-3xl md:text-4xl lg:text-5xl font-extrabold text-white uppercase leading-[1.05]">
                    {currentProject.title}
                  </h3>
                  <p className="text-base md:text-lg text-white/80 max-w-prose">
                    {currentProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.tags.slice(0, 6).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs rounded-full text-white/90 border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <motion.a
                    href={currentProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-lg text-white font-medium inline-flex items-center gap-2"
                    style={{
                      backgroundColor: accentColors.primary,
                      boxShadow: `0 8px 25px ${accentColors.shadow}`,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ExternalLink size={16} /> View Project
                  </motion.a>
                  {currentProject.github && (
                    <motion.a
                      href={currentProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 border text-white"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderColor: "rgba(255,255,255,0.25)",
                      }}
                      whileHover={{
                        scale: 1.03,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Github size={16} /> View Code
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {showNavigation && projects.length > 1 && (
          <>
            <motion.button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: `${accentColors.primary}80`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} className="text-white" />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: `${accentColors.primary}80`,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} className="text-white" />
            </motion.button>
          </>
        )}

        {/* Play/Pause button */}
        {autoplay && projects.length > 1 && (
          <motion.button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: `${accentColors.primary}80`,
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause size={16} className="text-white" />
            ) : (
              <Play size={16} className="text-white ml-0.5" />
            )}
          </motion.button>
        )}
      </div>

      {/* Dots indicator */}
      {projects.length > 1 && (
        <div className="flex items-center justify-between mt-6">
          {/* Minimal index indicator */}
          <div className="text-white/70 text-sm tracking-[0.3em] uppercase pl-1">
            {formattedIndex}
          </div>
          {/* Dots */}
          <div className="flex justify-center space-x-2">
            {projects.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    index === currentIndex
                      ? accentColors.primary
                      : isDark
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.3)",
                }}
                whileHover={{
                  scale: 1.15,
                  backgroundColor: accentColors.primary,
                }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {isPlaying && projects.length > 1 && (
        <div className="mt-4 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: accentColors.primary }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}

      {/* Corner index badge */}
      <div className="absolute bottom-4 left-4 z-10 text-white/80 text-xs tracking-[0.2em]">
        {formattedIndex}
      </div>
    </div>
  );
};

export default ProjectShowcase;
