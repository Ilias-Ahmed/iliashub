import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ExternalLink, Github, Info } from "lucide-react";
import { useRef, useState } from "react";
import { Project } from "./types";
// haptics removed
import { useTheme } from "@/contexts/ThemeContext";

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

const ProjectCard = ({
  project,
  index,
  featured = false,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const prefersReducedMotion = useReducedMotion();

  // Mouse rotation effect
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const resetMouse = () => {
    x.set(0);
    y.set(0);
  };

  // Card animations
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative h-full perspective-1000 ${
        featured ? "w-full" : "w-full"
      }`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetMouse();
      }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-offset-2"
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 12px 28px rgba(0, 0, 0, 0.35), 0 0 18px ${accentColors.glow}`
            : "0 8px 22px rgba(0, 0, 0, 0.28)",
          filter: prefersReducedMotion ? "none" : undefined,
          transition: "box-shadow 0.25s ease",
        }}
      >
        {/* Background image with parallax effect */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${project.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transformStyle: "preserve-3d",
            transform: prefersReducedMotion ? undefined : "translateZ(-16px)",
            scale: prefersReducedMotion ? 1 : isHovered ? 1.03 : 1,
            transition: "scale 0.35s ease-out",
          }}
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
            opacity: isHovered ? 0.85 : 0.7,
            transformStyle: "preserve-3d",
            transform: prefersReducedMotion ? undefined : "translateZ(-8px)",
          }}
        />

        {/* Subtle spotlight on hover */}
        {isHovered && !prefersReducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(220px 220px at 50% 30%, rgba(255,255,255,0.12), transparent 65%)",
              mixBlendMode: "overlay",
            }}
            aria-hidden="true"
          />
        )}

        {/* Card content */}
        <div className="relative h-full w-full p-4 md:p-6 flex flex-col justify-end">
          {/* Project tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            style={{
              transform: "translateZ(40px)",
              opacity: isHovered ? 1 : 0.7,
            }}
          >
            {project.tags.map((tag, i) => (
              <motion.span
                key={i}
                className="px-2 py-1 text-xs rounded-full text-white/90 backdrop-blur-sm border"
                style={{
                  backgroundColor: `${accentColors.primary}20`,
                  borderColor: `${accentColors.primary}40`,
                  transform: `translateZ(${50 + i * 5}px)`,
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: `${accentColors.primary}30`,
                  borderColor: accentColors.primary,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Project title */}
          <motion.h3
            className="text-xl md:text-2xl font-bold mb-2 line-clamp-2"
            style={{
              transform: "translateZ(60px)",
              color: isHovered ? accentColors.primary : "white",
              textShadow: isHovered ? `0 0 15px ${accentColors.glow}` : "none",
              transition: "color 0.3s ease, text-shadow 0.3s ease",
            }}
          >
            {project.title}
          </motion.h3>

          {/* Project description */}
          <motion.p
            className="text-sm text-gray-300 mb-4 md:mb-6 line-clamp-3"
            style={{
              transform: "translateZ(40px)",
              opacity: isHovered ? 1 : 0.7,
            }}
          >
            {project.description}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="flex flex-wrap gap-2"
            style={{
              transform: "translateZ(70px)",
              opacity: isHovered ? 1 : 0.95,
            }}
          >
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 md:px-4 py-2 rounded-full text-white flex items-center gap-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: accentColors.primary,
                boxShadow: `0 4px 14px ${accentColors.shadow}`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Open ${project.title}`}
            >
              <ExternalLink size={14} />
              View Project
            </motion.a>

            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.2)",
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: `${accentColors.primary}20`,
                  borderColor: accentColors.primary,
                }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Open source code for ${project.title}`}
              >
                <Github size={16} />
              </motion.a>
            )}

            <motion.button
              onClick={() => {
                setShowDetails(true);
                // haptics removed
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)",
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: `${accentColors.primary}20`,
                borderColor: accentColors.primary,
              }}
              whileTap={{ scale: 0.9 }}
              aria-label={`More details about ${project.title}`}
            >
              <Info size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating particles effect */}
        {isHovered && !prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: `${accentColors.primary}70` }}
                initial={{
                  x: Math.random() * 100 - 50 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: [null, Math.random() * -50 - 10 + "%"],
                  opacity: [0, 0.8, 0],
                  scale: [0, Math.random() * 2 + 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Project details modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.6)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowDetails(false);
              // haptics removed
            }}
          >
            <motion.div
              className="rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto border"
              style={{
                backgroundColor: isDark
                  ? "rgba(17, 24, 39, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                borderColor: `${accentColors.primary}30`,
                backdropFilter: "blur(20px)",
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                // haptics removed
              }}
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} details`}
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                  }}
                />
                <h2
                  className="absolute bottom-4 left-4 text-3xl font-bold text-white"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {project.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: `${accentColors.primary}20`,
                      color: accentColors.primary,
                      border: `1px solid ${accentColors.primary}30`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mb-6 leading-relaxed opacity-80">
                {project.description}
                <br />
                <br />
                This project showcases modern web development practices with a
                focus on user experience, performance optimization, and scalable
                architecture. Built with cutting-edge technologies and following
                industry best practices for maintainable, accessible code.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside opacity-80 space-y-1">
                    <li>Responsive design across all devices</li>
                    <li>Interactive user interface with animations</li>
                    <li>Real-time data synchronization</li>
                    <li>Optimized performance and loading times</li>
                  </ul>
                </div>

                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    Technical Details
                  </h3>
                  <ul className="list-disc list-inside opacity-80 space-y-1">
                    <li>Frontend: React with TypeScript</li>
                    <li>Styling: Tailwind CSS with custom animations</li>
                    <li>State Management: Context API / Zustand</li>
                    <li>Build Tool: Vite for fast development</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg text-white flex items-center gap-2 font-medium"
                  style={{
                    backgroundColor: accentColors.primary,
                    boxShadow: `0 4px 14px ${accentColors.shadow}`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={18} />
                  View Live Project
                </motion.a>

                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg flex items-center gap-2 font-medium border"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)",
                      borderColor: isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: `${accentColors.primary}10`,
                      borderColor: accentColors.primary,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={18} />
                    View Source
                  </motion.a>
                )}

                <motion.button
                  onClick={() => {
                    setShowDetails(false);
                    // haptics removed
                  }}
                  className="px-6 py-3 rounded-lg font-medium border"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.2)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;
