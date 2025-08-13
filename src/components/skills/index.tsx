import { useTheme } from "@/contexts/ThemeContext";
import { motion, useInView } from "framer-motion";
import { lazy, Suspense, useCallback, useMemo, useRef, useState } from "react";
import { skills } from "./skillsData";
import SkillsFilters from "./SkillsFilters";
import { Skill, ViewMode } from "./types";

// Lazy load heavy components for better performance
const GridView = lazy(() => import("./GridView"));
const MasteryView = lazy(() => import("./MasteryView"));
const ComparisonView = lazy(() => import("./ComparisonView"));
const VisxSkillsVisualization = lazy(() => import("./VisxSkillsVisualization"));
const SkillDetailModal = lazy(() => import("./SkillDetailModal"));

// Loading fallback component
const LoadingFallback = ({ height = "400px" }: { height?: string }) => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  return (
    <div
      className="flex items-center justify-center rounded-xl border border-border/30"
      style={{ height }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-8 h-8 rounded-full animate-spin border-2 border-transparent"
          style={{
            borderTopColor: accentColors.primary,
            borderRightColor: accentColors.secondary,
          }}
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [comparisonSkills, setComparisonSkills] = useState<string[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Memoized filter function for better performance
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "All" || skill.category === selectedCategory;
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Optimized comparison skill toggle
  const toggleComparisonSkill = useCallback((skillId: string) => {
    setComparisonSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      } else if (prev.length < 3) {
        return [...prev, skillId];
      }
      return prev;
    });
  }, []);

  // Reset filters function
  const resetFilters = useCallback(() => {
    setSelectedCategory("All");
    setSearchQuery("");
  }, []);


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
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: accentColors.secondary }}
        />
        <div
          className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "#10b981" }}
        />
      </div>

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
        <Suspense fallback={<LoadingFallback height="300px" />}>
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
          <Suspense fallback={<LoadingFallback height="600px" />}>
        {viewMode === "grid" && (
          <GridView
            skills={filteredSkills}
            setSelectedSkill={setSelectedSkill}
            hoveredSkill={hoveredSkill}
            setHoveredSkill={setHoveredSkill}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setComparisonSkills={setComparisonSkills}
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
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
          >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: `${accentColors.primary}20` }}
        >
          <span className="text-3xl">🔍</span>
        </div>
        <h3
          className="text-xl font-semibold mb-4"
          style={{ color: isDark ? "#ffffff" : "#1f2937" }}
        >
          No Skills Found
        </h3>
        <p
          className="max-w-md mx-auto"
          style={{
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
          }}
        >
          Try adjusting your search criteria or category filter to find the
          skills you're looking for.
        </p>
        <motion.button
          onClick={resetFilters}
          className="mt-6 px-6 py-3 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: accentColors.primary,
            color: "white",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Filters
        </motion.button>
          </motion.div>
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
