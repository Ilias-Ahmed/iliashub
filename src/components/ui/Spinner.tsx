import { useTheme } from "@/contexts/ThemeContext";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

/**
 * Reusable loading spinner component with theme support
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full animate-spin border-transparent ${className}`}
      style={{
        borderTopColor: accentColors.primary,
        borderRightColor: accentColors.secondary,
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

interface LoadingStateProps {
  height?: string;
  message?: string;
  className?: string;
}

/**
 * Full loading state component with spinner and message
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  height = "400px",
  message = "Loading...",
  className = "",
}) => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-border/30 ${className}`}
      style={{ height }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-8 h-8 rounded-full animate-spin border-2 border-transparent"
          style={{
            borderTopColor: accentColors.primary,
            borderRightColor: accentColors.secondary,
          }}
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
