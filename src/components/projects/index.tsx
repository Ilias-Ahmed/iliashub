import ProjectGrid from "@/components/projects/ProjectGrid";
import { projectsData } from "@/components/projects/projectsData";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import ProjectStats from "@/components/projects/ProjectStats";
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

  // Magnetic hover util (no state, mutate element transform)
  const magnet = (el: HTMLElement, e: React.MouseEvent, strength = 0.25) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const tx = relX * strength * 0.1;
    const ty = relY * strength * 0.1;
    el.style.transform = `translate(${tx}px, ${ty}px)`;
  };

  const resetMagnet = (el: HTMLElement) => {
    el.style.transform = "translate(0, 0)";
  };

  const handleReelItemMove = (e: React.MouseEvent<HTMLDivElement>) => {
    magnet(e.currentTarget, e, 0.6);
  };
  const handleReelItemLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    resetMagnet(e.currentTarget);
  };

  return (
    <section
      className="px-6 py-10 relative overflow-hidden"
      id="projects"
      ref={ref}
    >
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: accentColors.secondary }}
        />
      </div>

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

        {/* Simplified thumbnail reel */}
        {safeProjectsData.length > 0 && (
          <div className="relative mb-10">
            <div className="project-reel mask-fade-x">
              <div className="project-reel-track" aria-hidden="true">
                {safeProjectsData.concat(safeProjectsData).map((p, i) => (
                  <div
                    className="reel-item transition-transform duration-150 will-change-transform"
                    key={`${p.id}-reel-${i}`}
                    onMouseMove={handleReelItemMove}
                    onMouseLeave={handleReelItemLeave}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-40 h-24 md:w-56 md:h-32 object-cover rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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

        {/* Project Stats */}
        <ProjectStats />
      </div>
    </section>
  );
});

ProjectsSection.displayName = "ProjectsSection";

export default ProjectsSection;
