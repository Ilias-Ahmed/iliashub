import { useTheme } from "@/contexts/ThemeContext";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { Pie } from "@visx/shape";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { Skill } from "./types";

interface CategoryDistributionChartProps {
  skills: Skill[];
  width: number;
  height: number;
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  skills,
  width,
  height,
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  // Calculate category distribution
  const categoryData = useMemo(() => {
    const categoryMap = new Map<
      string,
      { count: number; avgLevel: number; totalLevel: number }
    >();

    skills.forEach((skill) => {
      const current = categoryMap.get(skill.category) || {
        count: 0,
        avgLevel: 0,
        totalLevel: 0,
      };
      categoryMap.set(skill.category, {
        count: current.count + 1,
        totalLevel: current.totalLevel + skill.level,
        avgLevel: 0, // Will calculate after
      });
    });

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      avgLevel: Math.round(data.totalLevel / data.count),
      percentage: (data.count / skills.length) * 100,
    }));
  }, [skills]);

  // Color scale
  const colorScale = scaleOrdinal({
    domain: categoryData.map((d) => d.category),
    range: [
      accentColors.primary,
      accentColors.secondary,
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
      "#84cc16",
    ],
  });

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <defs>
          {categoryData.map((item) => (
            <radialGradient
              key={item.category}
              id={`gradient-${item.category}`}
              cx="50%"
              cy="50%"
            >
              <stop
                offset="0%"
                stopColor={colorScale(item.category)}
                stopOpacity={0.8}
              />
              <stop
                offset="100%"
                stopColor={colorScale(item.category)}
                stopOpacity={0.4}
              />
            </radialGradient>
          ))}
        </defs>

        <Group top={centerY} left={centerX}>
          <Pie
            data={categoryData}
            pieValue={(d) => d.count}
            outerRadius={radius}
            innerRadius={radius * 0.4}
            cornerRadius={3}
            padAngle={0.02}
          >
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const [centroidX, centroidY] = pie.path.centroid(arc);
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
                const arcPath = pie.path(arc) || "";

                return (
                  <motion.g key={arc.data.category}>
                    <motion.path
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      d={arcPath}
                      fill={`url(#gradient-${arc.data.category})`}
                      stroke={colorScale(arc.data.category)}
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-300 hover:brightness-110"
                      style={{
                        filter: `drop-shadow(0 4px 8px ${colorScale(
                          arc.data.category
                        )}40)`,
                      }}
                    />

                    {hasSpaceForLabel && (
                      <motion.text
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                        x={centroidX}
                        y={centroidY}
                        dy="0.33em"
                        fontSize={12}
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="white"
                      >
                        {arc.data.count}
                      </motion.text>
                    )}
                  </motion.g>
                );
              });
            }}
          </Pie>

          {/* Center circle with total */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            r={radius * 0.35}
            fill={isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)"}
            stroke={accentColors.primary}
            strokeWidth={2}
          />

          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            textAnchor="middle"
            dy="-0.5em"
            fontSize={24}
            fontWeight="bold"
            fill={accentColors.primary}
          >
            {skills.length}
          </motion.text>

          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            textAnchor="middle"
            dy="1em"
            fontSize={12}
            fill={isDark ? "#d1d5db" : "#6b7280"}
          >
            Total Skills
          </motion.text>
        </Group>
      </svg>

      {/* Legend */}
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50 space-y-2">
          <h4 className="text-sm font-semibold mb-3 text-foreground">
            Categories
          </h4>
          {categoryData.map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colorScale(item.category) }}
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">
                  {item.category}
                </div>
                <div className="text-muted-foreground">
                  {item.count} skills • {item.avgLevel}% avg
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
