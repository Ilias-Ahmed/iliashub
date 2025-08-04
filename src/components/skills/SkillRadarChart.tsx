import { useTheme } from "@/contexts/ThemeContext";
import { Group } from "@visx/group";
import { Point } from "@visx/point";
import { scaleLinear } from "@visx/scale";
import { Line } from "@visx/shape";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import { Skill } from "./types";

interface SkillRadarChartProps {
  skills: Skill[];
  width: number;
  height: number;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  skills,
  width,
  height,
}) => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  // Filter to top skills for better visualization
  const topSkills = useMemo(
    () =>
      skills.slice(0, 8).map((skill, index) => ({
        ...skill,
        angle: (index / skills.length) * 2 * Math.PI,
      })),
    [skills]
  );

  const scale = scaleLinear({
    domain: [0, 100],
    range: [0, radius],
  });

  // Generate concentric circles for grid
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="relative">
      <svg width={width} height={height}>
        {/* Background gradient */}
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor={`${accentColors.primary}10`} />
            <stop offset="100%" stopColor={`${accentColors.primary}02`} />
          </radialGradient>
          <linearGradient
            id="skillGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={accentColors.primary} />
            <stop offset="100%" stopColor={accentColors.secondary} />
          </linearGradient>
        </defs>

        <Group top={centerY} left={centerX}>
          {/* Background circle */}
          <circle
            r={radius}
            fill="url(#radarGradient)"
            stroke={`${accentColors.primary}20`}
            strokeWidth={1}
          />

          {/* Grid circles */}
          {gridLevels.map((level, i) => (
            <circle
              key={level}
              r={scale(level)}
              fill="transparent"
              stroke={`${accentColors.primary}${20 + i * 10}`}
              strokeWidth={1}
              strokeDasharray={i === gridLevels.length - 1 ? "none" : "2,2"}
            />
          ))}

          {/* Grid lines */}
          {topSkills.map((skill, i) => {
            const angle = (i / topSkills.length) * 2 * Math.PI - Math.PI / 2;
            const lineEnd = new Point({
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            });

            return (
              <Line
                key={`grid-line-${i}`}
                from={new Point({ x: 0, y: 0 })}
                to={lineEnd}
                stroke={`${accentColors.primary}30`}
                strokeWidth={1}
              />
            );
          })}

          {/* Skill data polygon */}
          <motion.polygon
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1, delay: 0.5 }}
            points={topSkills
              .map((skill) => {
                const angle = skill.angle - Math.PI / 2;
                const r = scale(skill.level);
                return `${Math.cos(angle) * r},${Math.sin(angle) * r}`;
              })
              .join(" ")}
            fill="url(#skillGradient)"
            stroke={accentColors.primary}
            strokeWidth={2}
          />

          {/* Skill points and labels */}
          {topSkills.map((skill, i) => {
            const angle = skill.angle - Math.PI / 2;
            const r = scale(skill.level);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            const labelR = radius + 20;
            const labelX = Math.cos(angle) * labelR;
            const labelY = Math.sin(angle) * labelR;

            return (
              <Group key={skill.id}>
                {/* Skill point */}
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  cx={x}
                  cy={y}
                  r={6}
                  fill={accentColors.primary}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    filter: `drop-shadow(0 2px 4px ${accentColors.primary}40)`,
                  }}
                />

                {/* Skill label */}
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                  x={labelX}
                  y={labelY}
                  textAnchor={labelX > 0 ? "start" : "end"}
                  dy="0.33em"
                  fontSize={12}
                  fontWeight="bold"
                  fill={accentColors.primary}
                >
                  {skill.name} ({skill.level}%)
                </motion.text>
              </Group>
            );
          })}

          {/* Center point */}
          <circle
            r={4}
            fill={accentColors.primary}
            stroke="white"
            strokeWidth={2}
          />
        </Group>
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <h4 className="text-sm font-semibold mb-2 text-foreground">
          Skill Levels
        </h4>
        <div className="space-y-1 text-xs">
          {gridLevels.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ borderColor: `${accentColors.primary}${40 + level}` }}
              />
              <span className="text-muted-foreground">{level}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRadarChart;
