import { Marquee } from "@/components/ui/Marque";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
// haptics removed
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo, useState } from "react";
import { Skill, ViewMode } from "./types";

interface GridViewProps {
  skills: Skill[];
  setSelectedSkill: (skill: Skill | null) => void;
  setHoveredSkill: (skillId: string | null) => void;
  hoveredSkill: string | null;
  setViewMode: (mode: ViewMode) => void;
  setComparisonSkills: (skills: string[]) => void;
  viewMode: ViewMode;
}

// Enhanced Skill Card Component with optimized sizing and expandable content
const SkillCard = memo(
  ({
    skill,
    isHovered,
    isExpanded,
    onHover,
    onLeave,
    onSelect,
    onCompare,
    accentColors,
  }: {
    skill: Skill;
    isHovered: boolean;
    isExpanded: boolean;
    onHover: () => void;
    onLeave: () => void;
    onSelect: () => void;
    onCompare: (e: React.MouseEvent) => void;
    accentColors: Record<string, string>;
  }) => {
    const { isDark } = useTheme();

    return (
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl border group skill-card",
          "transition-all duration-300 backdrop-blur-sm skill-card-glow",
          isExpanded ? "w-80 h-96" : "w-full max-w-64 h-40 sm:h-40 md:h-42"
        )}
        style={{
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.8)",
          borderColor: isHovered
            ? accentColors.primary
            : isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.1)",
          boxShadow: isHovered
            ? `0 15px 30px ${skill.color}20`
            : "0 4px 15px rgba(0,0,0,0.1)",
        }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onSelect}
        whileHover={{
          scale: isExpanded ? 1 : 1.02,
          y: isExpanded ? 0 : -2,
        }}
        layout
        layoutId={`skill-${skill.id}`}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at 70% 20%, ${skill.color}, transparent 50%)`,
          }}
        />

        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${skill.color}20 0%, transparent 70%)`,
            opacity: isHovered ? 0.3 : 0,
            filter: "blur(20px)",
          }}
        />

        <div
          className={cn(
            "p-3 sm:p-4 h-full flex flex-col",
            isExpanded && "overflow-hidden"
          )}
        >
          <div className="flex items-start justify-between mb-2 flex-shrink-0 relative z-10">
            <div className="flex items-center min-w-0 flex-1">
              <motion.div
                className="w-8 h-8 flex items-center justify-center rounded-lg mr-2 text-sm flex-shrink-0"
                style={{
                  backgroundColor: `${skill.color}${isHovered ? "30" : "20"}`,
                  color: skill.color,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {skill.icon}
              </motion.div>
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    "font-bold transition-colors duration-300 truncate",
                    isExpanded ? "text-base" : "text-sm"
                  )}
                  style={{ color: isDark ? "#ffffff" : "#1f2937" }}
                >
                  {skill.name}
                </h3>
                <span className="text-xs text-muted-foreground truncate block">
                  {skill.category}
                </span>
              </div>
            </div>

            {/* Compare Button */}
            <motion.button
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 flex-shrink-0"
              style={{
                backgroundColor: `${accentColors.primary}20`,
                color: accentColors.primary,
                border: `1px solid ${accentColors.primary}40`,
              }}
              onClick={onCompare}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Compare this skill"
            >
              ⚖️
            </motion.button>
          </div>

          {/* Proficiency Level */}
          <div className="mb-2 flex-shrink-0 relative z-10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Level
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: skill.color }}
              >
                {skill.level}%
              </span>
            </div>
            <div className="relative h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Content Area - Scrollable when expanded */}
          <div
            className={cn(
              "flex-1 relative z-10",
              isExpanded && "overflow-hidden"
            )}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "100%" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="h-full"
                >
                  {/* Scrollable Content Container */}
                  <div
                    className="h-full overflow-y-auto pr-2 space-y-3 skill-card-scroll"
                    style={{
                      maxHeight: "260px",
                    }}
                  >
                    {/* Detailed Description */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        About
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {skill.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        Experience
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Projects
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            {skill.projects}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Years
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            {skill.yearsExperience}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proficiency Details */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        Proficiency
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {skill.level >= 90
                              ? "Expert"
                              : skill.level >= 75
                              ? "Advanced"
                              : skill.level >= 60
                              ? "Intermediate"
                              : "Beginner"}
                          </span>
                          <div
                            className="text-xs font-bold px-2 py-1 rounded"
                            style={{
                              backgroundColor: `${skill.color}20`,
                              color: skill.color,
                            }}
                          >
                            {skill.level}%
                          </div>
                        </div>

                        {/* Progress visualization */}
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className="h-2 rounded-full"
                            style={{ backgroundColor: skill.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        Metrics
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded bg-muted/50">
                          <div className="text-xs font-bold text-foreground">
                            {Math.round(skill.projects / skill.yearsExperience)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Projects/Year
                          </div>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/50">
                          <div className="text-xs font-bold text-foreground">
                            {skill.level >= 85
                              ? "A+"
                              : skill.level >= 75
                              ? "A"
                              : skill.level >= 65
                              ? "B+"
                              : "B"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Grade
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {/* Brief Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>📁 {skill.projects}</span>
                    <span>⏱️ {skill.yearsExperience}y</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${skill.color}10 0%, transparent 50%, ${accentColors.primary}05 100%)`,
            }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </div>
      </motion.div>
    );
  }
);

SkillCard.displayName = "SkillCard";

/**
 * Optimized GridView component with 6 categories in a single page layout
 */
const GridView = ({
  skills,
  setSelectedSkill,
  setHoveredSkill,
  hoveredSkill,
  setViewMode,
  setComparisonSkills,
}: GridViewProps) => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // Group skills by category for better organization
  const skillsByCategory = useMemo(() => {
    const categories = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    // Sort categories by average skill level (highest first)
    return Object.entries(categories).sort((a, b) => {
      const avgA =
        a[1].reduce((sum, skill) => sum + skill.level, 0) / a[1].length;
      const avgB =
        b[1].reduce((sum, skill) => sum + skill.level, 0) / b[1].length;
      return avgB - avgA;
    });
  }, [skills]);

  const handleSkillSelect = (skill: Skill) => {
    if (expandedSkill === skill.id) {
      setExpandedSkill(null);
      setSelectedSkill(null);
    } else {
      setExpandedSkill(skill.id);
      setSelectedSkill(skill);
    }
    // haptics removed
  };

  const handleCompareClick = (e: React.MouseEvent, skillId: string) => {
    e.stopPropagation();
    setViewMode("comparison");
    setComparisonSkills([skillId]);
    // haptics removed
  };

  return (
    <div className="max-w-full mx-auto h-screen overflow-hidden p-2 sm:p-3 md:p-4">
      {/* 6-Category Optimized Grid Layout */}
      <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 h-full skills-grid-6">
          {skillsByCategory.map(
            ([categoryName, categorySkills], categoryIndex) => {
              const categoryColor =
                categorySkills[0]?.color || accentColors.primary;
              const avgLevel = Math.round(
                categorySkills.reduce((sum, skill) => sum + skill.level, 0) /
                  categorySkills.length
              );

              return (
                <motion.div
                  key={categoryName}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="relative h-full min-h-0 flex flex-col"
                >
                  {/* Category Header with Stats */}
                  <div className="flex items-center justify-between mb-2 md:mb-3 px-2 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30 category-header">
                    <div className="flex items-center">
                      <h4
                        className="text-sm font-bold mr-2 md:mr-3 category-badge"
                        style={{ color: categoryColor }}
                      >
                        {categoryName}
                      </h4>
                      <div
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor,
                        }}
                      >
                        {avgLevel}% avg
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-1">
                      {categorySkills.length}
                    </span>
                  </div>

                  {/* Vertical Marquee for each category */}
                  <div className="relative h-full overflow-hidden rounded-lg marquee-container">
                    <Marquee
                      pauseOnHover
                      vertical
                      className={cn(
                        "[--duration:25s] h-full",
                        expandedSkill && "marquee-paused"
                      )}
                      reverse={categoryIndex % 2 === 1}
                    >
                      {/* Duplicate skills for continuous scroll */}
                      {[...categorySkills, ...categorySkills].map(
                        (skill, index) => (
                          <SkillCard
                            key={`${skill.id}-${index}`}
                            skill={skill}
                            isHovered={hoveredSkill === skill.id}
                            isExpanded={expandedSkill === skill.id}
                            onHover={() => setHoveredSkill(skill.id)}
                            onLeave={() => setHoveredSkill(null)}
                            onSelect={() => handleSkillSelect(skill)}
                            onCompare={(e) => handleCompareClick(e, skill.id)}
                            accentColors={accentColors}
                          />
                        )
                      )}
                    </Marquee>

                    {/* Fade Gradients for smooth vertical scroll */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10" />
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(GridView);
