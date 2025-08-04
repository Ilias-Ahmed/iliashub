import { useTheme } from "@/contexts/ThemeContext";
import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { Skill } from "./types";

interface SkillTrendChartProps {
  skills: Skill[];
  width: number;
  height: number;
}

const SkillTrendChart: React.FC<SkillTrendChartProps> = ({
  skills,
  width,
  height,
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Process data by category
  const categoryData = useMemo(() => {
    const categories = Array.from(
      new Set(skills.map((skill) => skill.category))
    );

    return categories
      .map((category) => {
        const categorySkills = skills.filter(
          (skill) => skill.category === category
        );
        const avgLevel =
          categorySkills.reduce((acc, skill) => acc + skill.level, 0) /
          categorySkills.length;
        const totalProjects = categorySkills.reduce(
          (acc, skill) => acc + skill.projects,
          0
        );

        return {
          category,
          avgLevel: Math.round(avgLevel),
          totalProjects,
          skillCount: categorySkills.length,
        };
      })
      .sort((a, b) => b.avgLevel - a.avgLevel);
  }, [skills]);

  // Scales
  const xScale = scaleLinear({
    domain: [0, categoryData.length - 1],
    range: [0, innerWidth],
  });

  const yScale = scaleLinear({
    domain: [0, 100],
    range: [innerHeight, 0],
  });

  const colorScale = scaleOrdinal({
    domain: categoryData.map((d) => d.category),
    range: [
      accentColors.primary,
      accentColors.secondary,
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
    ],
  });

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColors.primary} />
            <stop offset="100%" stopColor={accentColors.secondary} />
          </linearGradient>
          <filter id="trend-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Group left={margin.left} top={margin.top}>
          {/* Grid lines */}
          {[25, 50, 75, 100].map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={isDark ? "#374151" : "#e5e7eb"}
              strokeWidth={1}
              strokeDasharray="2,2"
              opacity={0.5}
            />
          ))}

          {/* Trend line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={LinePath({
              data: categoryData,
              x: (_, i) => xScale(i),
              y: (d) => yScale(d.avgLevel),
            })}
            stroke="url(#trendGradient)"
            strokeWidth={3}
            fill="none"
            filter="url(#trend-glow)"
            strokeLinecap="round"
          />

          {/* Data points */}
          {categoryData.map((item, index) => (
            <motion.g
              key={item.category}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
            >
              <circle
                cx={xScale(index)}
                cy={yScale(item.avgLevel)}
                r={6 + item.skillCount}
                fill={colorScale(item.category)}
                stroke="white"
                strokeWidth={2}
                filter="url(#trend-glow)"
                className="cursor-pointer"
              />

              {/* Category label */}
              <text
                x={xScale(index)}
                y={yScale(item.avgLevel) - 15}
                textAnchor="middle"
                fontSize={10}
                fontWeight="bold"
                fill={colorScale(item.category)}
              >
                {item.avgLevel}%
              </text>
            </motion.g>
          ))}

          {/* Axes */}
          <AxisLeft
            scale={yScale}
            stroke={isDark ? "#6b7280" : "#9ca3af"}
            tickStroke={isDark ? "#6b7280" : "#9ca3af"}
            tickLabelProps={{
              fill: isDark ? "#d1d5db" : "#6b7280",
              fontSize: 10,
              textAnchor: "end",
              dx: -12,
              dy: 3,
            }}
            numTicks={5}
          />
        </Group>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {categoryData.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs border"
            style={{
              backgroundColor: isDark
                ? "rgba(0,0,0,0.3)"
                : "rgba(255,255,255,0.8)",
              borderColor: colorScale(item.category),
              color: colorScale(item.category),
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colorScale(item.category) }}
            />
            <span>
              {item.category} ({item.skillCount})
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillTrendChart;
