import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

const InteractiveMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const container = canvas.parentElement;
    if (container) {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = 200 * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = '200px';

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      return ctx;
    }
    return null;
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 0.5;

    const gridSize = 25;
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  }, [isDark]);

  const drawPulse = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    const pulseSize = 6 + Math.sin(time * 2.5) * 2;

    // Center dot
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.fillStyle = accentColors.primary;
    ctx.fill();

    // Pulse rings
    for (let i = 1; i <= 2; i++) {
      const ringRadius = pulseSize + (i * 12) + Math.sin(time * 2 + i) * 4;
      const opacity = Math.max(0, 0.4 - i * 0.15);

      ctx.beginPath();
      ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `${accentColors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [accentColors.primary]);

  useEffect(() => {
    const ctx = setupCanvas();
    if (!ctx) return;

    let isAnimating = true;

    const animationLoop = () => {
      if (!isAnimating) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const time = Date.now() * 0.001;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw grid
      drawGrid(ctx, width, height);

      // Draw center pulse
      drawPulse(ctx, width / 2, height / 2, time);

      // Floating particles
      const particles = 6;
      for (let i = 0; i < particles; i++) {
        const angle = (i / particles) * Math.PI * 2 + time * 0.3;
        const radius = 40 + Math.sin(time * 0.8 + i) * 15;
        const x = width / 2 + Math.cos(angle) * radius;
        const y = height / 2 + Math.sin(angle) * radius;
        const size = 1.5 + Math.sin(time * 1.5 + i) * 0.8;
        const opacity = 0.5 + Math.sin(time * 2 + i) * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `${accentColors.secondary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      isAnimating = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, accentColors, setupCanvas, drawGrid, drawPulse]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative rounded-2xl backdrop-blur-sm border overflow-hidden theme-transition"
      style={{
        backgroundColor: isDark
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.8)",
        borderColor: isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.1)",
      }}
    >
      {/* Ambient background elements */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div
          className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full blur-xl"
          style={{ backgroundColor: `${accentColors.primary}40` }}
        />
        <div
          className="absolute bottom-1/2 left-1/4 w-16 h-16 rounded-full blur-xl"
          style={{ backgroundColor: `${accentColors.secondary}40` }}
        />
      </div>


      {/* Canvas Map */}
      <div className="relative rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[200px] rounded-xl"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
              : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
          }}
        />

        {/* Location indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md border"
            style={{
              backgroundColor: isDark
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.9)",
              borderColor: `${accentColors.primary}80`,
            }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MapPin
              size={14}
              style={{ color: accentColors.primary }}
            />
            <span className="text-xs font-medium">Kamrup, Assam</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;
