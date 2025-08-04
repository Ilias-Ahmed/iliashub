import { useAudio } from "@/contexts/AudioContext";
import { useBackground } from "@/contexts/BackgroundContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const GlobalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const lastFrameTime = useRef(performance.now());
  const frameSkipCounter = useRef(0);

  const { accent } = useTheme();
  const { config, backgroundOpacity } = useBackground();
  const { audioData, isPlaying } = useAudio();
  const isMobile = useIsMobile();

  // Performance optimizations
  const TARGET_FPS = isMobile ? 20 : 40; // Reduced from 60
  const FRAME_SKIP = isMobile ? 3 : 2; // Increased frame skipping
  const MAX_PARTICLES = isMobile
    ? 15
    : config.intensity === "high"
    ? 40
    : config.intensity === "medium"
    ? 25
    : 15;

  // Simplified audio analysis - only when needed and throttled
  const audioLevel = useMemo(() => {
    if (!audioData || !isPlaying || !config.enableAudioVisualization) {
      return 0;
    }

    // Only update every 5th frame for performance
    if (frameSkipCounter.current % 5 !== 0) {
      return 0;
    }

    // Simple average instead of complex frequency analysis
    const average =
      Array.from(audioData).reduce((sum, val) => sum + val, 0) /
      audioData.length /
      255;
    return Math.min(average * 2, 1); // Cap at 1 for stability
  }, [audioData, isPlaying, config.enableAudioVisualization]);

  const getThemeColors = useCallback(() => {
    const colorMaps = {
      purple: { primary: [168, 85, 247], secondary: [196, 132, 252] },
      blue: { primary: [59, 130, 246], secondary: [96, 165, 250] },
      pink: { primary: [236, 72, 153], secondary: [244, 114, 182] },
      green: { primary: [34, 197, 94], secondary: [74, 222, 128] },
      orange: { primary: [249, 115, 22], secondary: [251, 146, 60] },
    };
    return colorMaps[accent];
  }, [accent]);

  const initializeParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      const particles: Particle[] = [];
      const colors = getThemeColors();

      for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // Much slower
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 1.5 + 0.5, // Smaller
          color: `rgba(${colors.primary.join(",")}, 0.6)`,
          life: Math.random() * 200 + 100, // Longer life
          maxLife: Math.random() * 200 + 100,
        });
      }

      particlesRef.current = particles;
    },
    [MAX_PARTICLES, getThemeColors]
  );

  const renderParticles = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const particles = particlesRef.current;

      particles.forEach((particle) => {
        // Simple audio influence
        const audioBoost = config.enableAudioVisualization
          ? audioLevel * 0.3
          : 0;

        // Update position
        particle.x += particle.vx + audioBoost;
        particle.y += particle.vy + audioBoost;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Update life
        particle.life -= 0.5;
        if (particle.life <= 0) {
          // Respawn
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.maxLife;
        }

        // Render
        const alpha = Math.max(0, particle.life / particle.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    },
    [audioLevel, config.enableAudioVisualization]
  );

  const renderMinimal = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const colors = getThemeColors();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Just a simple gradient circle
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        canvas.width / 3
      );
      gradient.addColorStop(0, `rgba(${colors.primary.join(",")}, 0.1)`);
      gradient.addColorStop(1, `rgba(${colors.secondary.join(",")}, 0.05)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    [getThemeColors]
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Frame skipping for performance
    frameSkipCounter.current++;
    const shouldSkipFrame = frameSkipCounter.current % FRAME_SKIP !== 0;

    if (shouldSkipFrame) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    // Performance throttling
    const now = performance.now();
    const deltaTime = now - lastFrameTime.current;

    if (deltaTime < 1000 / TARGET_FPS) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    lastFrameTime.current = now;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.globalAlpha = backgroundOpacity;

    // Ultra-simplified rendering
    if (config.mode === "minimal" || isMobile) {
      renderMinimal(ctx, canvas);
    } else {
      renderParticles(ctx, canvas);
    }

    ctx.restore();

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [
    config.mode,
    backgroundOpacity,
    renderParticles,
    renderMinimal,
    isMobile,
    TARGET_FPS,
    FRAME_SKIP,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles(canvas);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeParticles, animate]);

  // Skip rendering entirely on very low-end devices
  const shouldRender = useMemo(() => {
    if (isMobile && config.performanceMode === "auto") {
      return config.intensity !== "high";
    }
    return true;
  }, [isMobile, config.performanceMode, config.intensity]);

  if (!shouldRender) {
    return (
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg,
            rgba(${getThemeColors().primary.join(",")}, 0.03) 0%,
            rgba(${getThemeColors().secondary.join(",")}, 0.02) 100%)`,
          opacity: backgroundOpacity,
        }}
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          opacity: backgroundOpacity,
        }}
      />
    </motion.div>
  );
};

export default GlobalBackground;
