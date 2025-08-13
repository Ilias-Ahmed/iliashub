import { useTheme } from "@/contexts/ThemeContext";
import { memo, useMemo, useRef } from "react";

import AvailabilityBadges from "@/components/contact/AvailabilityBadges";
import BuyMeCoffeeButton from "@/components/contact/BuyMeCoffeeButton";
import ContactForm from "@/components/contact/ContactForm";
import InteractiveMap from "@/components/contact/InteractiveMap";
import SocialLinks from "@/components/contact/SocialLinks";

const ContactSection = memo(() => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

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
      {/* Simplified Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: accentColors.primary }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-5"
          style={{ backgroundColor: accentColors.secondary }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact info and social links */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <SocialLinks />
            </div>

            <div>
              <AvailabilityBadges />
            </div>
          </div>

          {/* Contact form + map + BuyMeCoffee */}
          <div
            ref={formRef}
            className="lg:col-span-3"
          >
            <ContactForm />

            <div className="hidden md:block mt-8">
              <div className="relative">
                <InteractiveMap />
                {/* Buy me a coffee on the right side of the map */}
                <div className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
                  <BuyMeCoffeeButton size="default" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

export default ContactSection;
