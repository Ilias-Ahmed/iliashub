import { OrbitingCircles } from "@/components/ui/OrbitingCircles";
import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";
import { motion } from "framer-motion";
import { BookOpen, Github, Instagram, Linkedin, Twitter } from "lucide-react";

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
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

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
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const socialLinks: SocialLink[] = [
    {
      icon: <Github size={18} />,
      url: "https://github.com/Ilias-Ahmed",
      label: "GitHub",
      hoverColor: "#ffffff",
    },
    {
      icon: <Linkedin size={18} />,
      url: "https://www.linkedin.com/in/ilias-ahmed9613/",
      label: "LinkedIn",
      hoverColor: "#0077b5",
    },
    {
      icon: <Twitter size={18} />,
      url: "https://twitter.com/your-handle",
      label: "Twitter",
      hoverColor: "#1da1f2",
    },
    {
      icon: <Instagram size={18} />,
      url: "https://instagram.com/your-handle",
      label: "Instagram",
      hoverColor: "#e4405f",
    },
    {
      icon: <BookOpen size={18} />,
      url: "https://medium.com/@your-handle",
      label: "Medium",
      hoverColor: "#00ab6c",
    },
  ];

  return (
    <motion.div
      className="rounded-2xl backdrop-blur-sm border relative overflow-hidden theme-transition"

    >


      {/* Orbiting Circles Container */}
      <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden">
        {/* Outer Orbit - Normal Direction */}
        <OrbitingCircles radius={140} duration={20} iconSize={50}>
          <SocialIcon social={socialLinks[0]} size={20} />
          <SocialIcon social={socialLinks[1]} size={20} />
          <SocialIcon social={socialLinks[2]} size={20} />
        </OrbitingCircles>

        {/* Inner Orbit - Reverse Direction */}
        <OrbitingCircles
          radius={80}
          duration={15}
          reverse
          speed={2}
          iconSize={40}
        >
          <SocialIcon social={socialLinks[3]} size={18} />
          <SocialIcon social={socialLinks[4]} size={18} />
        </OrbitingCircles>
      </div>
    </motion.div>
  );
};

export default SocialLinks;
