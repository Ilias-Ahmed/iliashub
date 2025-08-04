import { useTheme } from "@/contexts/ThemeContext";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { Skill } from "./types";

interface SkillComparisonChartProps {
  skills: Skill[];
  width: number;
  height: number;
  title?: string;
}

const SkillComparisonChart: React.FC<SkillComparisonChartProps> = ({
  skills,
  width,
  height,
  title = "Skills Comparison",
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const margin = { top: 40, right: 40, bottom: 80, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Prepare data with multiple metrics
  const comparisonData = useMemo(
    () =>
      skills.map((skill, index) => ({
        ...skill,
        shortName:
          skill.name.length > 15
            ? skill.name.substring(0, 15) + "..."
            : skill.name,
        color: [
          accentColors.primary,
          accentColors.secondary,
          "#10b981",
          "#f59e0b",
          "#ef4444",
        ][index % 5],
      })),
    [skills, accentColors]
  );

  // Scales
  const xScale = scaleBand({
    domain: comparisonData.map((skill) => skill.shortName),
    range: [0, innerWidth],
    padding: 0.3,
  });

  const yScale = scaleLinear({
    domain: [0, 100],
    range: [innerHeight, 0],
  });

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select skills to compare</p>
      </div>
    );
  }

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
          {comparisonData.map((skill, index) => (
            <linearGradient
              key={skill.id}
              id={`gradient-${skill.id}`}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor={skill.color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={skill.color} stopOpacity={1} />
            </linearGradient>
          ))}
          <filter id="comparison-glow">
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
              opacity={0.6}
            />
          ))}

          {/* Bars */}
          {comparisonData.map((skill, index) => {
            const barHeight = innerHeight - yScale(skill.level);
            const barX = xScale(skill.shortName);
            const barY = yScale(skill.level);
            const barWidth = xScale.bandwidth();

            return (
              <motion.g
                key={skill.id}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
              >
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#gradient-${skill.id})`}
                  stroke={skill.color}
                  strokeWidth={2}
                  filter="url(#comparison-glow)"
                  rx={6}
                  className=" transition-all duration-300 hover:brightness-110"
                />

                {/* Proficiency label */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  x={(barX || 0) + barWidth / 2}
                  y={barY - 8}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  fill={skill.color}
                >
                  {skill.level}%
                </motion.text>

                {/* Experience indicator */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
                  cx={(barX || 0) + barWidth / 2}
                  cy={barY + barHeight + 15}
                  r={Math.max(2, skill.yearsExperience)}
                  fill={skill.color}
                  opacity={0.7}
                />

                {/* Projects count */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.2 }}
                  x={(barX || 0) + barWidth / 2}
                  y={barY + barHeight + 30}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isDark ? "#d1d5db" : "#6b7280"}
                >
                  {skill.projects} proj
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
            label="Proficiency Level (%)"
            labelProps={{
              fill: isDark ? "#d1d5db" : "#374151",
              fontSize: 12,
              textAnchor: "middle",
            }}
          />
        </Group>
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <h4 className="text-sm font-semibold mb-2 text-foreground">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
            <span className="text-muted-foreground">Proficiency Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-70"></div>
            <span className="text-muted-foreground">Years Experience</span>
          </div>
          <div className="text-muted-foreground">Projects count below bars</div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {[
          {
            label: "Avg Level",
            value:
              Math.round(
                skills.reduce((acc, skill) => acc + skill.level, 0) /
                  skills.length
              ) + "%",
            color: accentColors.primary,
          },
          {
            label: "Total Exp",
            value:
              skills.reduce((acc, skill) => acc + skill.yearsExperience, 0) +
              "y",
            color: accentColors.secondary,
          },
          {
            label: "Total Projects",
            value: skills.reduce((acc, skill) => acc + skill.projects, 0),
            color: "#10b981",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="p-3 rounded-lg border backdrop-blur-sm"
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-lg font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div
              className="text-xs"
              style={{
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillComparisonChart;
