import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Pre-generate stars for performance
  const starsRef = useRef<
    Array<{ x: number; y: number; radius: number; phase: number }>
  >([]);

  const initializeStars = useCallback((width: number, height: number) => {
    starsRef.current = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      phase: i, // Use index as phase for consistent animation
    }));
  }, []);

  const drawStaticElements = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Background
      ctx.fillStyle = isDark ? "rgba(15, 15, 20, 1)" : "rgba(240, 240, 245, 1)";
      ctx.fillRect(0, 0, width, height);

      // Grid - only draw if not already cached
      ctx.strokeStyle = isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 0.5;

      const cellSize = 20;

      // Vertical lines
      for (let x = 0; x <= width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    },
    [isDark]
  );

  // Optimized animation loop with performance improvements
  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      time: number
    ) => {
      // Only redraw if visible
      if (!isVisible) return;

      // Clear and redraw static elements
      drawStaticElements(ctx, width, height);

      // Draw twinkling stars with cached positions
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * 0.001 + star.phase) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${twinkle * 0.5 + 0.3})`
          : `rgba(0, 0, 0, ${twinkle * 0.3 + 0.2})`;
        ctx.fill();
      });

      // Draw optimized location marker
      const centerX = width / 2;
      const centerY = height / 2;
      const pulseTime = time * 0.001;

      // Convert hex to RGB - cache this calculation
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : { r: 139, g: 92, b: 246 };
      };

      const primaryRgb = hexToRgb(accentColors.primary);
      const rgbString = `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`;

      // Optimized pulse animation - reduced calculations
      const pulseRadius = 20 + Math.sin(pulseTime * 2) * 10;

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgbString}, 0.1)`;
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgbString}, 0.3)`;
      ctx.fill();

      // Inner circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = accentColors.primary;
      ctx.fill();

      // Optimized cosmic rays - reduced count and calculations
      const rayCount = 6; // Reduced from 8
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + pulseTime * 0.3; // Slower rotation
        const rayLength = 25 + Math.sin(pulseTime * 2 + i) * 8; // Reduced amplitude

        const startX = centerX + Math.cos(angle) * 10;
        const startY = centerY + Math.sin(angle) * 10;
        const endX = centerX + Math.cos(angle) * rayLength;
        const endY = centerY + Math.sin(angle) * rayLength;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${rgbString}, 0.3)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    [isDark, accentColors, isVisible, drawStaticElements]
  );

  // Throttled animation loop for better performance
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas || !isVisible) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    drawFrame(ctx, canvas.width, canvas.height, Date.now());

    // Throttle to 30fps instead of 60fps for better performance
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 1000 / 30);
  }, [drawFrame, isVisible]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = container.clientWidth;
    canvas.height = 220;
    canvasRef.current = canvas;

    // Initialize stars once
    initializeStars(canvas.width, canvas.height);

    // Add canvas to the DOM
    container.appendChild(canvas);

    // Use Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Start animation only when visible
    if (isVisible) {
      animate();
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (container && container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [isDark, accentColors, animate, initializeStars, isVisible]);

  // Start/stop animation based on visibility
  useEffect(() => {
    if (isVisible && !animationRef.current) {
      animate();
    } else if (!isVisible && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isVisible, animate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl overflow-hidden shadow-lg border relative"
      style={{
        backgroundColor: isDark ? "#0f0f14" : "#f0f0f5",
        borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      }}
    >
      <div ref={mapContainerRef} className="w-full h-[195px] relative">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="px-3 py-1.5 backdrop-blur-sm rounded-full text-sm flex items-center space-x-1"
            style={{
              backgroundColor: isDark
                ? "rgba(0,0,0,0.5)"
                : "rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: accentColors.primary }}
            />
            <span>Kamrup, Assam</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveMap;
