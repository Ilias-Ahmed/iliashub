import Navigation from "@/components/navigation/Navigation";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { SmoothCursor } from "@/components/ui/SmoothCursor";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Home from "@/pages/Home";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const Toaster = React.lazy(() =>
  import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster }))
);
const LoadingScreen = React.lazy(() => import("@/components/ui/LoadingScreen"));

// Lazy-loaded sections with chunk names for better loading
const AboutSection = React.lazy(() => import("@/components/about"));
const SkillsSection = React.lazy(() => import("@/components/skills"));
const ProjectsSection = React.lazy(() => import("@/components/projects"));
const ContactSection = React.lazy(() => import("@/components/contact"));

/**
 * Optimized Main Index component with reduced complexity
 */
const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const scrollingRef = useRef(false);
  const scrollRafRef = useRef<number | null>(null);

  // Define navigation sections
  const navSections = useMemo(
    () => [
      {
        id: "home",
        name: "Home",
        href: "#home",
        path: "/",
        keywords: ["start", "landing", "main"],
      },
      {
        id: "about",
        name: "About",
        href: "#about",
        path: "/about",
        keywords: ["me", "bio", "profile"],
      },
      {
        id: "skills",
        name: "Skills",
        href: "#skills",
        path: "/skills",
        keywords: ["abilities", "expertise", "tech stack"],
      },
      {
        id: "projects",
        name: "Projects",
        href: "#projects",
        path: "/projects",
        keywords: ["work", "portfolio", "showcase"],
      },
      {
        id: "contact",
        name: "Contact",
        href: "#contact",
        path: "/contact",
        keywords: ["message", "get in touch", "email"],
      },
    ],
    []
  );

  // Handle URL-based navigation on initial load and URL changes
  useEffect(() => {
    if (scrollingRef.current) return;

    const path = location.pathname;
    let targetSection;

    if (path === "/") {
      targetSection = "home";
    } else {
      const sectionId = path.substring(1);
      const matchingSection = navSections.find(
        (section) => section.id === sectionId
      );
      targetSection = matchingSection ? matchingSection.id : "home";
    }

    const element = document.getElementById(targetSection);
    if (element) {
      scrollingRef.current = true;
      element.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        scrollingRef.current = false;
      }, 800);
    }
  }, [location.pathname, navSections]);

  // Optimized scroll handler with better throttling
  const handleScroll = useCallback(() => {
    if (scrollingRef.current) return;
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (scrollRafRef.current !== null) {
      return;
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScrollable = Math.max(documentHeight - windowHeight, 1);
      const nextProgress = Math.min(1, Math.max(0, scrollTop / maxScrollable));

      setScrollProgress((prev) => {
        if (Math.abs(prev - nextProgress) < 0.003) {
          return prev;
        }
        return nextProgress;
      });

      scrollRafRef.current = null;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, [handleScroll]);

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <SmoothCursor enabled={!isLoading} />

      <Suspense fallback={null}>
        {isLoading && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}
      </Suspense>

      <NavigationProvider customSections={navSections}>
        <div
          className="relative w-full min-h-screen overflow-hidden"
          ref={containerRef}
        >
          {/* Main content */}
          <main className="relative z-10">
            <section id="home" className="relative">
              <Home />
            </section>

            <section id="about" className="relative">
              <AboutSection />
            </section>

            <section id="skills" className="relative">
              <SkillsSection />
            </section>

            <section id="projects" className="relative">
              <ProjectsSection />
            </section>

            <section id="contact" className="relative">
              <ContactSection />
            </section>
          </main>

          {/* Navigation System */}
          <Navigation
            enableDots={false}
            enableVoice={!isMobile}
            enableCommandPalette={false}
            enableBackToTop={true}
          />

          {/* Scroll progress indicator */}
          <ScrollProgressBar progress={scrollProgress} />

          {/* Toast notifications */}
          <Suspense fallback={null}>
            <Toaster position="bottom-right" />
          </Suspense>
        </div>
      </NavigationProvider>
    </>
  );
};

export default React.memo(Index);
