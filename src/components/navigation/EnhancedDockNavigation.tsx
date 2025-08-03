import { useNavigation } from "@/contexts/NavigationContext";
import {
  useTheme,
  type ThemeAccent,
  type ThemeMode,
} from "@/contexts/ThemeContext";
import {
  CheckCircle,
  ChevronUp,
  Code,
  Command,
  Home,
  Mail,
  Monitor,
  Moon,
  Sun,
  User,
  Workflow,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dock, DockIcon, DockItem, DockLabel } from "./Dock";

interface EnhancedDockNavigationProps {
  className?: string;
  showThemeControls?: boolean;
  showCommandPalette?: boolean;
  showSystemTray?: boolean;
  position?: "bottom" | "top";
}

// Configuration constants
const SECTION_ICONS = [
  { id: "home", name: "Home", icon: Home },
  { id: "projects", name: "Projects", icon: Code },
  { id: "skills", name: "Skills", icon: Workflow },
  { id: "about", name: "About", icon: User },
  { id: "contact", name: "Contact", icon: Mail },
] as const;

const THEME_ICONS: Record<
  ThemeMode,
  React.ComponentType<{ className?: string }>
> = {
  dark: Moon,
  light: Sun,
  system: Monitor,
};

const ACCENT_COLORS = [
  { name: "purple", color: "bg-purple-500", label: "Purple" },
  { name: "blue", color: "bg-blue-500", label: "Blue" },
  { name: "pink", color: "bg-pink-500", label: "Pink" },
  { name: "green", color: "bg-green-500", label: "Green" },
  { name: "orange", color: "bg-orange-500", label: "Orange" },
] as const;

const EnhancedDockNavigation: React.FC<EnhancedDockNavigationProps> = ({
  className = "",
  showThemeControls = true,
  showCommandPalette = true,
  showSystemTray = true,
  position = "bottom",
}) => {
  // Hooks
  const navigation = useNavigation();
  const theme = useTheme();
  const systemTrayRef = useRef<HTMLDivElement>(null);

  // State
  const [isSystemTrayOpen, setIsSystemTrayOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Safe destructuring with fallbacks
  const {
    activeSection = "home",
    navigateToSection = () => {},
    sections = [],
  } = navigation || {};

  const {
    mode = "dark",
    accent = "purple",
    setTheme = () => {},
    setAccent = () => {},
    isDark = true,
  } = theme || {};

  // Memoized available sections to prevent unnecessary re-renders
  const availableSections = useMemo(() => {
    return SECTION_ICONS.filter((iconConfig) =>
      sections.some((section) => section.id === iconConfig.id)
    );
  }, [sections]);

  // Memoized haptic feedback function
  const hapticFeedback = useCallback(
    (intensity: "light" | "medium" | "heavy" = "medium") => {
      try {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          const patterns = { light: 20, medium: 50, heavy: 100 };
          navigator.vibrate(patterns[intensity]);
        }
      } catch (error) {
        console.debug("Haptic feedback not available:", error);
      }
    },
    []
  );

  // Navigation handler
  const handleNavigation = useCallback(
    (sectionId: string) => {
      try {
        navigateToSection(sectionId);
        hapticFeedback("light");
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    },
    [navigateToSection, hapticFeedback]
  );

  // Theme handlers
  const handleThemeChange = useCallback(
    (newMode: ThemeMode) => {
      setTheme(newMode);
      hapticFeedback("light");
    },
    [setTheme, hapticFeedback]
  );

  const handleAccentChange = useCallback(
    (newAccent: ThemeAccent) => {
      setAccent(newAccent);
      hapticFeedback("light");
    },
    [setAccent, hapticFeedback]
  );

  // Time update effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Click outside to close system tray
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        systemTrayRef.current &&
        !systemTrayRef.current.contains(event.target as Node)
      ) {
        setIsSystemTrayOpen(false);
      }
    };

    if (isSystemTrayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSystemTrayOpen]);

  return (
    <div
      className={`fixed ${position === "bottom" ? "bottom-4" : "top-4"}
        left-1/2 transform -translate-x-1/2 z-[9999] ${className}`}
    >
      <Dock
        className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl"
        magnification={60}
        distance={120}
      >
        {/* Navigation Items */}
        {availableSections.map(({ id, name, icon: IconComponent }) => (
          <DockItem key={id} onClick={() => handleNavigation(id)}>
            <DockLabel>{name}</DockLabel>
            <DockIcon>
              <div
                className={`flex h-full w-full items-center justify-center rounded-full transition-all duration-200 ${
                  activeSection === id
                    ? "bg-primary/20 text-primary border-2 border-primary/30 shadow-lg"
                    : isDark
                    ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border-2 border-transparent hover:border-neutral-600"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-900 border-2 border-transparent hover:border-neutral-400"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                {/* Active indicator dot */}
                {activeSection === id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
            </DockIcon>
          </DockItem>
        ))}

        {/* System Tray */}
        {showSystemTray && (
          <DockItem onClick={() => setIsSystemTrayOpen(!isSystemTrayOpen)}>
            <DockLabel>
              {isSystemTrayOpen ? "Close System Tray" : "System Tray"}
            </DockLabel>
            <DockIcon>
              <div
                className={`flex h-full w-full items-center justify-center rounded-full transition-all duration-200 ${
                  isDark
                    ? "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border-2 border-transparent hover:border-neutral-600"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-neutral-900 border-2 border-transparent hover:border-neutral-400"
                }`}
              >
                <ChevronUp
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isSystemTrayOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </DockIcon>
          </DockItem>
        )}
      </Dock>

      {/* System Tray Menu */}
      {showSystemTray && (
        <AnimatePresence>
          {isSystemTrayOpen && (
            <div
              ref={systemTrayRef}
              className={`absolute ${
                position === "bottom" ? "bottom-full mb-4" : "top-full mt-4"
              } left-1/2 transform -translate-x-1/2 w-72
                bg-popover/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl
                p-4 z-50`}
            >
              <div className="space-y-4">
                {/* Time Display */}
                <div className="text-center">
                  <div className="text-lg font-mono font-medium">
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>

                {/* Theme Selection */}
                {showThemeControls && (
                  <div className="mb-4">
                    <div className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                      Appearance
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["light", "dark", "system"] as ThemeMode[]).map(
                        (themeMode) => {
                          const ThemeIcon = THEME_ICONS[themeMode];
                          const isActive = mode === themeMode;

                          return (
                            <button
                              key={themeMode}
                              onClick={() => handleThemeChange(themeMode)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-lg
                              transition-all duration-200 text-xs hover:scale-105 ${
                                isActive
                                  ? "bg-primary/20 text-primary border border-primary/30"
                                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
                              }`}
                              aria-label={`Switch to ${themeMode} theme`}
                            >
                              <ThemeIcon className="w-4 h-4" />
                              <span className="capitalize">{themeMode}</span>
                              {isActive && <CheckCircle className="w-3 h-3" />}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {/* Accent Colors */}
                <div className="mb-4">
                  <div className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                    Accent Color
                  </div>
                  <div className="flex gap-2 justify-center">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => handleAccentChange(color.name)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110
                          ${color.color} ${
                          accent === color.name
                            ? "border-foreground scale-110 shadow-lg"
                            : "border-transparent hover:border-foreground/50"
                        }`}
                        aria-label={`Set accent color to ${color.label}`}
                      >
                        {accent === color.name && (
                          <CheckCircle className="absolute inset-0 m-auto w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Command Palette Trigger */}
                {showCommandPalette && (
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("openCommandPalette")
                      );
                      setIsSystemTrayOpen(false);
                      hapticFeedback("light");
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg
                      hover:bg-accent transition-all duration-200 text-left hover:scale-[1.02]"
                  >
                    <Command className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Command Palette</div>
                      <div className="text-xs text-muted-foreground">
                        Quick navigation and search
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-accent/20 px-2 py-1 rounded">
                      {typeof navigator !== "undefined" &&
                      navigator.platform?.includes("Mac")
                        ? "⌘K"
                        : "Ctrl+K"}
                    </div>
                  </button>
                )}
              </div>

              {/* Arrow indicator */}
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 ${
                  position === "bottom" ? "top-full" : "bottom-full"
                } w-0 h-0 border-l-4 border-r-4 border-transparent ${
                  position === "bottom"
                    ? "border-t-4 border-t-border"
                    : "border-b-4 border-b-border"
                }`}
              />
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default React.memo(EnhancedDockNavigation);
