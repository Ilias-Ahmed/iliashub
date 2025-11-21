import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode | string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * Reusable empty state component for when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "🔍",
  title,
  description,
  action,
  className = "",
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-8 ${className}`}
    >
      <div
        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ backgroundColor: `${accentColors.primary}20` }}
      >
        {typeof icon === "string" ? (
          <span className="text-3xl">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <h3
        className="text-xl font-semibold mb-4"
        style={{ color: isDark ? "#ffffff" : "#1f2937" }}
      >
        {title}
      </h3>
      <p
        className="max-w-md mx-auto mb-6"
        style={{
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
        }}
      >
        {description}
      </p>
      {action && (
        <motion.button
          onClick={action.onClick}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: accentColors.primary,
            color: "white",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};
