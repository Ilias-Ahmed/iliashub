import styles from "@/components/ui/bubble.module.css";
import ControlPanel from "@/components/ui/ControlPanel";
import { useBackground } from "@/contexts/BackgroundContext";
import { useNavigation } from "@/contexts/NavigationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ChevronDown,
  Code2,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface SocialLink {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href?: string;
  action?: () => void;
  label: string;
  description: string;
}

// Constants - optimized for performance
const ROTATING_ROLES = [
  "Full Stack Developer",
  "Problem Solver",
  "Tech Innovator",
]; // Reduced array size

const ROLE_ROTATION_INTERVAL = 4000; // Slower rotation to reduce CPU usage
const FLOATING_ANIMATION_DURATION = 4000;
const MOUSE_MOVE_MULTIPLIER = 0.05;

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

// Floating Icon Component
const FloatingIcon: React.FC<{
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  index: number;
  accentColors: AccentColors;
}> = ({ Icon, index, accentColors }) => {
  const positions = [
    { left: "10%", top: "15%" },
    { left: "30%", top: "30%" },
    { left: "50%", top: "45%" },
    { left: "70%", top: "60%" },
  ];

  const position = positions[index] || positions[0];

  return (
    <motion.div
      className="absolute p-2 rounded-lg backdrop-blur-sm border"
      style={{
        ...position,
        backgroundColor: `${accentColors.primary}20`,
        borderColor: `${accentColors.primary}30`,
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, index % 2 === 0 ? 5 : -5, 0],
      }}
      transition={{
        duration: FLOATING_ANIMATION_DURATION / 1000,
        repeat: Infinity,
        delay: index * 0.5,
      }}
      whileHover={{ scale: 1.2 }}
    >
      <Icon size={16} style={{ color: accentColors.primary }} />
    </motion.div>
  );
};

// Main Hero Component
const Hero: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors: AccentColors =
    getAccentColors() as unknown as AccentColors;
  const { setCurrentSection } = useBackground();
  const { navigateToSection } = useNavigation();
  const isMobile = useIsMobile();

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = useMemo(() => ({ stiffness: 100, damping: 30 }), []);
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Social links configuration
  const socialLinks: SocialLink[] = useMemo(
    () => [
      {
        icon: Github,
        href: "https://github.com/Ilias-Ahmed",
        label: "GitHub",
        description: "View my open source projects",
      },
      {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/ilias-ahmed9613/",
        label: "LinkedIn",
        description: "Connect with me professionally",
      },
      {
        icon: Mail,
        href: "mailto:ilias.ahmed.dev@gmail.com",
        label: "Email",
        description: "Get in touch directly",
      },
      {
        icon: Download,
        action: () => {
          try {
            const link = document.createElement("a");
            link.href = "/resume.pdf";
            link.download = "Ilias_Ahmed_Resume.pdf";
            link.click();
          } catch (error) {
            console.error("Failed to download resume:", error);
          }
        },
        label: "Resume",
        description: "Download my CV",
      },
    ],
    []
  );

  // Optimized mouse tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || !heroRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseXPos =
        (e.clientX - rect.left - centerX) * MOUSE_MOVE_MULTIPLIER;
      const mouseYPos =
        (e.clientY - rect.top - centerY) * MOUSE_MOVE_MULTIPLIER;

      mouseX.set(mouseXPos);
      mouseY.set(mouseYPos);
    },
    [mouseX, mouseY, isMobile]
  );

  // Handle social link clicks
  const handleSocialClick = useCallback(
    (social: SocialLink) => (e: React.MouseEvent) => {
      e.preventDefault();

      if (social.action) {
        social.action();
      } else if (social.href) {
        window.open(social.href, "_blank", "noopener,noreferrer");
      }
    },
    []
  );

  const handleScrollDown = useCallback(() => {
    navigateToSection("about");
  }, [navigateToSection]);

  // Role rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % ROTATING_ROLES.length);
    }, ROLE_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Component mount effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Set current section for background system
  useEffect(() => {
    setCurrentSection("hero");
  }, [setCurrentSection]);

  // Background styles
  const backgroundStyles = useMemo(
    () => ({
      backgroundImage: isMobile
        ? `url('https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png')`
        : "none",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center right",
    }),
    [isMobile]
  );

  const floatingIcons = [Code2, Terminal, Zap, Sparkles];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      id="hero"
      style={backgroundStyles}
    >
      {/* Control Panel */}
      <ControlPanel />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen"
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Terminal greeting */}
            <motion.div variants={itemVariants}>
              <div
                className="flex items-center gap-2 font-mono text-sm"
                style={{ color: accentColors.primary }}
              >
                <Terminal size={16} />
                <span>$ whoami</span>
              </div>
            </motion.div>

            {/* Main title */}
            <motion.div variants={titleVariants} className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block" style={{ color: accentColors.primary }}>
                  {"Ilias Ahmed".split("").map((char, index) => (
                    <span key={index} className={styles.hoverText}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </h1>

              {/* Dynamic role */}
              <div className="h-12 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentRole}
                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: -90 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-xl md:text-2xl lg:text-3xl font-medium opacity-70"
                  >
                    {ROTATING_ROLES[currentRole]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={itemVariants}
              className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed"
            >
              <span>Crafting exceptional </span>
              <span className="relative">
                digital experiences
                <svg
                  viewBox="0 0 286 73"
                  fill="none"
                  className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
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

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.button
                  key={social.label}
                  onClick={handleSocialClick(social)}
                  className="group p-3 rounded-lg border-2 transition-all duration-300 backdrop-blur-sm relative"
                  style={{
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -2,
                    borderColor: accentColors.primary,
                    backgroundColor: `${accentColors.primary}10`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  title={social.description}
                  aria-label={social.description}
                >
                  <social.icon
                    size={20}
                    className="transition-colors duration-300 group-hover:text-current"
                  />
                  {social.href && (
                    <ExternalLink
                      size={12}
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accentColors.primary }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Visual (Desktop only) */}
          {!isMobile && (
            <motion.div
              variants={itemVariants}
              className="relative flex items-center justify-center"
              style={{ x, y }}
            >
              <motion.div
                className="relative w-full max-w-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://cdn.pixabay.com/photo/2019/10/09/07/28/development-4536630_1280.png"
                  alt="Development Illustration"
                  className="w-full h-auto object-contain opacity-90"
                  style={{
                    filter: `drop-shadow(0 0 40px ${accentColors.glow})`,
                  }}
                  loading="lazy"
                />

                {/* Floating elements around the image */}
                {floatingIcons.map((Icon, index) => (
                  <FloatingIcon
                    key={index}
                    Icon={Icon}
                    index={index}
                    accentColors={accentColors}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm opacity-70">Scroll to explore</span>
          <motion.button
            onClick={handleScrollDown}
            className="p-2 rounded-full border-2 transition-all duration-300"
            style={{
              borderColor: accentColors.border,
              backgroundColor: `${accentColors.primary}10`,
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              scale: 1.1,
              borderColor: accentColors.primary,
              backgroundColor: `${accentColors.primary}20`,
            }}
            aria-label="Scroll to next section"
          >
            <ChevronDown
              size={20}
              className="transition-colors"
              style={{ color: accentColors.primary }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
