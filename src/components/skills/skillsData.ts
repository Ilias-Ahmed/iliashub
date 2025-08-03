import { Skill } from "./types";

export const skills: Skill[] = [
  // Frontend Technologies
  {
    id: "react",
    name: "React",
    level: 95,
    category: "Frontend",
    icon: "⚛️",
    color: "#61dafb",
    description:
      "Building dynamic and interactive user interfaces with React hooks, context, and modern patterns.",
    projects: 25,
    yearsExperience: 4,
  },
  {
    id: "typescript",
    name: "TypeScript",
    level: 90,
    category: "Frontend",
    icon: "📘",
    color: "#3178c6",
    description:
      "Type-safe JavaScript development with advanced TypeScript features and patterns.",
    projects: 20,
    yearsExperience: 3,
  },
  {
    id: "nextjs",
    name: "Next.js",
    level: 88,
    category: "Frontend",
    icon: "▲",
    color: "#000000",
    description:
      "Full-stack React framework for production-ready applications with SSR and SSG.",
    projects: 15,
    yearsExperience: 3,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    level: 92,
    category: "Frontend",
    icon: "🎨",
    color: "#06b6d4",
    description:
      "Utility-first CSS framework for rapid UI development and responsive design.",
    projects: 30,
    yearsExperience: 3,
  },

  // Backend Technologies
  {
    id: "nodejs",
    name: "Node.js",
    level: 85,
    category: "Backend",
    icon: "🟢",
    color: "#339933",
    description:
      "Server-side JavaScript runtime for building scalable network applications.",
    projects: 18,
    yearsExperience: 3,
  },
  {
    id: "express",
    name: "Express.js",
    level: 82,
    category: "Backend",
    icon: "🚂",
    color: "#000000",
    description:
      "Fast, unopinionated web framework for Node.js applications and APIs.",
    projects: 15,
    yearsExperience: 3,
  },

  // Database Technologies
  {
    id: "mongodb",
    name: "MongoDB",
    level: 80,
    category: "Database",
    icon: "🍃",
    color: "#47a248",
    description:
      "NoSQL document database for modern applications with flexible schema design.",
    projects: 14,
    yearsExperience: 3,
  },

  {
    id: "redis",
    name: "Redis",
    level: 65,
    category: "Database",
    icon: "🔴",
    color: "#dc382d",
    description:
      "In-memory data structure store for caching, session management, and real-time applications.",
    projects: 8,
    yearsExperience: 2,
  },

  // Cloud & DevOps
  {
    id: "aws",
    name: "AWS",
    level: 72,
    category: "Cloud",
    icon: "☁️",
    color: "#ff9900",
    description:
      "Amazon Web Services for cloud computing, storage, and deployment solutions.",
    projects: 12,
    yearsExperience: 2,
  },
  {
    id: "docker",
    name: "Docker",
    level: 78,
    category: "DevOps",
    icon: "🐳",
    color: "#2496ed",
    description:
      "Containerization platform for consistent development and deployment environments.",
    projects: 15,
    yearsExperience: 2,
  },

  // Tools & Others
  {
    id: "git",
    name: "Git",
    level: 90,
    category: "Tools",
    icon: "📚",
    color: "#f05032",
    description:
      "Distributed version control system for tracking changes and collaboration.",
    projects: 35,
    yearsExperience: 4,
  },
];
