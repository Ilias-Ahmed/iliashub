import { Tabs, TabsList } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";
import { animated, useSpring } from "@react-spring/web";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { certifications, timelineData } from "./aboutData";
import CertificationsGallery from "./CertificationsGallery";
import ExperienceTimeline from "./ExperienceTimeline";
import ProfileCard from "./ProfileCard";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeTab, setActiveTab] = useState("profile");
  const [scrollY, setScrollY] = useState(0);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Parallax effect for background elements
  const [{ offset }, api] = useSpring(() => ({ offset: [0, 0] }));

  // Track scroll position for parallax effects - improved with useCallback
  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      setScrollY(window.scrollY);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Improved mouse move handler with validation
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!e) return;

      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      api.start({ offset: [x * 15, y * 15] });
    },
    [api]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <section
      className="py-16  relative overflow-hidden theme-transition"
      id="about"
      onMouseMove={handleMouseMove}
      aria-label="About Section"
    >
      {/* Floating gradient orbs with mouse parallax effect */}
      <animated.div
        style={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: "16rem",
          height: "16rem",
          borderRadius: "9999px",
          backgroundColor: `${accentColors.primary}10`,
          filter: "blur(100px)",
          opacity: 0.6,
          transform: offset.to(
            (x, y) =>
              `translate(${scrollY * 0.05 + x}px, ${-scrollY * 0.02 + y}px)`
          ),
        }}
        aria-hidden="true"
      />
      <animated.div
        style={{
          position: "absolute",
          bottom: "33.333%",
          right: "25%",
          width: "20rem",
          height: "20rem",
          borderRadius: "9999px",
          background: `${accentColors.secondary}10`,
          filter: "blur(120px)",
          opacity: 0.5,
          transform: offset.to(
            (x, y) =>
              `translate(${-scrollY * 0.03 - x * 0.8}px, ${
                scrollY * 0.04 - y * 0.8
              }px)`
          ),
        }}
        aria-hidden="true"
      />
      <animated.div
        style={{
          position: "absolute",
          top: "66.6667%",
          right: "33.3333%",
          width: "12rem",
          height: "12rem",
          borderRadius: "9999px",
          backgroundColor: `${accentColors.primary}10`,
          filter: "blur(80px)",
          opacity: 0.6,
          transform: offset.to(
            (x, y) =>
              `translate(${scrollY * 0.02 + x * 1.2}px, ${
                -scrollY * 0.05 + y * 1.2
              }px)`
          ),
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 50%, ${accentColors.tertiary} 100%)`,
              }}
            >
              My Journey & Expertise
            </span>
          </h2>
        </motion.div>

        {/* Interactive Tabs with Enhanced Animations */}
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-20"
        >
          <motion.div
            className="flex justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TabsList
              className="relative inline-flex items-center p-1 rounded-xl border backdrop-blur-xl shadow-lg theme-transition"
              style={{
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              {[
                {
                  value: "profile",
                  label: "Profile",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" />
                    </svg>
                  ),
                  description: "Personal details and skills",
                },
                {
                  value: "experience",
                  label: "Experience",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="7" width="18" height="13" rx="2" />
                      <path d="M16 3v4M8 3v4" />
                    </svg>
                  ),
                  description: "Work history and timeline",
                },
              ].map((tab) => (
                <motion.button
                  key={tab.value}
                  type="button"
                  className="relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 overflow-visible"
                  style={{
                    color:
                      activeTab === tab.value
                        ? "white"
                        : isDark
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.7)",
                  }}
                  onClick={() => {
                    triggerHapticFeedback();
                    setActiveTab(tab.value);
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={tab.label}
                >
                  {/* Active background */}
                  {activeTab === tab.value && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                        boxShadow: `0 4px 12px ${accentColors.shadow}`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.span
                      className="text-lg"
                      animate={{
                        scale: activeTab === tab.value ? 1.15 : 1,
                        rotate: activeTab === tab.value ? 5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {tab.icon}
                    </motion.span>
                    <span>{tab.label}</span>
                  </span>

                  {/* Tooltip */}
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 pointer-events-none"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(0,0,0,0.8)"
                        : "rgba(255,255,255,0.9)",
                      color: isDark ? "white" : "black",
                      border: `1px solid ${
                        isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                      }`,
                      zIndex: 20,
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.description}
                    <div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderBottom: `4px solid ${
                          isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)"
                        }`,
                      }}
                    />
                  </motion.div>
                </motion.button>
              ))}
            </TabsList>
          </motion.div>

          {/* Enhanced Tab Content with Sliding Animations */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{
                    opacity: 0,
                    y: 60,
                    rotateX: -15,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -60,
                    rotateX: 15,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    opacity: { duration: 0.4 },
                  }}
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                  className="relative"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <ProfileCard />
                  </motion.div>
                </motion.div>
              )}
              {activeTab === "experience" && (
                <motion.div
                  key="experience"
                  initial={{
                    opacity: 0,
                    y: 60,
                    rotateX: -15,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -60,
                    rotateX: 15,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    opacity: { duration: 0.4 },
                  }}
                  style={{
                    perspective: "1000px",
                    transformStyle: "preserve-3d",
                  }}
                  className="relative"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <ExperienceTimeline timelineData={timelineData} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>

        {/* Certifications Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-24"
        >
          <motion.div variants={itemVariants}>
            <CertificationsGallery certifications={certifications} />
          </motion.div>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
                }}
              >
                Fun Facts About Me
              </span>
            </h3>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: "☕",
                title: "Coffee Consumed",
                value: "2,847",
                subtitle: "Cups this year",
                color: "#8B4513",
              },
              {
                icon: "🌙",
                title: "Late Night Coding",
                value: "847",
                subtitle: "Hours past midnight",
                color: "#4A90E2",
              },
              {
                icon: "🐛",
                title: "Bugs Fixed",
                value: "1,234",
                subtitle: "And counting...",
                color: "#E74C3C",
              },
              {
                icon: "🎯",
                title: "Projects Completed",
                value: "156",
                subtitle: "With passion",
                color: "#2ECC71",
              },
            ].map((fact, index) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center p-6 rounded-xl backdrop-blur-sm border group hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}
                whileHover={{
                  backgroundColor: `${accentColors.primary}10`,
                  borderColor: `${accentColors.primary}30`,
                }}
              >
                <div
                  className="text-4xl mb-4 group-hover:scale-110 transition-transform"
                  style={{ filter: `drop-shadow(0 0 10px ${fact.color}50)` }}
                >
                  {fact.icon}
                </div>
                <h4
                  className="text-2xl font-bold mb-2"
                  style={{ color: accentColors.primary }}
                >
                  {fact.value}
                </h4>
                <p className="font-medium mb-1">{fact.title}</p>
                <p className="text-sm opacity-70">{fact.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
