/**
 * Application-wide constants and configuration values
 * Centralized location for magic numbers and repeated values
 */

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 600,
  VERY_SLOW: 1000,
} as const;

// Animation delays (in milliseconds)
export const ANIMATION_DELAY = {
  NONE: 0,
  SHORT: 150,
  MEDIUM: 300,
  LONG: 600,
} as const;

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  BACKGROUND: -1,
  CONTENT: 0,
  DROPDOWN: 10,
  STICKY: 20,
  OVERLAY: 30,
  MODAL: 40,
  POPOVER: 50,
  TOOLTIP: 60,
} as const;

// Loading/Debounce timeouts (in milliseconds)
export const TIMEOUTS = {
  DEBOUNCE_SHORT: 150,
  DEBOUNCE_DEFAULT: 300,
  DEBOUNCE_LONG: 500,
  AUTO_HIDE: 3000,
  AUTO_STOP: 5000,
  THROTTLE: 100,
} as const;

// Scroll behavior
export const SCROLL = {
  OFFSET: 80, // Header offset for scroll navigation
  SMOOTH_DURATION: 800,
  PROGRESS_THRESHOLD: 0.003,
} as const;

// Limits
export const LIMITS = {
  MAX_COMPARISON_ITEMS: 3,
  MAX_SEARCH_RESULTS: 50,
  MIN_SEARCH_LENGTH: 2,
} as const;

// Chart dimensions
export const CHART = {
  MOBILE_WIDTH: 350,
  TABLET_WIDTH: 500,
  DESKTOP_WIDTH: 600,
  MOBILE_HEIGHT: 280,
  TABLET_HEIGHT: 350,
  DESKTOP_HEIGHT: 400,
} as const;

// File paths
export const PATHS = {
  RESUME_PDF: "/resume.pdf",
  FONTS_DIR: "/fonts",
  IMAGES_DIR: "/images",
  MODELS_DIR: "/models",
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "theme",
  ACCENT: "accent",
  PREFERENCES: "preferences",
} as const;

// View modes
export const VIEW_MODES = {
  GRID: "grid",
  MASTERY: "mastery",
  COMPARISON: "comparison",
} as const;

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[\d\s-()]+$/,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: "Network error occurred. Please try again.",
  VALIDATION: "Please check your input and try again.",
  PERMISSION_DENIED:
    "Permission denied. Please grant the required permissions.",
  NOT_FOUND: "The requested resource was not found.",
  GENERIC: "An error occurred. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: "Form submitted successfully!",
  EMAIL_SENT: "Email sent successfully!",
  SAVED: "Changes saved successfully!",
} as const;
