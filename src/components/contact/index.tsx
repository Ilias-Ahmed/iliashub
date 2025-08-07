import { useTheme } from "@/contexts/ThemeContext";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

import AvailabilityBadges from "@/components/contact/AvailabilityBadges";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import InteractiveMap from "@/components/contact/InteractiveMap";
import SocialLinks from "@/components/contact/SocialLinks";

const ContactSection = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Memoize animation variants to prevent recreation on every render
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      },
    }),
    []
  );

  // Memoize background style to prevent recalculation
  const backgroundStyle = useMemo(
    () => ({
      background: isDark
        ? `radial-gradient(ellipse at center, ${accentColors.primary}05 0%, transparent 50%)`
        : `radial-gradient(ellipse at center, ${accentColors.primary}08 0%, transparent 50%)`,
    }),
    [isDark, accentColors.primary]
  );

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden theme-transition"
      id="contact"
      style={backgroundStyle}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: accentColors.secondary }}
        />
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full blur-2xl opacity-10"
          style={{ backgroundColor: accentColors.tertiary }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact info and social links */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isSectionInView ? "visible" : "hidden"}
            className="lg:col-span-2 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <ContactInfo />
            </motion.div>

            <motion.div variants={itemVariants}>
              <SocialLinks />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AvailabilityBadges />
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={
              isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-3"
          >
            <ContactForm />

            <motion.div
              variants={itemVariants}
              className="hidden md:block mt-8"
            >
              <InteractiveMap />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
