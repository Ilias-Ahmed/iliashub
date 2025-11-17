import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
      }}
    >
      {/* Container */}
      <motion.div
        className="relative z-10 text-center p-8 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 */}
        <h1
          className="text-8xl font-extrabold mb-4 tracking-tight"
          style={{
            textShadow: "0 0 15px rgba(99,102,241,0.5)",
          }}
        >
          404
        </h1>

        {/* Message */}
        <p
          className="text-lg mb-6"
          style={{
            color: isDark ? "#9ca3af" : "#4b5563",
          }}
        >
          The page you’re trying to reach doesn’t exist.
          <br />
          It might have been moved or deleted.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link to="/">
            <motion.button
              className="px-6 py-3 rounded-md font-medium shadow-md"
              style={{
                background: isDark ? "#4f46e5" : "#6366f1",
                color: "#fff",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Home
            </motion.button>
          </Link>

          <motion.button
            className="px-6 py-3 rounded-md border font-medium"
            style={{
              borderColor: isDark ? "#4f46e5" : "#6366f1",
              color: isDark ? "#a5b4fc" : "#4f46e5",
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: isDark
                ? "rgba(79,70,229,0.15)"
                : "rgba(99,102,241,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            Go Back
          </motion.button>
        </div>
      </motion.div>

      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};

export default NotFound;
