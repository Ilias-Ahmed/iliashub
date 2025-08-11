import {
  AnimatedSpan,
  TypingAnimation,
  Terminal as TypingTerminal,
} from "@/components/ui/TypingAnimation";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { Suspense, useEffect, useRef, useState } from "react";
const ResumeViewer = React.lazy(() => import("@/components/ui/ResumeViewer"));

// Constants - optimized for performance
const ROTATING_ROLES = [
  "Full Stack Developer",
  "Problem Solver",
  "Tech Innovator",
]; // Reduced array size

const ROLE_ROTATION_INTERVAL = 4000; // Slower rotation to reduce CPU usage

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: "easeOut" as const,
    },
  },
};

// AccentColors type definition
interface AccentColors {
  primary: string;
  border: string;
  glow: string;
}

// Main Hero Component
const Hero: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { getAccentColors } = useTheme();
  const accentColors: AccentColors =
    getAccentColors() as unknown as AccentColors;
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Component mount effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Rotate role text; pause when tab hidden; respect reduced motion
  useEffect(() => {
    if (prefersReducedMotion || ROTATING_ROLES.length <= 1) return;

    let intervalId: number | null = null;

    const start = () => {
      if (intervalId !== null) return;
      intervalId = window.setInterval(() => {
        setCurrentRole((r) => (r + 1) % ROTATING_ROLES.length);
      }, ROLE_ROTATION_INTERVAL);
    };

    const stop = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={
            prefersReducedMotion ? undefined : isLoaded ? "visible" : "hidden"
          }
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 lg:py-24"
        >
          {/* Left Column - Content */}
          <div className="space-y-8 order-1 lg:order-1 lg:self-start">
            {/* Title*/}
            <motion.div
              variants={prefersReducedMotion ? undefined : titleVariants}
              className="space-y-4"
            >
              {/* Eyebrow label */}
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/60">
                  Frontend Developer • React • TypeScript
                </p>
                <span className="accent-rule mt-3 block" aria-hidden="true" />
              </div>
              <h1 className="use-display-on-lg text-[2rem] sm:text-[2.75rem] lg:text-[4.25rem] font-extrabold leading-[1.05] tracking-tight uppercase text-letterpress">
                {isMobile ? (
                  <span
                    className="block"
                    style={{ color: accentColors.primary }}
                  >
                    ILIAS AHMED
                  </span>
                ) : (
                  <span
                    className="block"
                    style={{
                      color: accentColors.primary,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {"ILIAS AHMED".split("").map((char, index) => (
                      <span
                        key={index}
                        className="inline-block transition-transform duration-200 hover:-translate-y-1 will-change-transform"
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </span>
                )}
              </h1>

              {/* Dynamic role */}
              <div className="h-9 sm:h-12 flex items-center">
                {isMobile ? (
                  <h2 className="text-lg sm:text-2xl font-semibold lg:font-medium uppercase tracking-wide text-foreground/80">
                    {ROTATING_ROLES[0]}
                  </h2>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={currentRole}
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, y: 20, rotateX: 90 }
                      }
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { opacity: 1, y: 0, rotateX: 0 }
                      }
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : { opacity: 0, y: -20, rotateX: -90 }
                      }
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-xl md:text-2xl lg:text-3xl font-semibold lg:font-medium uppercase tracking-wide text-foreground/80"
                    >
                      {ROTATING_ROLES[currentRole]}
                    </motion.h2>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={prefersReducedMotion ? undefined : itemVariants}
              className="text-[1rem] sm:text-lg md:text-xl text-foreground/85 max-w-xl md:max-w-2xl leading-relaxed"
            >
              <span>Crafting exceptional </span>
              <span className="relative">
                digital experiences
                <svg
                  viewBox="0 0 286 73"
                  fill="none"
                  className="hidden md:block absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
                >
                  <motion.path
                    initial={
                      prefersReducedMotion ? undefined : { pathLength: 0 }
                    }
                    whileInView={
                      prefersReducedMotion ? undefined : { pathLength: 1 }
                    }
                    transition={{
                      duration: 1.25,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
                    stroke={accentColors.primary}
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
              <span>
                {" "}
                with modern technologies. I transform ideas into powerful,
                scalable solutions that make a real impact.
              </span>
            </motion.div>

            {/* Resume viewer button */}
            <motion.div
              variants={prefersReducedMotion ? undefined : itemVariants}
              className="flex flex-wrap gap-6"
            >
              <motion.button
                onClick={() => setIsResumeOpen(true)}
                onMouseEnter={() => {
                  // Prefetch viewer chunk for snappier open
                  import("@/components/ui/ResumeViewer");
                }}
                className="group inline-flex items-center gap-2 px-0 py-1 text-base sm:text-lg font-medium tracking-wide link-underline focus-visible:outline-none"
                style={{ color: accentColors.primary }}
                whileHover={{ opacity: 1 }}
                whileTap={{ scale: 0.98 }}
                aria-label="View Resume"
              >
                <span>View Resume</span>
              </motion.button>

              {/* Download removed per request */}
            </motion.div>
          </div>

          {/* Right Column - Terminal */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center order-2 lg:order-2"
          >
            <motion.div
              className="relative w-full max-w-[22rem] sm:max-w-md md:max-w-xl h-[280px] sm:h-[460px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <TypingTerminal
                className="max-w-full h-full max-h-[320px] sm:max-h-[520px] lg:max-h-[700px] shadow-sm backdrop-blur-md text-[13px] sm:text-sm"
                startOnView
                sequence
                loop
                loopDelay={1000}
              >
                <TypingAnimation
                  className="text-[13px] sm:text-sm text-muted-foreground"
                  duration={35}
                >
                  &gt; whoami
                </TypingAnimation>
                <AnimatedSpan
                  className="text-[13px] sm:text-sm"
                  style={{ color: accentColors.primary }}
                >
                  <span>✔ Name: Ilias Ahmed</span>
                </AnimatedSpan>
                <AnimatedSpan
                  className="text-[13px] sm:text-sm"
                  style={{ color: accentColors.primary }}
                >
                  <span>✔ Role: Fullstack Developer</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-[13px] sm:text-sm text-foreground/70">
                  <span>› Stack: React • TypeScript • Node</span>
                </AnimatedSpan>
                {!isMobile && (
                  <AnimatedSpan className="text-[13px] sm:text-sm text-foreground/70">
                    <span>› Status: Open to opportunities</span>
                  </AnimatedSpan>
                )}
                <TypingAnimation
                  className="text-[13px] sm:text-sm text-muted-foreground"
                  duration={28}
                >
                  Ready to build something great?
                </TypingAnimation>
              </TypingTerminal>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      {/* Resume Viewer Modal (lazy-loaded only when opened) */}
      {isResumeOpen && (
        <Suspense fallback={null}>
          <ResumeViewer
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
          />
        </Suspense>
      )}
    </section>
  );
};

export default Hero;
