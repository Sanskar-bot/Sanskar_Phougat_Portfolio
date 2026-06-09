import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface TimelineSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export function TimelineSearch({ value, onChange }: TimelineSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="relative mb-3"
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary opacity-60"
      />
      <input
        id="timeline-search"
        type="text"
        placeholder="Search title, tags, date..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md py-2 pl-8 pr-8 text-xs outline-none transition-all placeholder:text-muted-foreground"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid var(--neon-cyan)";
          e.currentTarget.style.boxShadow = "0 0 12px oklch(from var(--neon-cyan) l c h / 20%)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5 text-primary" />
        </button>
      )}
    </motion.div>
  );
}
