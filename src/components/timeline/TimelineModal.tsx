import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Calendar, Tag, FileText, Zap } from "lucide-react";
import type { TimelineEntry } from "./types";

interface TimelineModalProps {
  entry: TimelineEntry | null;
  onClose: () => void;
}

const DIFFICULTY_COLORS = {
  Beginner: { text: "oklch(0.75 0.2 145)", bg: "oklch(0.75 0.2 145 / 12%)", border: "oklch(0.75 0.2 145 / 40%)" },
  Intermediate: { text: "oklch(0.82 0.18 170)", bg: "oklch(0.82 0.18 170 / 12%)", border: "oklch(0.82 0.18 170 / 40%)" },
  Advanced: { text: "oklch(0.7 0.22 320)", bg: "oklch(0.7 0.22 320 / 12%)", border: "oklch(0.7 0.22 320 / 40%)" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export function TimelineModal({ entry, onClose }: TimelineModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!entry) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entry, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (entry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [entry]);

  const diffColors = entry ? DIFFICULTY_COLORS[entry.difficulty] : DIFFICULTY_COLORS.Beginner;

  return (
    <AnimatePresence>
      {entry && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50"
            style={{ background: "oklch(0.04 0.02 260 / 80%)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto"
            style={{
              background: "oklch(0.09 0.03 260)",
              borderLeft: `1px solid ${diffColors.border}`,
              boxShadow: `-20px 0 60px oklch(0.05 0.02 260 / 80%), 0 0 40px ${diffColors.text}15`,
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
          >
            {/* Top accent glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${diffColors.text}, transparent)` }}
            />

            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5"
              style={{
                background: "oklch(0.09 0.03 260 / 95%)",
                borderBottom: "1px solid oklch(0.2 0.04 260 / 60%)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex-1 min-w-0">
                {/* Date */}
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 flex-shrink-0" style={{ color: diffColors.text }} />
                  <span
                    className="text-[10px] font-semibold tracking-widest uppercase"
                    style={{ color: "oklch(0.55 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {formatDate(entry.date)}
                  </span>
                  <span
                    className="ml-auto text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm uppercase flex-shrink-0"
                    style={{
                      color: diffColors.text,
                      background: diffColors.bg,
                      border: `1px solid ${diffColors.border}`,
                    }}
                  >
                    {entry.difficulty}
                  </span>
                </div>
                <h2
                  className="text-sm font-bold leading-snug"
                  style={{ color: "oklch(0.96 0.01 180)", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {entry.title}
                </h2>
              </div>

              <motion.button
                onClick={onClose}
                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                style={{ background: "oklch(0.15 0.03 260)" }}
                whileHover={{ background: "oklch(0.20 0.04 260)", scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" style={{ color: "oklch(0.65 0.03 220)" }} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Summary */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-3 w-3" style={{ color: diffColors.text }} />
                  <span
                    className="text-[9px] font-bold tracking-widest uppercase"
                    style={{ color: "oklch(0.55 0.03 220)" }}
                  >
                    Summary
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed whitespace-pre-line"
                  style={{ color: "oklch(0.75 0.02 200)" }}
                >
                  {entry.summary}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px" style={{ background: "oklch(0.2 0.04 260 / 60%)" }} />

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Tag className="h-3 w-3" style={{ color: diffColors.text }} />
                  <span
                    className="text-[9px] font-bold tracking-widest uppercase"
                    style={{ color: "oklch(0.55 0.03 220)" }}
                  >
                    Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium rounded-md px-2 py-1"
                      style={{
                        color: "oklch(0.82 0.18 170 / 90%)",
                        background: "oklch(0.82 0.18 170 / 08%)",
                        border: "1px solid oklch(0.82 0.18 170 / 25%)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div
                className="flex items-center gap-4 rounded-lg px-4 py-3"
                style={{
                  background: "oklch(0.12 0.03 260 / 60%)",
                  border: "1px solid oklch(0.2 0.04 260 / 60%)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" style={{ color: diffColors.text }} />
                  <span className="text-xs" style={{ color: "oklch(0.65 0.03 220)" }}>
                    <span
                      className="font-bold mr-1"
                      style={{ color: "oklch(0.92 0.01 180)", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {entry.wordCount.toLocaleString()}
                    </span>
                    words
                  </span>
                </div>
                <div
                  className="h-4 w-px"
                  style={{ background: "oklch(0.25 0.04 260)" }}
                />
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: diffColors.text }}
                  >
                    {entry.difficulty}
                  </span>
                </div>
              </div>

              {/* GitHub Button */}
              <motion.a
                href={entry.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-lg py-3 text-xs font-bold uppercase tracking-widest transition-all"
                style={{
                  background: "oklch(0.82 0.18 170 / 12%)",
                  border: `1px solid oklch(0.82 0.18 170 / 40%)`,
                  color: "oklch(0.82 0.18 170)",
                  boxShadow: "0 0 20px oklch(0.82 0.18 170 / 10%)",
                }}
                whileHover={{
                  background: "oklch(0.82 0.18 170 / 20%)",
                  boxShadow: "0 0 30px oklch(0.82 0.18 170 / 25%)",
                  scale: 1.01,
                }}
                whileTap={{ scale: 0.98 }}
                aria-label="Open on GitHub"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
                <ExternalLink className="h-3 w-3 opacity-70" />
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
