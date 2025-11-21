import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import React, { useState } from "react";
import CategoryDistributionChart from "./CategoryDistributionChart";
import SkillBarChart from "./SkillBarChart";
import SkillRadarChart from "./SkillRadarChart";
import SkillTrendChart from "./SkillTrendChart";
import { Skill } from "./types";
// Using simple SVG icons instead of heroicons
const RadarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <circle cx="12" cy="12" r="6" strokeWidth={2} />
    <circle cx="12" cy="12" r="2" strokeWidth={2} />
    <path d="M12 2v20M2 12h20" strokeWidth={1} />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const PieChartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
    />
  </svg>
);

const TrendIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

interface VisxSkillsVisualizationProps {
  skills: Skill[];
  className?: string;
}

type VisualizationType = "radar" | "bar" | "distribution" | "trend";

const VisxSkillsVisualization: React.FC<VisxSkillsVisualizationProps> = ({
  skills,
  className = "",
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const [activeViz, setActiveViz] = useState<VisualizationType>("radar");

  const visualizations = [
    {
      id: "radar" as const,
      name: "Skill Radar",
      icon: RadarIcon,
      description: "Interactive radar chart showing skill proficiency levels",
    },
    {
      id: "bar" as const,
      name: "Top Skills",
      icon: ChartBarIcon,
      description: "Bar chart of highest proficiency skills",
    },
    {
      id: "distribution" as const,
      name: "Categories",
      icon: PieChartIcon,
      description: "Distribution of skills across categories",
    },
    {
      id: "trend" as const,
      name: "Trends",
      icon: TrendIcon,
      description: "Category trends and progression",
    },
  ];

  const renderVisualization = () => {
    // Responsive chart dimensions
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;

    const chartWidth = isMobile ? Math.min(350, window.innerWidth - 80) : isTablet ? 500 : 600;
    const chartHeight = isMobile ? 280 : isTablet ? 350 : 400;

    switch (activeViz) {
      case "radar":
        return (
          <SkillRadarChart
            skills={skills}
            width={chartWidth}
            height={chartHeight}
          />
        );
      case "bar":
        return (
          <SkillBarChart
            skills={skills}
            width={chartWidth}
            height={chartHeight}
            title="Top 10 Skills by Proficiency"
          />
        );
      case "distribution":
        return (
          <CategoryDistributionChart
            skills={skills}
            width={chartWidth}
            height={chartHeight}
          />
        );
      case "trend":
        return (
          <SkillTrendChart
            skills={skills}
            width={chartWidth}
            height={chartHeight}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        {/* Visualization Selector */}
        <div className="flex justify-center mb-8">
          <div
            className="flex flex-wrap sm:flex-nowrap rounded-xl p-1 backdrop-blur-sm border max-w-full overflow-hidden"
            style={{
              backgroundColor: isDark
                ? "rgba(0,0,0,0.5)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            {visualizations.map((viz) => {
              const isActive = activeViz === viz.id;
              const Icon = viz.icon;

              return (
                <button
                  key={viz.id}
                  onClick={() => setActiveViz(viz.id)}
                  className={`
                    relative px-3 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-auto
                    ${
                      isActive
                        ? "text-white shadow-lg"
                        : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                  style={{
                    backgroundColor: isActive
                      ? accentColors.primary
                      : "transparent",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeVizBg"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${accentColors.primary}, ${accentColors.secondary})`,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 flex-shrink-0" />
                  <div className="relative z-10 min-w-0 text-left">
                    <div className="font-medium text-xs sm:text-sm truncate">{viz.name}</div>
                    <div className="text-xs opacity-75 hidden sm:block truncate">{viz.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visualization Container */}
        <motion.div
          key={activeViz}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center w-full"
        >
          <div
            className="p-4 md:p-8 rounded-2xl border backdrop-blur-sm shadow-2xl relative overflow-hidden w-full max-w-full"
            style={{
              backgroundColor: isDark
                ? "rgba(0,0,0,0.3)"
                : "rgba(255,255,255,0.9)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${accentColors.primary}, transparent 50%),
                            radial-gradient(circle at 70% 60%, ${accentColors.secondary}, transparent 50%)`,
              }}
            />

            <div className="relative z-10 w-full overflow-x-auto flex justify-center">{renderVisualization()}</div>

            {/* Decorative elements */}
            <div
              className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-60"
              style={{ backgroundColor: accentColors.primary }}
            />
            <div
              className="absolute bottom-4 left-4 w-1 h-1 rounded-full opacity-40"
              style={{ backgroundColor: accentColors.secondary }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VisxSkillsVisualization;
