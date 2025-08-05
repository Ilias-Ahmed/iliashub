import { Project } from "./types";

export const projectsData: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A modern, full-stack e-commerce solution with real-time inventory management, secure payment processing, and advanced analytics dashboard.",
    longDescription:
      "This comprehensive e-commerce platform was built to handle high-traffic scenarios with a focus on performance, security, and user experience. Features include real-time inventory tracking, multiple payment gateways, advanced search and filtering, order management, and detailed analytics.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redis", "AWS"],
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Redis",
      "Stripe API",
      "AWS S3",
      "Docker",
    ],
    link: "https://example-ecommerce.com",
    github: "https://github.com/username/ecommerce-platform",
    featured: true,
    category: "Web Application",
    year: "2024",
    status: "completed",
    features: [
      "Real-time inventory management",
      "Secure payment processing with Stripe",
      "Advanced search and filtering",
      "Order tracking and management",
      "Analytics dashboard",
      "Mobile-responsive design",
    ],
    challenges: [
      "Implementing real-time inventory updates across multiple users",
      "Optimizing database queries for large product catalogs",
      "Ensuring PCI compliance for payment processing",
      "Building scalable microservices architecture",
    ],
    results: [
      "99.9% uptime achieved",
      "40% faster page load times",
      "25% increase in conversion rates",
      "Successfully handling 10k+ concurrent users",
    ],
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "A collaborative project management tool with real-time updates, team collaboration features, and advanced project analytics.",
    longDescription:
      "Built for modern teams, this task management application provides comprehensive project tracking, team collaboration tools, and insightful analytics to boost productivity and streamline workflows.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    tags: ["Vue.js", "Firebase", "Vuex", "PWA", "WebRTC"],
    technologies: [
      "Vue.js",
      "Vuex",
      "Firebase",
      "Firestore",
      "WebRTC",
      "PWA",
      "Chart.js",
    ],
    link: "https://example-taskmanager.com",
    github: "https://github.com/username/task-manager",
    featured: true,
    category: "Productivity",
    year: "2024",
    status: "completed",
    features: [
      "Real-time collaboration",
      "Drag-and-drop task management",
      "Team chat and video calls",
      "Project analytics and reporting",
      "Offline functionality (PWA)",
      "Custom workflows and automation",
    ],
    challenges: [
      "Implementing real-time synchronization across multiple users",
      "Building offline-first architecture",
      "Optimizing performance for large datasets",
      "Creating intuitive drag-and-drop interfaces",
    ],
    results: [
      "50% improvement in team productivity",
      "95% user satisfaction rate",
      "Reduced project completion time by 30%",
      "Successfully deployed to 500+ teams",
    ],
  },
  {
    id: "3",
    title: "Weather Dashboard",
    description:
      "An interactive weather application with beautiful visualizations, location-based forecasts, and severe weather alerts.",
    longDescription:
      "A comprehensive weather dashboard that provides detailed weather information with stunning visualizations, interactive maps, and personalized weather alerts for multiple locations.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop",
    tags: ["React", "D3.js", "OpenWeather API", "Mapbox", "Chart.js"],
    technologies: [
      "React",
      "TypeScript",
      "D3.js",
      "Mapbox GL",
      "OpenWeather API",
      "Chart.js",
      "Styled Components",
    ],
    link: "https://example-weather.com",
    github: "https://github.com/username/weather-dashboard",
    category: "Data Visualization",
    year: "2023",
    status: "completed",
    features: [
      "Interactive weather maps",
      "7-day detailed forecasts",
      "Severe weather alerts",
      "Historical weather data",
      "Multiple location tracking",
      "Beautiful data visualizations",
    ],
    challenges: [
      "Handling large amounts of weather data efficiently",
      "Creating smooth map interactions",
      "Implementing accurate location detection",
      "Building responsive charts and graphs",
    ],
    results: [
      "100k+ active users",
      "4.8/5 app store rating",
      "Featured in weather app collections",
      "99.5% API uptime maintained",
    ],
  },
  {
    id: "4",
    title: "NodeNest - Social Media Web App",
    description:
      "A full-featured social media platform built with real-time messaging, secure authentication, and a modern, responsive UI.",
    longDescription:
      "NodeNest is a scalable and interactive social media web application developed using the MERN stack. It offers real-time chat, post sharing, likes, comments, and user profile customization. Built with performance, scalability, and modern design in mind, it provides a seamless experience for users across devices.",
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=600&fit=crop",
    tags: ["MERN", "Socket.IO", "JWT", "MongoDB", "Tailwind CSS"],
    technologies: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Socket.IO",
      "JWT",
      "Cloudinary",
      "Tailwind CSS",
      "Zod",
      "React Hook Form",
      "Framer Motion",
      "Vite",
    ],
    link: "https://nodenest.live", // Replace with your actual deployed link
    github: "https://github.com/Ilias-Ahmed/NodeNest", // Replace with your actual GitHub repo
    category: "Social Media",
    year: "2025",
    status: "completed",
    features: [
      "Real-time messaging with Socket.IO",
      "User authentication with JWT",
      "Post creation, likes, and comments",
      "Profile and cover photo upload via Cloudinary",
      "Modern responsive UI with Tailwind CSS",
      "Form validation using Zod and React Hook Form",
      "Smooth animations with Framer Motion",
    ],
    challenges: [
      "Implementing real-time chat system",
      "Managing state across complex UI components",
      "Ensuring secure and scalable backend architecture",
      "Image upload and storage handling",
      "Maintaining responsive design across devices",
    ],
    results: [
      "100% real-time communication achieved",
      "Minimal API response time with optimized backend",
      "Smooth user experience with modern animations",
      "Successfully deployed with production readiness",
      "Positive feedback from early users and testers",
    ],
  },

  {
    id: "5",
    title: "Learning Management System",
    description:
      "A modern LMS with interactive courses, progress tracking, and AI-powered personalized learning paths.",
    longDescription:
      "A comprehensive learning management system designed for educational institutions and corporate training, featuring interactive content, progress tracking, and AI-driven personalized learning experiences.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "MongoDB", "Socket.io", "AWS"],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.io",
      "AWS",
      "FFmpeg",
      "WebRTC",
    ],
    link: "https://example-lms.com",
    github: "https://github.com/username/learning-management",
    category: "Education",
    year: "2023",
    status: "in-progress",
    features: [
      "Interactive video courses",
      "Real-time collaboration tools",
      "Progress tracking and analytics",
      "AI-powered learning recommendations",
      "Virtual classroom functionality",
      "Mobile learning app",
    ],
    challenges: [
      "Building scalable video streaming infrastructure",
      "Implementing real-time collaboration features",
      "Creating adaptive learning algorithms",
      "Ensuring accessibility compliance",
    ],
  },
  {
    id: "6",
    title: "Cryptocurrency Tracker",
    description:
      "A real-time cryptocurrency tracking application with portfolio management and advanced trading analytics.",
    longDescription:
      "A comprehensive cryptocurrency tracking platform that provides real-time market data, portfolio management tools, and advanced analytics for crypto traders and investors.",
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
    tags: ["Vue.js", "Node.js", "WebSocket", "Chart.js", "CoinGecko API"],
    technologies: [
      "Vue.js",
      "Nuxt.js",
      "Node.js",
      "WebSocket",
      "Chart.js",
      "CoinGecko API",
      "TradingView",
    ],
    link: "https://example-crypto.com",
    category: "Finance",
    year: "2022",
    status: "completed",
    features: [
      "Real-time price tracking",
      "Portfolio management",
      "Advanced charting tools",
      "Price alerts and notifications",
      "Market analysis and insights",
      "Trading simulation",
    ],
    challenges: [
      "Handling real-time data streams efficiently",
      "Building responsive financial charts",
      "Implementing secure portfolio tracking",
      "Managing API rate limits",
    ],
    results: [
      "50k+ registered users",
      "Real-time data for 5000+ cryptocurrencies",
      "99.9% data accuracy maintained",
      "Featured in crypto community forums",
    ],
  },
];

// Featured projects (subset of main projects)
export const featuredProjects = projectsData.filter(
  (project) => project.featured
);

// Projects by category
export const projectsByCategory = projectsData.reduce((acc, project) => {
  const category = project.category || "Other";
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(project);
  return acc;
}, {} as Record<string, Project[]>);

// Recent projects (last 2 years)
export const recentProjects = projectsData.filter((project) => {
  const projectYear = parseInt(project.year || "2024");
  const currentYear = new Date().getFullYear();
  return currentYear - projectYear <= 2;
});
