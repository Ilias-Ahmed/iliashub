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
  Search,
  Sun,
  User,
  Workflow,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface MobileNavigationMenuProps {
  className?: string;
}

const MobileNavigationMenu: React.FC<MobileNavigationMenuProps> = ({
  className = "",
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Safe destructuring with fallbacks
  const {
    sections = [],
    navigateToSection = () => {},
    closeMenu = () => {},
    isMenuOpen = false,
    activeSection = "home",
  } = navigation || {};

  const {
    mode = "dark",
    setTheme = () => {},
    accent = "purple",
    setAccent = () => {},
    isDark = true,
  } = theme || {};

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
  const accentColors: Array<{
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

  // Filter sections based on search
  const filteredSections = sections.filter(
    (section) =>
      !searchQuery ||
      section.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Auto-focus search on open
  useEffect(() => {
    if (isMenuOpen) {
      const searchInput = menuRef.current?.querySelector(
        'input[type="search"]'
      ) as HTMLInputElement;
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
    }
  }, [isMenuOpen]);

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
      transition: { type: "spring" as const, stiffness: 400, damping: 40 },
    },
    open: {
      x: "0%",
      transition: { type: "spring" as const, stiffness: 400, damping: 40 },
    },
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 },
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
            className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 ${
              isDark
                ? "bg-gray-950/95 border-l border-gray-800/50"
                : "bg-white/95 border-l border-gray-200/50"
            } backdrop-blur-xl shadow-2xl ${className}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                variants={itemVariants}
                className={`flex items-center justify-between p-6 ${
                  isDark
                    ? "border-b border-gray-800/50"
                    : "border-b border-gray-200/50"
                }`}
              >
                <h1 className="text-xl font-semibold">Menu</h1>
                <button
                  onClick={closeMenu}
                  className={`p-3 rounded-xl transition-colors touch-manipulation ${
                    isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100/50"
                  }`}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </motion.div>

              {/* Search */}
              <motion.div variants={itemVariants} className="p-6 pt-4">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border text-base transition-all
                      focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        isDark
                          ? "bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
                          : "bg-gray-50/50 border-gray-200/50 text-gray-900 placeholder-gray-500"
                      }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8">
                {/* Navigation Sections */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    Navigation
                  </h2>
                  <div className="space-y-2">
                    {filteredSections.map((section) => {
                      const isActive = activeSection === section.id;
                      const IconComponent = sectionIcons[section.id] || Home;

                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => handleNavigation(section.id)}
                          className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl
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
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isActive
                                ? "bg-primary-foreground/20"
                                : isDark
                                ? "bg-gray-800/50"
                                : "bg-gray-100/50"
                            }`}
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
                                className={`text-sm mt-1 ${
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
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground/50"
                            }
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Theme Settings */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    Appearance
                  </h2>

                  {/* Theme Modes */}
                  <div className="mb-6">
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
                      {accentColors.map((option) => (
                        <button
                          key={option.color}
                          onClick={() => handleAccentChange(option.color)}
                          className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200
                            bg-gradient-to-br ${
                              option.gradient
                            } touch-manipulation ${
                            accent === option.color
                              ? "border-foreground scale-110 shadow-lg"
                              : "border-transparent hover:border-foreground/30"
                          }`}
                          aria-label={`Set accent color to ${option.label}`}
                          aria-pressed={accent === option.color}
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

export default MobileNavigationMenu;
