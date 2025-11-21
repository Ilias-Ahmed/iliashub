import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  showGradientLine?: boolean;
  className?: string;
  isInView?: boolean;
}

/**
 * Reusable section header component with consistent styling
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  showGradientLine = true,
  className = "",
  isInView = true,
}) => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.6 }}
      className={`mb-10 text-center ${className}`}
    >
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      )}
      {subtitle && (
        <p className="text-lg text-muted-foreground mb-6">{subtitle}</p>
      )}
      {showGradientLine && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 160, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="h-1 rounded-full mx-auto"
          style={{
            background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary}, #10b981)`,
          }}
        />
      )}
    </motion.div>
  );
};
