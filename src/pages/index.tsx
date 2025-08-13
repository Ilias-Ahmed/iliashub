import Navigation from "@/components/navigation/Navigation";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import { SmoothCursor } from "@/components/ui/SmoothCursor";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Hero from "@/pages/Hero";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Toaster = React.lazy(() =>
  import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster }))
);
const LoadingScreen = React.lazy(() => import("@/components/ui/LoadingScreen"));

// Lazy-loaded sections with chunk names for better loading
const AboutSection = React.lazy(() => import("@/components/about"));
const SkillsSection = React.lazy(() => import("@/components/skills"));
const ProjectsSection = React.lazy(() => import("@/components/projects"));
const ContactSection = React.lazy(() => import("@/components/contact"));

// Optimized loading fallback
const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Optimized Main Index component with reduced complexity
 */
const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const progress = Math.min(1, Math.max(0, scrollTop / (documentHeight - windowHeight)));

    setScrollProgress(progress);

    // Debounced URL updates
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const viewportMid = scrollTop + windowHeight / 2;

      for (const section of navSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const sectionTop = scrollTop + rect.top;
        const sectionBottom = sectionTop + rect.height;

        if (viewportMid >= sectionTop && viewportMid <= sectionBottom) {
          const targetPath = section.id === "home" ? "/" : `/${section.id}`;
          if (location.pathname !== targetPath) {
            navigate(targetPath, { replace: true });
          }
          break;
        }
      }
    }, 150);
  }, [navSections, navigate, location.pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Handle loading completion
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {/* Simplified cursor with option to disable */}
      {!isMobile && <SmoothCursor enabled={!isLoading} />}

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
              <Hero />
            </section>

            <Suspense fallback={<SectionFallback />}>
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
            </Suspense>
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
