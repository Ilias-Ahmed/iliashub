import { useTheme } from "@/contexts/ThemeContext";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CertificationItem } from "./aboutData";
// haptics removed

interface CertificationsGalleryProps {
  certifications: CertificationItem[];
}

// New stacked layout component
const StackedCertifications = ({
  certifications,
  isInView,
}: {
  certifications: CertificationItem[];
  isInView: boolean;
}) => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // Disabled by default for performance

  // Auto-play (guard against empty list) - only when user hasn't interacted
  useEffect(() => {
    if (!isAutoPlaying || certifications.length <= 1 || !isInView) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % certifications.length);
    }, 5000); // Increased interval for less frequent updates
    return () => clearInterval(interval);
  }, [isAutoPlaying, certifications.length, isInView]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    const id = setTimeout(() => setIsAutoPlaying(true), 8000);
    return () => clearTimeout(id);
  };

  const currentCert = certifications[currentIndex];
  if (!currentCert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px]">
        {/* Left Side - Description Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="space-y-6 lg:pr-8 order-2 lg:order-1"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Quote/Description */}
              <div>
                <motion.blockquote
                  className="text-xl sm:text-2xl lg:text-3xl font-light leading-relaxed mb-6"
                  style={{
                    color: isDark
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(0, 0, 0, 0.9)",
                    fontStyle: "italic",
                  }}
                >
                  "{currentCert.title} certified — issued by{" "}
                  {currentCert.issuer}
                  ."
                </motion.blockquote>
              </div>

              {/* Meta */}
              <div className="space-y-2">
                <h4
                  className="text-lg sm:text-xl font-semibold"
                  style={{ color: isDark ? "white" : "#1f2937" }}
                >
                  {currentCert.title}
                </h4>
                <p
                  className="text-sm sm:text-base opacity-80"
                  style={{ color: accentColors.primary }}
                >
                  {currentCert.issuer} • {currentCert.date}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          {certifications.length > 1 && (
            <div className="pt-6">
              <div className="flex gap-1 mb-2">
                {certifications.map((_, index) => (
                  <motion.div
                    key={index}
                    className="h-1 rounded-full cursor-pointer flex-1"
                    style={{
                      backgroundColor:
                        index <= currentIndex
                          ? accentColors.primary
                          : isDark
                          ? "rgba(255, 255, 255, 0.2)"
                          : "rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleDotClick(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    {index === currentIndex && (
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: accentColors.secondary }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        key={`progress-${currentIndex}`}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Side - Stacked Cards */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative h-[400px] lg:h-[500px] overflow-hidden order-1 lg:order-2"
        >
          <div className="absolute inset-0 flex justify-end items-center">
            {certifications.map((cert, index) => {
              const offset = index - currentIndex;
              const isVisible = Math.abs(offset) <= 2;
              if (!isVisible) return null;
              return (
                <motion.div
                  key={`${cert.title}-${index}`}
                  className="absolute w-72 sm:w-96 h-80 rounded-2xl overflow-hidden cursor-pointer"
                  style={{ zIndex: certifications.length - Math.abs(offset) }}
                  animate={{
                    x: offset * 20 + (offset > 0 ? 100 : 0),
                    scale: offset === 0 ? 1 : 0.9 - Math.abs(offset) * 0.05,
                    opacity: offset === 0 ? 1 : 0.6 - Math.abs(offset) * 0.2,
                    rotateY: offset * -8,
                  }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => handleDotClick(index)}
                  whileHover={{ scale: offset === 0 ? 1.05 : 0.95, y: -10 }}
                >
                  <div
                    className="relative w-full h-full backdrop-blur-xl border shadow-2xl"
                    style={{
                      backgroundColor:
                        offset === 0
                          ? isDark
                            ? "rgba(0, 0, 0, 0.9)"
                            : "rgba(255, 255, 255, 0.95)"
                          : isDark
                          ? "rgba(15, 23, 42, 0.8)"
                          : "rgba(255, 255, 255, 0.85)",
                      borderColor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                      boxShadow:
                        offset === 0
                          ? `0 25px 50px -12px ${accentColors.shadow}`
                          : "rgba(0, 0, 0, 0.1) 0px 10px 20px 0px",
                    }}
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="flex-1 relative overflow-hidden">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div
                          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                          style={{
                            backgroundColor: `${accentColors.primary}30`,
                            color: "white",
                            border: `1px solid ${accentColors.primary}40`,
                          }}
                        >
                          {cert.date}
                        </div>
                      </div>
                      <div className="p-6 space-y-2">
                        <h4
                          className="font-bold text-lg line-clamp-2"
                          style={{ color: isDark ? "white" : "#1f2937" }}
                        >
                          {cert.title}
                        </h4>
                        <p
                          className="text-sm font-medium"
                          style={{ color: accentColors.primary }}
                        >
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    {offset === 0 && (
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none opacity-70"
                        style={{
                          background: `linear-gradient(45deg, transparent, ${accentColors.primary}10, transparent)`,
                          boxShadow: `inset 0 0 0 1px ${accentColors.primary}30`,
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CertificationsGallery = ({
  certifications,
}: CertificationsGalleryProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2, once: true });

  return (
    <div className="max-w-6xl mx-auto" ref={sectionRef}>
      <StackedCertifications
        certifications={certifications}
        isInView={inView}
      />
    </div>
  );
};

export default CertificationsGallery;
