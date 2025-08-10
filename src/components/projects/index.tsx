import ProjectGrid from "@/components/projects/ProjectGrid";
import { projectsData } from "@/components/projects/projectsData";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ProjectViewToggle from "@/components/projects/ProjectViewToggle";
import { Project, ViewMode } from "@/components/projects/types";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const ProjectsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [viewMode, setViewMode] = useState<ViewMode>("showcase");
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Ensure projectsData is properly typed and exists
  const safeProjectsData: Project[] = useMemo(() => {
    if (!projectsData || !Array.isArray(projectsData)) {
      return [];
    }
    return projectsData.filter(
      (project): project is Project =>
        project !== null &&
        project !== undefined &&
        typeof project === "object" &&
        "id" in project &&
        "title" in project &&
        "description" in project
    );
  }, []);

  // Derived views
  const featuredProjects = useMemo(
    () => safeProjectsData.filter((p) => p.featured),
    [safeProjectsData]
  );

  return (
    <section className="px-6 relative overflow-hidden" id="projects" ref={ref}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: accentColors.secondary }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${accentColors.primary}, ${accentColors.secondary}, ${accentColors.tertiary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Featured Projects
            </h2>
          </div>
        </motion.div>

        {/* View Toggle */}
        <ProjectViewToggle activeView={viewMode} onChange={setViewMode} />

        {/* Project Views */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {viewMode === "showcase" && (
            <ProjectShowcase
              projects={
                featuredProjects.length > 0
                  ? featuredProjects
                  : safeProjectsData.slice(0, 5)
              }
            />
          )}
          {viewMode === "grid" && <ProjectGrid projects={safeProjectsData} />}
          {viewMode === "timeline" && (
            <ProjectTimeline projects={safeProjectsData} />
          )}
        </motion.div>

        {/* Project Stats */}
        <ProjectStats />
      </div>
    </section>
  );
};

export default ProjectsSection;
