import { useTheme } from "@/contexts/ThemeContext";
import { triggerHapticFeedback } from "@/utils/haptics";
import { useCallback, useEffect, useRef, useState } from "react";

interface TextGlitchProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

const TextGlitch: React.FC<TextGlitchProps> = ({
  text,
  className = "",
  style = {},
}) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const originalText = useRef(text);
  const glitchChars = "!<>-_\\/[]{}—=+*^?#________";
  const { getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Debounced glitch function to prevent multiple rapid triggers
  const startGlitch = useCallback(() => {
    if (!textRef.current || isGlitching) return;

    setIsGlitching(true);
    let frame = 0;
    const maxFrames = 15; // Reduced frames for better performance

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (!textRef.current) return;

      // Use textContent instead of innerText for better performance
      textRef.current.textContent = originalText.current
        .split("")
        .map((char, i) => {
          if (i < frame / 2) return char;
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join("");

      frame++;
      if (frame >= maxFrames) {
        clearInterval(intervalRef.current!);
        textRef.current!.textContent = originalText.current;
        setIsGlitching(false);
      }
    }, 40); // Slightly slower for better performance
  }, [isGlitching]);

  // Debounced hover handler
  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(startGlitch, 100);
  }, [startGlitch]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    originalText.current = text;

    // Only trigger glitch on mount, not on every text change
    if (textRef.current && !isGlitching) {
      textRef.current.textContent = text;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, isGlitching]);

  const defaultStyle = {
    backgroundImage: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.secondary} 100%)`,
    ...style,
  };

  return (
    <h2
      ref={textRef}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      style={defaultStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={startGlitch}
      onTouchStart={() => {
        startGlitch();
        triggerHapticFeedback();
      }}
    >
      {text}
    </h2>
  );
};

export default TextGlitch;
