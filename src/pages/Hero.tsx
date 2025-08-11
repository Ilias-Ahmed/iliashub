import {
  AnimatedSpan,
  TypingAnimation,
  Terminal as TypingTerminal,
} from "@/components/ui/TypingAnimation";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { Eye } from "lucide-react";
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

// Floating elements removed for a cleaner hero

// Main Hero Component
const Hero: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors: AccentColors =
    getAccentColors() as unknown as AccentColors;
  const isMobile = useIsMobile();

  // Component mount effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Rotate role text to avoid unused setter warning and add subtle dynamism
  useEffect(() => {
    if (ROTATING_ROLES.length <= 1) return;
    const id = setInterval(() => {
      setCurrentRole((r) => (r + 1) % ROTATING_ROLES.length);
    }, ROLE_ROTATION_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-14 lg:py-20"
        >
          {/* Left Column - Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Title*/}
            <motion.div variants={titleVariants} className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                {isMobile ? (
                  <span
                    className="block"
                    style={{ color: accentColors.primary }}
                  >
                    Ilias Ahmed
                  </span>
                ) : (
                  <span
                    className="block"
                    style={{ color: accentColors.primary }}
                  >
                    {"Ilias Ahmed".split("").map((char, index) => (
                      <span
                        key={index}
                        className="inline-block transition-transform duration-200 hover:-translate-y-1"
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
                  <h2 className="text-lg sm:text-2xl font-medium opacity-80">
                    {ROTATING_ROLES[0]}
                  </h2>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={currentRole}
                      initial={{ opacity: 0, y: 20, rotateX: 90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, y: -20, rotateX: -90 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-xl md:text-2xl lg:text-3xl font-medium opacity-80"
                    >
                      {ROTATING_ROLES[currentRole]}
                    </motion.h2>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed"
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
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
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
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={() => setIsResumeOpen(true)}
                onMouseEnter={() => {
                  // Prefetch viewer chunk for snappier open
                  import("@/components/ui/ResumeViewer");
                }}
                className="group inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 sm:px-5 sm:py-3 transition-all duration-300 backdrop-blur-sm"
                style={{
                  borderColor: `${accentColors.primary}66`,
                  backgroundColor: isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.04)",
                  color: accentColors.primary,
                  boxShadow: `0 0 20px ${accentColors.glow}33`,
                }}
                whileHover={{
                  scale: 1.03,
                  y: -1,
                  backgroundColor: `${accentColors.primary}14`,
                }}
                whileTap={{ scale: 0.97 }}
                aria-label="View Resume"
              >
                <Eye size={18} />
                <span className="font-semibold">View Resume</span>
              </motion.button>

              {/* Download removed per request */}
            </motion.div>
          </div>

          {/* Right Column - Terminal */}
          <motion.div
            variants={itemVariants}
            className="relative flex items-center justify-center order-1 lg:order-2"
          >
            <motion.div
              className="relative w-full max-w-[22rem] sm:max-w-md md:max-w-xl h-[420px] sm:h-[480px] lg:h-[560px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <TypingTerminal
                className="max-w-full h-full max-h-[560px] sm:max-h-[600px] lg:max-h-[640px] shadow-sm backdrop-blur-md"
                startOnView
                sequence
                loop
                loopDelay={1000}
              >
                <TypingAnimation
                  className="text-muted-foreground"
                  duration={35}
                >
                  &gt; whoami
                </TypingAnimation>
                <AnimatedSpan style={{ color: accentColors.primary }}>
                  <span>✔ Name: Ilias Ahmed</span>
                </AnimatedSpan>
                <AnimatedSpan style={{ color: accentColors.primary }}>
                  <span>✔ Role: Fullstack Developer</span>
                </AnimatedSpan>
                <AnimatedSpan className="text-foreground/70">
                  <span>› Stack: React • TypeScript • Node</span>
                </AnimatedSpan>
                {!isMobile && (
                  <AnimatedSpan className="text-foreground/70">
                    <span>› Status: Open to opportunities</span>
                  </AnimatedSpan>
                )}
                <TypingAnimation
                  className="text-muted-foreground"
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
