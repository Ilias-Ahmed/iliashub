import { ShiftCard } from "@/components/ui/ShiftCard";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, useInView } from "framer-motion";
import { Rocket, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StatItem } from "./types";

// Compact Glitch Counter for ShiftCard
const GlitchCounter = ({
  value,
  suffix,
  color,
  size = "text-3xl",
}: {
  value: number;
  suffix: string;
  color: string;
  size?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (value === 0) return;

    const duration = 2000;
    const startTime = Date.now();
    const target = parseFloat(value.toString().replace(/[^0-9.]/g, ""));

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 0.8) {
        setIsGlitching(Math.random() > 0.8);
        const current =
          target * progress + (Math.random() - 0.5) * target * 0.1;
        setDisplayValue(Math.max(0, current));
      } else {
        setIsGlitching(false);
        setDisplayValue(target * progress);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatValue = () => {
    if (suffix === "k+") return `${Math.floor(displayValue / 1000)}k+`;
    if (suffix === "%") return `${displayValue.toFixed(1)}%`;
    if (suffix === "/5") return `${displayValue.toFixed(1)}/5`;
    if (suffix === "+") return `${Math.floor(displayValue)}+`;
    return Math.floor(displayValue).toString();
  };

  return (
    <motion.div
      className={`${size} font-bold font-mono tabular-nums`}
      style={{
        color,
        filter: isGlitching ? "hue-rotate(90deg) brightness(1.2)" : "none",
        textShadow: isGlitching ? `0 0 10px ${color}` : `0 0 5px ${color}40`,
      }}
      animate={{
        scale: isGlitching ? [1, 1.05, 1] : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {formatValue()}
    </motion.div>
  );
};

// Individual Stat Card using ShiftCard
const StatShiftCard = ({ stat, delay }: { stat: StatItem; delay: number }) => {
  const [animValue, setAnimValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimValue(parseFloat(stat.value.replace(/[^0-9.]/g, "")));
    }, delay);
    return () => clearTimeout(timer);
  }, [stat.value, delay]);

  const getSuffix = () => {
    if (stat.value.includes("k+")) return "k+";
    if (stat.value.includes("%")) return "%";
    if (stat.value.includes("/5")) return "/5";
    if (stat.value.includes("+")) return "+";
    return "";
  };

  // Top content - compact header with icon and title
  const topContent = (
    <div
      className="rounded-lg text-primary shadow-lg p-3"
      style={{
        backgroundColor: `${stat.color}15`,
        border: `1px solid ${stat.color}30`,
      }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: `${stat.color}25` }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {" "}
          <div
            style={{ color: stat.color }}
            className="[&>svg]:w-4 [&>svg]:h-4"
          >
            {stat.icon}
          </div>
        </motion.div>
        <h3 className="text-sm font-semibold text-foreground">{stat.label}</h3>
      </div>
    </div>
  );

  // Animated content that appears on hover
  const topAnimateContent = (
    <motion.div
      className="absolute top-2 right-2"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { delay: 0.2, duration: 0.3 },
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        rotate: 10,
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="px-2 py-1 rounded-md text-xs font-medium"
        style={{
          backgroundColor: `${stat.color}20`,
          color: stat.color,
          border: `1px solid ${stat.color}40`,
        }}
      >
        Live
      </div>
    </motion.div>
  );

  // Middle content - large counter display
  const middleContent = (
    <motion.div
      className="flex flex-col items-center justify-center"
      layoutId={`counter-${stat.label}`}
    >
      <GlitchCounter
        value={animValue}
        suffix={getSuffix()}
        color={stat.color || "#ffffff"}
        size="text-4xl"
      />
      <motion.div
        className="w-16 h-1 rounded-full mt-2"
        style={{ backgroundColor: `${stat.color}40` }}
        animate={{ width: ["0%", "100%"] }}
        transition={{ delay: delay / 1000 + 0.5, duration: 0.8 }}
      />
    </motion.div>
  );

  // Bottom content - detailed info
  const bottomContent = (
    <div className="pb-4">
      <div
        className="flex w-full flex-col gap-3 border-t rounded-t-lg px-4 pb-4"
        style={{
          backgroundColor: `${stat.color}10`,
          borderColor: `${stat.color}30`,
        }}
      >
        <div className="pt-3">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <span className="text-sm font-medium text-foreground">
              Performance Metrics
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {stat.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Growth Rate</span>
            <span className="text-xs font-medium" style={{ color: stat.color }}>
              +23%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Last Updated</span>
            <span className="text-xs font-medium text-foreground">
              2 min ago
            </span>
          </div>
        </div>

        <motion.div
          className="w-full h-1 rounded-full bg-muted"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: stat.color }}
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ delay: 0.8, duration: 1.2 }}
          />
        </motion.div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
    >
      <ShiftCard
        className="bg-card/50 backdrop-blur-sm border-muted/50 hover:border-muted"
        topContent={topContent}
        topAnimateContent={topAnimateContent}
        middleContent={middleContent}
        bottomContent={bottomContent}
      />
    </motion.div>
  );
};

const ProjectStats = () => {
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats: StatItem[] = [
    {
      value: "50+",
      label: "Projects",
      icon: <Rocket size={24} />,
      description:
        "Full-stack applications deployed to production with modern tech stacks",
      color: accentColors.primary,
    },
    {
      value: "15+",
      label: "Technologies",
      icon: <Zap size={24} />,
      description:
        "Modern frameworks, libraries, and cutting-edge development tools",
      color: accentColors.tertiary,
    },
    {
      value: "99.9%",
      label: "Uptime",
      icon: <TrendingUp size={24} />,
      description:
        "Reliable, high-performance applications with enterprise-grade stability",
      color: accentColors.primary,
    },
  ];

  return (
    <section className="pt-20 relative overflow-hidden" ref={ref}>
      {/* Background Effect - Only animate when in view and reduce intensity */}
      {isInView && (
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
            style={{ backgroundColor: accentColors.primary }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180],
              x: [0, 25, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 60, // Much slower
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse", // Prevents jarring resets
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <StatShiftCard key={stat.label} stat={stat} delay={index * 200} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectStats;
