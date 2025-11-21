import ProjectGrid from "@/components/projects/ProjectGrid";
import { projectsData } from "@/components/projects/projectsData";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ProjectViewToggle from "@/components/projects/ProjectViewToggle";
import { Project, ViewMode } from "@/components/projects/types";
import { useTheme } from "@/contexts/ThemeContext";
import { memo, useMemo, useRef, useState } from "react";

const ProjectsSection = memo(() => {
  const ref = useRef<HTMLElement>(null);
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

  const title = "Featured Projects";
  const titleChars = title.split("");

  return (
    <section
      className="px-6 py-10 relative overflow-hidden"
      id="projects"
      ref={ref}
    >

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 md:mb-16" aria-labelledby="projects-title">
          <div className="text-left">
            <h2
              id="projects-title"
              className="heading-display use-display-on-lg text-letterpress"
              aria-label={title}
            >
              {titleChars.map((ch, i) => (
                <span
                  key={i + ch}
                  className="inline-block will-change-transform"
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h2>
            <div
              className="accent-rule mt-4 mr-auto"
              style={{ width: 140, backgroundColor: accentColors.primary }}
            />
            <p className="mt-6 max-w-2xl opacity-80">
              A curated selection of recent work. Thoughtful interfaces,
              performant builds, and considerate motion — crafted end to end.
            </p>
          </div>
        </header>

        {/* View Toggle */}
        <ProjectViewToggle activeView={viewMode} onChange={setViewMode} />

        {/* Project Views */}
        <div>
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
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = "ProjectsSection";

export default ProjectsSection;
