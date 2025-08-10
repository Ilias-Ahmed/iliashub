import { OrbitingCircles } from "@/components/ui/OrbitingCircles";
import { triggerHapticFeedback } from "@/utils/haptics";
import { motion } from "framer-motion";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  X,
  Youtube,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";// Import WhatsApp icon from react-icons
import React from "react";

type SocialLink = {
  icon: React.ReactNode;
  url: string;
  label: string;
  hoverColor: string;
};

// Social Icon Components for OrbitingCircles
const SocialIcon = ({
  social,
  size = 24,
}: {
  social: SocialLink;
  size?: number;
}) => {
  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center rounded-full backdrop-blur-sm border transition-all duration-300 group"
      style={{
        width: size + 16,
        height: size + 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderColor: "rgba(255,255,255,0.2)",
      }}
      whileHover={{
        scale: 1.2,
        backgroundColor: `${social.hoverColor}20`,
        borderColor: `${social.hoverColor}60`,
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => triggerHapticFeedback()}
    >
      <span style={{ color: social.hoverColor, fontSize: size }}>
        {social.icon}
      </span>
    </motion.a>
  );
};

const SocialLinks = () => {
  // Pause orbits on hover
  const [isHovered, setIsHovered] = React.useState(false);

  const socialLinks: SocialLink[] = [
    {
      icon: <Github size={18} />, // Keep GitHub
      url: "https://github.com/Ilias-Ahmed",
      label: "GitHub",
      hoverColor: "#ffffff",
    },
    {
      icon: <Linkedin size={18} />, // LinkedIn
      url: "https://www.linkedin.com/in/ilias-ahmed9613/",
      label: "LinkedIn",
      hoverColor: "#0077b5",
    },
    {
      icon: <X size={18} />, // Use Twitter icon for X
      url: "https://x.com/Ilias_Ahmd",
      label: "X",
      hoverColor: "#000000",
    },
    {
      icon: <Instagram size={18} />, // Instagram
      url: "https://www.instagram.com/mipedia9613/",
      label: "Instagram",
      hoverColor: "#e4405f",
    },
    {
      icon: <FaWhatsapp size={18} />, // WhatsApp channel
      url: "https://whatsapp.com/channel/0029Vb8Vs0sISTkSqPAFHi0p",
      label: "WhatsApp",
      hoverColor: "#25D366",
    },
    {
      icon: <Youtube size={18} />, // YouTube
      url: "https://www.youtube.com/@mipedia9613",
      label: "YouTube",
      hoverColor: "#ff0000",
    },
    {
      icon: <Facebook size={18} />, // Facebook
      url: "https://www.facebook.com/profile.php?id=61576714851069",
      label: "Facebook",
      hoverColor: "#1877f2",
    },

  ];

  return (
    <motion.div className="rounded-2xl backdrop-blur-sm border relative overflow-hidden theme-transition">
      {/* Orbiting Circles Container */}
      <div
        className={`relative flex h-[400px] w-full items-center justify-center overflow-hidden ${
          isHovered ? "marquee-paused" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Outer Orbit - Normal Direction */}
        <OrbitingCircles radius={140} duration={20} iconSize={50}>
          {socialLinks.slice(0, 4).map((s) => (
            <SocialIcon key={s.label} social={s} size={20} />
          ))}
        </OrbitingCircles>

        {/* Inner Orbit - Reverse Direction */}
        <OrbitingCircles
          radius={80}
          duration={15}
          reverse
          speed={2}
          iconSize={40}
        >
          {socialLinks.slice(4, 8).map((s) => (
            <SocialIcon key={s.label} social={s} size={18} />
          ))}
        </OrbitingCircles>
      </div>
    </motion.div>
  );
};

export default SocialLinks;
