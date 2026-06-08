import { motion } from "framer-motion";
import type { TimelineEntry } from "./types";

interface TimelineCardProps {
  entry: TimelineEntry;
  index: number;
  isLast: boolean;
  onClick: () => void;
}

const DIFFICULTY_COLORS = {
  Beginner: { text: "oklch(0.75 0.2 145)", bg: "oklch(0.75 0.2 145 / 12%)", border: "oklch(0.75 0.2 145 / 30%)" },
  Intermediate: { text: "oklch(0.82 0.18 170)", bg: "oklch(0.82 0.18 170 / 12%)", border: "oklch(0.82 0.18 170 / 30%)" },
  Advanced: { text: "oklch(0.7 0.22 320)", bg: "oklch(0.7 0.22 320 / 12%)", border: "oklch(0.7 0.22 320 / 30%)" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

export function TimelineCard({ entry, index, isLast, onClick }: TimelineCardProps) {
  const diffColors = DIFFICULTY_COLORS[entry.difficulty];
  const displayTags = entry.tags.slice(0, 4);

  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 1.5),
        ease: "easeOut",
      }}
    >
      {/* Timeline rail + node */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: "20px" }}>
        <motion.div
          className="relative flex-shrink-0 rounded-full cursor-pointer z-10"
          style={{
            width: "10px",
            height: "10px",
            background: diffColors.text,
            boxShadow: `0 0 8px ${diffColors.text}, 0 0 16px ${diffColors.text}`,
            marginTop: "10px",
          }}
          whileHover={{
            scale: 1.6,
            boxShadow: `0 0 16px ${diffColors.text}, 0 0 32px ${diffColors.text}`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={onClick}
        />
        {/* Connector line */}
        {!isLast && (
          <div
            className="flex-1 w-px mt-1"
            style={{
              background: "linear-gradient(to bottom, oklch(0.82 0.18 170 / 30%), oklch(0.82 0.18 170 / 05%))",
              minHeight: "24px",
            }}
          />
        )}
      </div>

      {/* Card */}
      <motion.button
        onClick={onClick}
        className="group relative mb-3 w-full text-left rounded-lg overflow-hidden transition-all duration-300 focus:outline-none"
        style={{
          background: "oklch(0.11 0.03 260 / 85%)",
          border: "1px solid oklch(0.25 0.04 260 / 60%)",
          backdropFilter: "blur(8px)",
        }}
        whileHover={{
          y: -2,
          transition: { type: "spring", stiffness: 400, damping: 25 },
        }}
        onHoverStart={(e) => {
          const el = e.target as HTMLElement;
          const card = el.closest("button");
          if (card) {
            card.style.border = `1px solid ${diffColors.text}40`;
            card.style.boxShadow = `0 0 20px ${diffColors.text}20, 0 4px 24px oklch(0.05 0.02 260 / 60%)`;
          }
        }}
        onHoverEnd={(e) => {
          const el = e.target as HTMLElement;
          const card = el.closest("button");
          if (card) {
            card.style.border = "1px solid oklch(0.25 0.04 260 / 60%)";
            card.style.boxShadow = "none";
          }
        }}
        aria-label={`Open entry: ${entry.title}`}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${diffColors.text}, transparent)` }}
        />

        <div className="px-3 py-2.5">
          {/* Date + Difficulty row */}
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-[9px] font-semibold tracking-widest"
              style={{ color: "oklch(0.55 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {formatDate(entry.date)}
            </span>
            <span
              className="text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded-sm uppercase"
              style={{
                color: diffColors.text,
                background: diffColors.bg,
                border: `1px solid ${diffColors.border}`,
              }}
            >
              {entry.difficulty}
            </span>
          </div>

          {/* Title */}
          <p
            className="text-xs font-semibold leading-snug mb-2 text-left line-clamp-2"
            style={{ color: "oklch(0.92 0.01 180)" }}
          >
            {entry.title}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="text-[8px] font-medium rounded px-1.5 py-0.5"
                style={{
                  color: "oklch(0.82 0.18 170 / 80%)",
                  background: "oklch(0.82 0.18 170 / 08%)",
                  border: "1px solid oklch(0.82 0.18 170 / 20%)",
                }}
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 4 && (
              <span
                className="text-[8px] font-medium rounded px-1.5 py-0.5"
                style={{
                  color: "oklch(0.55 0.03 220)",
                  background: "oklch(0.15 0.03 260 / 60%)",
                  border: "1px solid oklch(0.25 0.04 260 / 40%)",
                }}
              >
                +{entry.tags.length - 4}
              </span>
            )}
          </div>

          {/* Word count */}
          <div
            className="text-[9px] tracking-wide"
            style={{ color: "oklch(0.45 0.02 220)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {entry.wordCount.toLocaleString()} words
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
