import { useTheme } from "@/contexts/ThemeContext";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { Skill } from "./types";

interface SkillBarChartProps {
  skills: Skill[];
  width: number;
  height: number;
  title?: string;
}

const SkillBarChart: React.FC<SkillBarChartProps> = ({
  skills,
  width,
  height,
  title = "Skills Proficiency",
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Sort skills by level and take top 10
  const topSkills = useMemo(
    () =>
      skills
        .sort((a, b) => b.level - a.level)
        .slice(0, 10)
        .map((skill) => ({
          ...skill,
          shortName:
            skill.name.length > 12
              ? skill.name.substring(0, 12) + "..."
              : skill.name,
        })),
    [skills]
  );

  // Scales
  const xScale = scaleBand({
    domain: topSkills.map((skill) => skill.shortName),
    range: [0, innerWidth],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [0, 100],
    range: [innerHeight, 0],
  });

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <h3
          className="text-lg font-bold text-center"
          style={{ color: isDark ? "#ffffff" : "#1f2937" }}
        >
          {title}
        </h3>
      </motion.div>

      <svg width={width} height={height}>
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={accentColors.secondary} />
            <stop offset="100%" stopColor={accentColors.primary} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Group left={margin.left} top={margin.top}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={isDark ? "#374151" : "#e5e7eb"}
              strokeWidth={1}
              strokeDasharray={tick === 0 ? "none" : "2,2"}
            />
          ))}

          {/* Bars */}
          {topSkills.map((skill, index) => {
            const barHeight = innerHeight - yScale(skill.level);
            const barX = xScale(skill.shortName);
            const barY = yScale(skill.level);

            return (
              <motion.g
                key={skill.id}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Bar
                  x={barX}
                  y={barY}
                  width={xScale.bandwidth()}
                  height={barHeight}
                  fill="url(#barGradient)"
                  stroke={accentColors.primary}
                  strokeWidth={1}
                  filter="url(#glow)"
                  rx={4}
                  className="cursor-pointer transition-all duration-300 hover:brightness-110"
                />

                {/* Value labels */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  x={(barX || 0) + xScale.bandwidth() / 2}
                  y={barY - 8}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  fill={accentColors.primary}
                >
                  {skill.level}%
                </motion.text>
              </motion.g>
            );
          })}

          {/* Axes */}
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            stroke={isDark ? "#6b7280" : "#374151"}
            tickStroke={isDark ? "#6b7280" : "#374151"}
            tickLabelProps={{
              fill: isDark ? "#d1d5db" : "#374151",
              fontSize: 11,
              textAnchor: "middle",
              angle: -45,
              dx: -10,
              dy: 0,
            }}
          />

          <AxisLeft
            scale={yScale}
            stroke={isDark ? "#6b7280" : "#374151"}
            tickStroke={isDark ? "#6b7280" : "#374151"}
            tickLabelProps={{
              fill: isDark ? "#d1d5db" : "#374151",
              fontSize: 11,
              textAnchor: "end",
              dx: -12,
              dy: 3,
            }}
            numTicks={5}
          />
        </Group>
      </svg>
    </div>
  );
};

export default SkillBarChart;
