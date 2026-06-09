import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="relative flex items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        width: 52,
        height: 26,
        background: isLight
          ? "oklch(0.88 0.012 240)"
          : "oklch(0.14 0.035 260)",
        border: "1px solid var(--border)",
        boxShadow: isLight
          ? "inset 0 1px 3px oklch(0.60 0.015 240 / 30%)"
          : "inset 0 1px 3px oklch(0 0 0 / 40%), 0 0 8px var(--neon-cyan, oklch(0.82 0.18 170) / 20%)",
      }}
    >
      {/* Sliding thumb */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 20,
          height: 20,
          left: isLight ? 28 : 2,
          background: isLight
            ? "oklch(0.97 0.005 80)"
            : "oklch(0.82 0.18 170)",
          boxShadow: isLight
            ? "0 1px 4px oklch(0.60 0.015 240 / 40%)"
            : "0 0 8px oklch(0.82 0.18 170 / 70%)",
        }}
      >
        {isLight ? (
          <Sun
            style={{ width: 11, height: 11, color: "oklch(0.65 0.15 70)" }}
            strokeWidth={2.5}
          />
        ) : (
          <Moon
            style={{ width: 10, height: 10, color: "oklch(0.08 0.02 260)" }}
            strokeWidth={2.5}
          />
        )}
      </motion.div>

      {/* Background icon (not active) */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: isLight ? 4 : "auto",
          right: isLight ? "auto" : 4,
          opacity: 0.45,
        }}
      >
        {isLight ? (
          <Moon
            style={{ width: 10, height: 10, color: "var(--muted-foreground)" }}
            strokeWidth={2}
          />
        ) : (
          <Sun
            style={{ width: 11, height: 11, color: "var(--muted-foreground)" }}
            strokeWidth={2}
          />
        )}
      </div>
    </button>
  );
}
