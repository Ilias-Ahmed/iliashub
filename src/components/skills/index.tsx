import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/Spinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useFilteredData } from "@/hooks/use-filtered-data";
import { useToggleList } from "@/hooks/use-toggle-list";
import { motion, useInView } from "framer-motion";
import { lazy, Suspense, useRef, useState } from "react";
import { skills } from "./skillsData";
import SkillsFilters from "./SkillsFilters";
import { Skill, ViewMode } from "./types";

// Lazy load heavy components for better performance
const GridView = lazy(() => import("./GridView"));
const MasteryView = lazy(() => import("./MasteryView"));
const ComparisonView = lazy(() => import("./ComparisonView"));
const VisxSkillsVisualization = lazy(() => import("./VisxSkillsVisualization"));
const SkillDetailModal = lazy(() => import("./SkillDetailModal"));

/**
 * Optimized Skills section component with performance monitoring and lazy loading
 */
const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // State management with optimized updates
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Use custom hooks for data filtering and comparison management
  const {
    filteredData: filteredSkills,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    resetFilters,
  } = useFilteredData(skills, {
    categoryKey: "category",
    searchKeys: ["name", "category", "description"],
  });

  const {
    items: comparisonSkills,
    toggle: toggleComparisonSkill,
    set: setComparisonSkills,
  } = useToggleList<string>(3);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section
      ref={ref}
      className="px-4 sm:px-6 relative overflow-hidden skills-section"
      id="skills"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 160, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="h-1 rounded-full mx-auto mt-6"
            style={{
              background: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary}, #10b981)`,
            }}
          />
        </motion.div>

        {/* Skills Visualization - Only render if skills are not filtered for performance */}
        {selectedCategory === "All" && !searchQuery && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6 }}
            className="mb-8 px-2 sm:px-4 md:px-0"
          >
            <Suspense
              fallback={
                <LoadingState
                  height="300px"
                  message="Loading visualization..."
                />
              }
            >
              <VisxSkillsVisualization skills={skills.slice(0, 8)} />
            </Suspense>
          </motion.div>
        )}

        {/* Filters and Controls */}
        <SkillsFilters
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setComparisonSkills={setComparisonSkills}
        />

        {/* Skills Content with Suspense */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="min-h-[600px]"
        >
          <Suspense
            fallback={
              <LoadingState height="600px" message="Loading skills..." />
            }
          >
            {viewMode === "grid" && (
              <GridView
                skills={filteredSkills}
                setSelectedSkill={setSelectedSkill}
                hoveredSkill={hoveredSkill}
                setHoveredSkill={setHoveredSkill}
                onCompareSkill={(skillId) => {
                  setViewMode("comparison");
                  setComparisonSkills([skillId]);
                }}
              />
            )}

            {viewMode === "mastery" && (
              <MasteryView
                skills={filteredSkills}
                setSelectedSkill={setSelectedSkill}
              />
            )}

            {viewMode === "comparison" && (
              <ComparisonView
                comparisonSkills={comparisonSkills}
                toggleComparisonSkill={toggleComparisonSkill}
                skills={skills}
              />
            )}
          </Suspense>
        </motion.div>

        {/* Results Summary */}
        {(selectedCategory !== "All" || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p
              className="text-lg"
              style={{
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              Showing {filteredSkills.length} of {skills.length} skills
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No Skills Found"
            description="Try adjusting your search criteria or category filter to find the skills you're looking for."
            action={{
              label: "Clear Filters",
              onClick: resetFilters,
            }}
          />
        )}
      </div>

      {/* Skill Detail Modal with Suspense */}
      <Suspense fallback={null}>
        <SkillDetailModal
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setComparisonSkills={setComparisonSkills}
          skills={skills}
        />
      </Suspense>
    </section>
  );
};

export default SkillsSection;
