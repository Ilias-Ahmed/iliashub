/**
 * Cross-browser haptic feedback utility
 * Provides tactile feedback on supported devices using the Vibration API
 * with graceful fallbacks for unsupported browsers
 */

// Extend Navigator interface for vendor prefixes
interface ExtendedNavigator extends Navigator {
  webkitVibrate?: (pattern: number | number[]) => boolean;
  mozVibrate?: (pattern: number | number[]) => boolean;
}

// Vibration patterns for different feedback types
export const HAPTIC_PATTERNS = {
  light: [10],
  medium: [20],
  heavy: [30],
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [30, 100, 30, 100, 30],
  selection: [5],
  impact: [15],
  notification: [10, 100, 10, 100, 10],
};

export type HapticPattern = keyof typeof HAPTIC_PATTERNS;

/**
 * Check if the Vibration API is supported in the current browser
 */
export const isHapticsSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  const nav = navigator as ExtendedNavigator;
  return "vibrate" in navigator || !!nav.mozVibrate || !!nav.webkitVibrate;
};

/**
 * Trigger haptic feedback with the specified pattern
 * @param pattern - The haptic pattern to play (light, medium, heavy, etc.)
 * @returns boolean indicating if vibration was triggered
 */
export const triggerHaptic = (pattern: HapticPattern = "light"): boolean => {
  if (!isHapticsSupported()) {
    return false;
  }

  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern];
    const nav = navigator as ExtendedNavigator;

    // Try standard vibrate API
    if ("vibrate" in navigator) {
      return navigator.vibrate(vibrationPattern);
    }

    // Try webkit prefixed version
    if (nav.webkitVibrate) {
      return nav.webkitVibrate(vibrationPattern);
    }

    // Try moz prefixed version
    if (nav.mozVibrate) {
      return nav.mozVibrate(vibrationPattern);
    }

    return false;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to trigger haptic feedback:", error);
    }
    return false;
  }
};

/**
 * Stop any ongoing vibration
 */
export const stopHaptic = (): void => {
  if (!isHapticsSupported()) return;

  try {
    navigator.vibrate(0);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to stop haptic feedback:", error);
    }
  }
};

/**
 * Custom vibration pattern
 * @param pattern - Array of vibration durations in milliseconds
 */
export const triggerCustomHaptic = (pattern: number[]): boolean => {
  if (!isHapticsSupported()) return false;

  try {
    return navigator.vibrate(pattern);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to trigger custom haptic:", error);
    }
    return false;
  }
};

/**
 * React hook for haptic feedback
 */
export const useHaptics = () => {
  const supported = isHapticsSupported();

  return {
    triggerHaptic: (pattern: HapticPattern = "light") => triggerHaptic(pattern),
    stopHaptic,
    triggerCustomHaptic,
    isSupported: supported,
  };
};

// Convenience functions for common interactions
export const haptics = {
  light: () => triggerHaptic("light"),
  medium: () => triggerHaptic("medium"),
  heavy: () => triggerHaptic("heavy"),
  success: () => triggerHaptic("success"),
  warning: () => triggerHaptic("warning"),
  error: () => triggerHaptic("error"),
  selection: () => triggerHaptic("selection"),
  impact: () => triggerHaptic("impact"),
  notification: () => triggerHaptic("notification"),
  stop: stopHaptic,
};
