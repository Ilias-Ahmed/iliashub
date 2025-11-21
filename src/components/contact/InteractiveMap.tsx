import { useTheme } from "@/contexts/ThemeContext";
import { MapPin } from "lucide-react";
import { useMemo } from "react";

const InteractiveMap = () => {
  const { isDark, getAccentColors } = useTheme();
  const accentColors = getAccentColors();

  // Kamrup, Assam coordinates
  const location = {
    name: "Kamrup, Assam, India",
    lat: 26.1433,
    lng: 91.7898,
  };

  // Google Maps URL with exact coordinates
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  const handleMapClick = () => {
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  const gradientId = useMemo(
    () => `mapGradient-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  const backgroundColor = isDark
    ? "rgba(17, 24, 39, 0.65)"
    : "rgba(255, 255, 255, 0.92)";

  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";

  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.1)";

  const satelliteDots = [
    { cx: 120, cy: 60, r: 4 },
    { cx: 280, cy: 45, r: 3 },
    { cx: 310, cy: 140, r: 3 },
    { cx: 90, cy: 140, r: 3 },
  ];

  return (
    <div
      className="rounded-2xl border theme-transition cursor-pointer group"
      style={{ backgroundColor, borderColor }}
      onClick={handleMapClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleMapClick();
        }
      }}
      aria-label={`Open ${location.name} in Google Maps`}
    >
      <div className="relative overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.02]">
        <svg
          className="h-[200px] w-full"
          viewBox="0 0 400 200"
          role="img"
          aria-labelledby="contact-map-title"
        >
          <title id="contact-map-title">Map showing {location.name}</title>
          <defs>
            <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#1f2937" : "#f1f5f9"} />
              <stop offset="100%" stopColor={isDark ? "#111827" : "#e2e8f0"} />
            </linearGradient>
          </defs>

          <rect width="400" height="200" fill={`url(#${gradientId})`} />

          {/* Grid */}
          <g stroke={gridStroke} strokeWidth="0.5">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v-${i}`} x1={i * 50} x2={i * 50} y1={0} y2={200} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line key={`h-${i}`} x1={0} x2={400} y1={i * 50} y2={i * 50} />
            ))}
          </g>

          {/* Orbiting nodes */}
          {satelliteDots.map((dot) => (
            <circle
              key={`${dot.cx}-${dot.cy}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={`${accentColors.secondary}cc`}
            />
          ))}

          {/* Connectors */}
          <path
            d="M200 90 L120 60 L90 140 L200 110 L280 45 L310 140 Z"
            fill="none"
            stroke={`${accentColors.primary}80`}
            strokeWidth="1"
          />

          {/* Central hub */}
          <circle cx={200} cy={100} r={8} fill={accentColors.primary} />
          <circle
            cx={200}
            cy={100}
            r={18}
            stroke={`${accentColors.primary}66`}
            strokeWidth="2"
            fill="none"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium backdrop-blur transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: isDark
                ? "rgba(17,24,39,0.75)"
                : "rgba(255,255,255,0.9)",
              borderColor: `${accentColors.primary}80`,
              color: isDark ? "#f8fafc" : "#0f172a",
            }}
          >
            <MapPin size={14} style={{ color: accentColors.primary }} />
            <span>{location.name}</span>
          </div>
        </div>

        {/* Click indicator - subtle hint */}
        <div className="pointer-events-none absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="text-xs px-2 py-1 rounded backdrop-blur-sm"
            style={{
              backgroundColor: `${accentColors.primary}20`,
              color: accentColors.primary,
              border: `1px solid ${accentColors.primary}40`,
            }}
          >
            Click to view
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
