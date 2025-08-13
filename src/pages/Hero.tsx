import {
  AnimatedSpan,
  TypingAnimation,
  Terminal as TypingTerminal,
} from "@/components/ui/TypingAnimation";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "framer-motion";
import React, { Suspense, useEffect, useRef, useState } from "react";
const ResumeViewer = React.lazy(() => import("@/components/ui/ResumeViewer"));

// Constants - optimized for performance
const ROTATING_ROLES = [
  "Full Stack Developer",
  "Problem Solver",
  "Tech Innovator",
];

const ROLE_ROTATION_INTERVAL = 5000; // Slower rotation

// AccentColors type definition
interface AccentColors {
  primary: string;
  border: string;
  glow: string;
}

// Main Hero Component
const Hero: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { getAccentColors } = useTheme();
  const accentColors: AccentColors =
    getAccentColors() as unknown as AccentColors;
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  // Component mount effect
  useEffect(() => {
    // Component is ready after mount
  }, []);

  // Simple role rotation - no fancy effects
  useEffect(() => {
    if (prefersReducedMotion || ROTATING_ROLES.length <= 1 || isMobile) return;

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
  }, [prefersReducedMotion, isMobile]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
          {/* Left Column - Content */}
          <div className="space-y-8 order-1 lg:order-1 lg:self-start">
            {/* Title*/}
            <div className="space-y-4">
              {/* Eyebrow label */}
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-foreground/60">
                  Frontend Developer • React • TypeScript
                </p>
                <span 
                  className="block mt-3 h-0.5 w-16 bg-current"
                  style={{ color: accentColors.primary }}
                  aria-hidden="true" 
                />
              </div>
              <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[4.25rem] font-extrabold leading-[1.05] tracking-tight uppercase">
                <span
                  className="block"
                  style={{ color: accentColors.primary }}
                >
                  ILIAS AHMED
                </span>
              </h1>

              {/* Dynamic role */}
              <div className="h-9 sm:h-12 flex items-center">
                <h2 
                  className="text-lg sm:text-2xl font-semibold lg:font-medium uppercase tracking-wide text-foreground/80 transition-opacity duration-500"
                  key={currentRole}
                >
                  {ROTATING_ROLES[currentRole]}
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className="text-[1rem] sm:text-lg md:text-xl text-foreground/85 max-w-xl md:max-w-2xl leading-relaxed">
              <span>Crafting exceptional </span>
              <span className="relative">
                digital experiences
                <svg
                  viewBox="0 0 286 73"
                  fill="none"
                  className="hidden md:block absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
                >
                  <path
                    d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
                    stroke={accentColors.primary}
                    strokeWidth="3"
                    fill="none"
                    className={prefersReducedMotion ? "opacity-100" : "animate-pulse"}
                  />
                </svg>
              </span>
              <span>
                {" "}
                with modern technologies. I transform ideas into powerful,
                scalable solutions that make a real impact.
              </span>
            </div>

            {/* Resume viewer button */}
            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => setIsResumeOpen(true)}
                onMouseEnter={() => {
                  // Prefetch viewer chunk for snappier open
                  import("@/components/ui/ResumeViewer");
                }}
                className="group inline-flex items-center gap-2 px-0 py-1 text-base sm:text-lg font-medium tracking-wide transition-colors duration-200 hover:opacity-80 focus-visible:outline-none"
                style={{ color: accentColors.primary }}
                aria-label="View Resume"
              >
                <span>View Resume</span>
              </button>
            </div>
          </div>

          {/* Right Column - Terminal */}
          <div className="relative flex items-center justify-center order-2 lg:order-2">
            <div className="relative w-full max-w-[22rem] sm:max-w-md md:max-w-xl h-[280px] sm:h-[460px]">
              <TypingTerminal
                className="max-w-full h-full max-h-[320px] sm:max-h-[520px] lg:max-h-[700px] shadow-sm backdrop-blur-md text-[13px] sm:text-sm"
                startOnView
                sequence
                loop={!prefersReducedMotion}
                loopDelay={2000}
              >
                <TypingAnimation
                  className="text-[13px] sm:text-sm text-muted-foreground"
                  duration={50}
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
                  duration={40}
                >
                  Ready to build something great?
                </TypingAnimation>
              </TypingTerminal>
            </div>
          </div>
        </div>
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
