import { Tabs, TabsList } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";
import { memo, useRef, useState } from "react";
import { certifications, timelineData } from "./aboutData";
import CertificationsGallery from "./CertificationsGallery";
import ExperienceTimeline from "./ExperienceTimeline";
import ProfileCard from "./ProfileCard";

const AboutSection = memo(() => {
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();


  return (
    <section
      className="py-8 relative overflow-hidden theme-transition"
      id="about"
      ref={ref}
      aria-label="About Section"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
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
