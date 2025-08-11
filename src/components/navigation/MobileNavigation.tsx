import { useNavigation } from "@/contexts/NavigationContext";
import {
  useTheme,
  type ThemeAccent,
  type ThemeMode,
} from "@/contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Code,
  Home,
  Mail,
  Monitor,
  Moon,
  Sun,
  User,
  Workflow,
  X,
} from "lucide-react";
import React, { useEffect, useRef } from "react";

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className = "",
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Safe destructuring with fallbacks
  const {
    sections = [],
    navigateToSection = () => {},
    closeMenu = () => {},
    isMenuOpen = false,
    activeSection = "home",
  } = navigation || {};

  type ThemeTokens = {
    mode: ThemeMode;
    setTheme: (m: ThemeMode) => void;
    accent: ThemeAccent;
    setAccent: (a: ThemeAccent) => void;
    isDark: boolean;
    getAccentColors: () => {
      primary: string;
      secondary: string;
      tertiary: string;
      glow?: string;
      shadow?: string;
    };
  };
  const fallbackTheme: ThemeTokens = {
    mode: "dark",
    setTheme: () => {},
    accent: "purple",
    setAccent: () => {},
    isDark: true,
    getAccentColors: () => ({
      primary: "#8b5cf6",
      secondary: "#3b82f6",
      tertiary: "#ec4899",
      glow: "rgba(139, 92, 246, 0.6)",
      shadow: "rgba(139, 92, 246, 0.25)",
    }),
  };
  const {
    mode = "dark",
    setTheme = () => {},
    accent = "purple",
    setAccent = () => {},
    isDark = true,
    getAccentColors = fallbackTheme.getAccentColors,
  } = (theme as unknown as ThemeTokens) || fallbackTheme;
  const accentPalette = getAccentColors();

  // Section icons
  const sectionIcons: Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  > = {
    home: Home,
    projects: Code,
    skills: Workflow,
    about: User,
    contact: Mail,
  };

  // Theme icons
  const themeIcons: Record<
    ThemeMode,
    React.ComponentType<{ size?: number; className?: string }>
  > = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  // Accent colors
  const accentOptions: Array<{
    color: ThemeAccent;
    gradient: string;
    label: string;
  }> = [
    {
      color: "purple",
      gradient: "from-purple-400 to-purple-600",
      label: "Purple",
    },
    { color: "blue", gradient: "from-blue-400 to-blue-600", label: "Blue" },
    { color: "pink", gradient: "from-pink-400 to-pink-600", label: "Pink" },
    { color: "green", gradient: "from-green-400 to-green-600", label: "Green" },
    {
      color: "orange",
      gradient: "from-orange-400 to-orange-600",
      label: "Orange",
    },
  ];

  // Sections to render (no search filter on mobile)
  const filteredSections = sections;

  // Handle navigation
  const handleNavigation = (sectionId: string) => {
    try {
      navigateToSection(sectionId);
      closeMenu();
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Handle theme change
  const handleThemeChange = (newMode: ThemeMode) => {
    try {
      setTheme(newMode);
    } catch (error) {
      console.error("Theme change error:", error);
    }
  };

  // Handle accent change
  const handleAccentChange = (newAccent: ThemeAccent) => {
    try {
      setAccent(newAccent);
    } catch (error) {
      console.error("Accent change error:", error);
    }
  };

  // No search field; keep keyboard escape to close

  // Keyboard handling
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Animation variants
  const menuVariants = {
    closed: {
      x: "100%",
      opacity: 0.8,
      scale: 0.98,
      transition: { type: "spring" as const, stiffness: 500, damping: 42 },
    },
    open: {
      x: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 40,
        bounce: 0.2,
        staggerChildren: 0.06,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    closed: { y: 8, opacity: 0 },
    open: { y: 0, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-md z-40"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${accentPalette.primary}20, transparent 60%)`
                : `linear-gradient(135deg, ${accentPalette.primary}15, transparent 60%)`,
            }}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.nav
            ref={menuRef}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-sm z-50 ${
              isDark
                ? "bg-gray-950/90 border-l border-gray-800/40"
                : "bg-white/90 border-l border-gray-200/40"
            } backdrop-blur-xl shadow-2xl ${className}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              borderColor: `${accentPalette.primary}25`,
              boxShadow: `0 15px 45px ${
                accentPalette.shadow || "rgba(0,0,0,0.25)"
              }`,
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                variants={itemVariants}
                className={`flex items-center justify-between p-4 md:p-6 ${
                  isDark
                    ? "border-b border-gray-800/40"
                    : "border-b border-gray-200/40"
                }`}
              >
                <h1 className="text-xl font-semibold">Menu</h1>
                <button
                  onClick={closeMenu}
                  className={`p-3 rounded-xl transition-colors touch-manipulation ${
                    isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100/50"
                  }`}
                  aria-label="Close menu"
                  style={{
                    boxShadow: `0 0 0 0 rgba(0,0,0,0)`,
                  }}
                >
                  <X size={24} />
                </button>
              </motion.div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-5 md:pb-6 space-y-6 md:space-y-8">
                {/* Navigation Sections */}
                <motion.div variants={itemVariants}>
                  <div className="space-y-2">
                    {filteredSections.map((section) => {
                      const isActive = activeSection === section.id;
                      const IconComponent = sectionIcons[section.id] || Home;

                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => handleNavigation(section.id)}
                          className={`w-full flex items-center gap-4 px-4 py-3.5 md:py-4 rounded-xl
                            text-left transition-all duration-200 touch-manipulation ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : isDark
                                ? "hover:bg-gray-800/50"
                                : "hover:bg-gray-100/50"
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          aria-current={isActive ? "page" : undefined}
                          style={{
                            boxShadow: isActive
                              ? `0 8px 24px ${
                                  accentPalette.shadow || "rgba(0,0,0,0.25)"
                                }`
                              : undefined,
                            border: isActive
                              ? `1px solid ${accentPalette.primary}40`
                              : undefined,
                          }}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isActive
                                ? "bg-primary-foreground/20"
                                : isDark
                                ? "bg-gray-800/50"
                                : "bg-gray-100/50"
                            }`}
                            style={{
                              border: isActive
                                ? `1px solid ${accentPalette.primary}40`
                                : undefined,
                            }}
                          >
                            <IconComponent
                              size={20}
                              className={
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                isActive ? "text-primary-foreground" : ""
                              }`}
                            >
                              {section.name}
                            </div>
                            {section.description && (
                              <div
                                className={`text-sm mt-0.5 ${
                                  isActive
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {section.description}
                              </div>
                            )}
                          </div>
                          <ChevronRight
                            size={16}
                            className={
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground/50"
                            }
                            style={{ color: isActive ? undefined : undefined }}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Theme Settings */}
                <motion.div variants={itemVariants}>
                  {/* Theme Modes */}
                  <div className="mb-5 md:mb-6">
                    <div className="text-sm font-medium mb-3">Theme</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["light", "dark", "system"] as ThemeMode[]).map(
                        (themeMode) => {
                          const ThemeIcon = themeIcons[themeMode];
                          const isActive = mode === themeMode;

                          return (
                            <button
                              key={themeMode}
                              onClick={() => handleThemeChange(themeMode)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl
                              transition-all duration-200 text-xs touch-manipulation ${
                                isActive
                                  ? "bg-primary/20 text-primary border border-primary/30"
                                  : isDark
                                  ? "hover:bg-gray-800/50"
                                  : "hover:bg-gray-100/50"
                              }`}
                              aria-pressed={isActive}
                              style={{
                                boxShadow: isActive
                                  ? `0 6px 18px ${
                                      accentPalette.shadow || "rgba(0,0,0,0.2)"
                                    }`
                                  : undefined,
                              }}
                            >
                              <ThemeIcon size={20} />
                              <span className="capitalize font-medium">
                                {themeMode}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Accent Colors */}
                  <div>
                    <div className="text-sm font-medium mb-3">Accent Color</div>
                    <div className="flex gap-3">
                      {accentOptions.map((option) => (
                        <button
                          key={option.color}
                          onClick={() => handleAccentChange(option.color)}
                          className={`relative w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 transition-all duration-200
                            bg-gradient-to-br ${
                              option.gradient
                            } touch-manipulation ${
                            accent === option.color
                              ? "border-foreground scale-105 md:scale-110 shadow-lg"
                              : "border-transparent hover:border-foreground/30"
                          }`}
                          aria-label={`Set accent color to ${option.label}`}
                          aria-pressed={accent === option.color}
                          style={{
                            boxShadow:
                              accent === option.color
                                ? `0 8px 22px ${
                                    accentPalette.shadow || "rgba(0,0,0,0.2)"
                                  }`
                                : undefined,
                          }}
                        >
                          {accent === option.color && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
