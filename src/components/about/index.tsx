import { Tabs, TabsList } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { certifications, timelineData } from "./aboutData";
import CertificationsGallery from "./CertificationsGallery";
import ExperienceTimeline from "./ExperienceTimeline";
import ProfileCard from "./ProfileCard";

const AboutSection = memo(() => {
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [scrollY, setScrollY] = useState(0);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Track scroll position for parallax effects - throttled for performance
  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      setScrollY(window.scrollY);
    }
  }, []);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const scrollHandler = throttledScrollHandler();
    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [throttledScrollHandler]);

  return (
    <section
      className="py-8 relative overflow-hidden theme-transition"
      id="about"
      ref={ref}
      aria-label="About Section"
    >
      {/* Simplified floating gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
        style={{
          backgroundColor: accentColors.primary,
          transform: `translateY(${scrollY * 0.02}px)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-5"
        style={{
          backgroundColor: accentColors.secondary,
          transform: `translateY(${-scrollY * 0.03}px)`,
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <div>
            <p
              className="heading-eyebrow"
              style={{ color: accentColors.primary }}
            >
              About
            </p>
            <span className="accent-rule mt-3 block" aria-hidden="true" />
          </div>
          <h2
            className="heading-display-sm use-display-on-lg mt-5 text-letterpress"
            style={{ color: accentColors.primary }}
          >
            Beyond The Code
          </h2>
        </div>

        {/* Interactive Tabs */}
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-20"
        >
          <div className="flex justify-center mb-16">
            <TabsList className="relative inline-flex items-center p-1 theme-transition">
              {[
                {
                  value: "profile",
                  label: "Profile",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-3.314 3.134-6 7-6s7 2.686 7 6" />
                    </svg>
                  ),
                  description: "Personal details and skills",
                },
                {
                  value: "experience",
                  label: "Experience",
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="7" width="18" height="13" rx="2" />
                      <path d="M16 3v4M8 3v4" />
                    </svg>
                  ),
                  description: "Work history and timeline",
                },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  className="relative px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 overflow-visible hover:scale-105"
                  style={{
                    color:
                      activeTab === tab.value
                        ? "white"
                        : isDark
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.7)",
                    backgroundColor:
                      activeTab === tab.value ? accentColors.primary : "transparent",
                  }}
                  onClick={() => setActiveTab(tab.value)}
                  aria-label={tab.label}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="uppercase tracking-wide">{tab.label}</span>
                  </span>
                </button>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="relative overflow-hidden">
            {activeTab === "profile" && (
              <div className="relative">
                <ProfileCard />
              </div>
            )}
            {activeTab === "experience" && (
              <div className="relative">
                <ExperienceTimeline timelineData={timelineData} />
              </div>
            )}
          </div>
        </Tabs>

        {/* Certifications Section */}
        <div className="mt-24">
          <CertificationsGallery certifications={certifications} />
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
