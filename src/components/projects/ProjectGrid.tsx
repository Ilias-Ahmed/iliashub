import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "./types";
// haptics removed

interface ProjectGridProps {
  projects: Project[];
  columns?: 1 | 2 | 3 | 4;
}

const ProjectGrid = ({ projects, columns = 3 }: ProjectGridProps) => {
  // No internal search/filters here; keep rendering simple and fast
  const filteredProjects = useMemo(() => projects, [projects]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className="space-y-6">
      {/* Simple count (no search/filters here) */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="opacity-70"
      >
        Showing {filteredProjects.length} projects
      </motion.p>

      {/* Projects Grid */}
      <motion.div
        className={`grid ${gridCols[columns]} gap-8`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="h-[360px] sm:h-[420px] md:h-[450px]"
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {/* No Results (rare, but show friendly state) */}
      {filteredProjects.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          No projects to display.
        </motion.p>
      )}
    </div>
  );
};

export default ProjectGrid;
