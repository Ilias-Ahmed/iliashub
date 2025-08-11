import ProjectGrid from "@/components/projects/ProjectGrid";
import { projectsData } from "@/components/projects/projectsData";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import ProjectViewToggle from "@/components/projects/ProjectViewToggle";
import { Project, ViewMode } from "@/components/projects/types";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const ProjectsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [viewMode, setViewMode] = useState<ViewMode>("showcase");
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, -40]);

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

  // Spotlight cursor position for background flair
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

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
      className="px-6 relative overflow-hidden"
      id="projects"
      ref={ref}
      onMouseMove={handleSectionMouseMove}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: accentColors.primary, y: orbY1 }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: accentColors.secondary, y: orbY2 }}
        />
        <motion.div
          className="absolute top-2/3 right-1/3 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: accentColors.primary, y: orbY3 }}
        />
      </div>

      {/* Spotlight background that follows cursor (desktop only) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden md:block"
        aria-hidden="true"
        style={{
          background: `radial-gradient(300px 300px at ${mousePos.x}px ${mousePos.y}px, ${accentColors.primary}20, transparent 60%)`,
          transition: "background 80ms linear",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16"
          aria-labelledby="projects-title"
        >
          <div className="text-left">
            <p
              className="heading-eyebrow opacity-70 mb-3"
              style={{ color: accentColors.primary }}
            >
              Case Studies
            </p>
            <h2
              id="projects-title"
              className="heading-display use-display-on-lg text-letterpress"
              aria-label={title}
            >
              {titleChars.map((ch, i) => (
                <motion.span
                  key={i + ch}
                  initial={{ y: 20, opacity: 0, rotateX: -15 }}
                  animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.02 * i,
                    ease: "easeOut",
                  }}
                  className="inline-block will-change-transform"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
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
        </motion.header>

        {/* View Toggle */}
        <ProjectViewToggle activeView={viewMode} onChange={setViewMode} />

        {/* Cinematic thumbnail reel */}
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
