import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, RefreshCw, AlertTriangle, ExternalLink,
  Calendar, Tag, FileText, Zap, BookOpen, Cpu,
  ChevronDown, Filter, ArrowLeft,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import type { TimelineEntry, TimelineStats } from "@/components/timeline/types";

const TIMELINE_URL =
  "https://raw.githubusercontent.com/Sanskar-bot/Daily-Learnings/main/portfolio-data/timeline.json";
const STATS_URL =
  "https://raw.githubusercontent.com/Sanskar-bot/Daily-Learnings/main/portfolio-data/stats.json";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const CYAN   = "oklch(0.82 0.18 170)";
const GREEN  = "oklch(0.75 0.2 145)";
const PURPLE = "oklch(0.7 0.22 320)";
const DIM    = "oklch(0.50 0.03 220)";
const FAINT  = "oklch(0.35 0.02 220)";
const MONO   = "'JetBrains Mono', monospace";
const SANS   = "'Space Grotesk', sans-serif";

const DIFFICULTY_COLORS = {
  Beginner:     { text: "oklch(0.75 0.2 145)",  bg: "oklch(0.75 0.2 145 / 12%)",  border: "oklch(0.75 0.2 145 / 35%)"  },
  Intermediate: { text: "oklch(0.82 0.18 170)", bg: "oklch(0.82 0.18 170 / 12%)", border: "oklch(0.82 0.18 170 / 35%)" },
  Advanced:     { text: "oklch(0.7 0.22 320)",  bg: "oklch(0.7 0.22 320 / 12%)",  border: "oklch(0.7 0.22 320 / 35%)"  },
};

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/timeline")({
  component: TimelinePage,
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).toUpperCase();
}
function formatMonthYear(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "long", year: "numeric",
  });
}
function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const getDayStyle = (entry: TimelineEntry | undefined) => {
  if (!entry) return {};

  if (entry.difficulty === "Advanced") {
    return {
      background: "oklch(0.7 0.22 320 / 30%)",
      border: "1px solid oklch(0.7 0.22 320 / 80%)",
      color: "oklch(0.7 0.22 320)",
      boxShadow: "0 0 10px oklch(0.7 0.22 320 / 40%)",
    };
  }

  // Cyan activity levels based on word count
  if (entry.wordCount > 800) {
    return {
      background: "oklch(0.82 0.18 170 / 40%)",
      border: "1px solid oklch(0.82 0.18 170 / 90%)",
      color: "oklch(0.82 0.18 170)",
      boxShadow: "0 0 12px oklch(0.82 0.18 170 / 50%)",
    };
  } else if (entry.wordCount > 300) {
    return {
      background: "oklch(0.82 0.18 170 / 25%)",
      border: "1px solid oklch(0.82 0.18 170 / 60%)",
      color: "oklch(0.82 0.18 170)",
    };
  } else {
    return {
      background: "oklch(0.82 0.18 170 / 10%)",
      border: "1px solid oklch(0.82 0.18 170 / 30%)",
      color: "oklch(0.82 0.18 170 / 80%)",
    };
  }
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0 w-5 pt-2">
        <div className="h-3 w-3 rounded-full animate-pulse" style={{ background: "oklch(0.22 0.04 260)" }} />
        <div className="flex-1 w-px mt-2 animate-pulse" style={{ background: "oklch(0.16 0.03 260)", minHeight: 80 }} />
      </div>
      <div className="flex-1 mb-4 rounded-xl p-4 animate-pulse" style={{ background: "oklch(0.11 0.03 260)", border: "1px solid oklch(0.18 0.04 260 / 50%)" }}>
        <div className="flex justify-between mb-3">
          <div className="h-2.5 w-24 rounded" style={{ background: "oklch(0.18 0.03 260)" }} />
          <div className="h-2.5 w-16 rounded" style={{ background: "oklch(0.18 0.03 260)" }} />
        </div>
        <div className="h-4 w-3/4 rounded mb-2" style={{ background: "oklch(0.18 0.03 260)" }} />
        <div className="h-3 w-full rounded mb-1" style={{ background: "oklch(0.15 0.03 260)" }} />
        <div className="h-3 w-2/3 rounded mb-3" style={{ background: "oklch(0.15 0.03 260)" }} />
        <div className="flex gap-2">
          {[50, 65, 55, 70].map((w, i) => (
            <div key={i} className="h-2.5 rounded" style={{ width: w, background: "oklch(0.16 0.03 260)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Entry Card (full page version) ────────────────────────────────────────────
function EntryCard({
  entry, index, isLast, onClick, isSelected,
}: {
  entry: TimelineEntry; index: number; isLast: boolean;
  onClick: () => void; isSelected: boolean;
}) {
  const dc = DIFFICULTY_COLORS[entry.difficulty];

  return (
    <motion.div
      id={`card-${entry.id}`}
      className="flex gap-4 scroll-mt-28"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 1.2), ease: "easeOut" }}
    >
      {/* Rail */}
      <div className="flex flex-col items-center flex-shrink-0 w-5 pt-3">
        <motion.div
          className="h-3 w-3 rounded-full cursor-pointer z-10 flex-shrink-0"
          style={{
            background: dc.text,
            boxShadow: isSelected ? `0 0 14px ${dc.text}, 0 0 28px ${dc.text}` : `0 0 6px ${dc.text}`,
          }}
          whileHover={{ scale: 1.7, boxShadow: `0 0 16px ${dc.text}, 0 0 32px ${dc.text}` }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          onClick={onClick}
        />
        {!isLast && (
          <div
            className="flex-1 w-px mt-2"
            style={{ background: "linear-gradient(to bottom, oklch(0.82 0.18 170 / 20%), transparent)", minHeight: 32 }}
          />
        )}
      </div>

      {/* Card */}
      <motion.button
        onClick={onClick}
        className="group relative flex-1 mb-4 text-left rounded-xl overflow-hidden focus:outline-none"
        style={{
          background: isSelected ? "oklch(0.13 0.04 260 / 90%)" : "oklch(0.10 0.03 260 / 85%)",
          border: isSelected ? `1.5px solid ${dc.text}` : "1px solid oklch(0.22 0.04 260 / 60%)",
          boxShadow: isSelected ? `0 0 24px ${dc.text}18, 0 4px 32px oklch(0.04 0.02 260 / 60%)` : "none",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
        }}
        whileHover={{ y: -2, transition: { type: "spring", stiffness: 400, damping: 28 } }}
        aria-label={`Open: ${entry.title}`}
      >
        {/* Hover top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${dc.text}, transparent)` }}
        />

        <div className="px-4 py-3.5">
          {/* Date + Difficulty */}
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] font-semibold tracking-widest"
              style={{ color: "oklch(0.50 0.03 220)", fontFamily: MONO }}
            >
              {formatDate(entry.date)}
            </span>
            <span
              className="text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
              style={{ color: dc.text, background: dc.bg, border: `1px solid ${dc.border}` }}
            >
              {entry.difficulty}
            </span>
          </div>

          {/* Title */}
          <p className="text-sm font-semibold leading-snug mb-2 line-clamp-2" style={{ color: "oklch(0.92 0.01 180)" }}>
            {entry.title}
          </p>

          {/* Summary */}
          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "oklch(0.58 0.02 210)" }}>
            {entry.summary}
          </p>

          {/* Tags + Word count */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {entry.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[8px] rounded px-1.5 py-0.5 truncate"
                  style={{ color: "oklch(0.82 0.18 170 / 75%)", background: "oklch(0.82 0.18 170 / 07%)", border: "1px solid oklch(0.82 0.18 170 / 18%)" }}
                >
                  #{t}
                </span>
              ))}
              {entry.tags.length > 4 && (
                <span className="text-[8px] rounded px-1.5 py-0.5" style={{ color: "oklch(0.45 0.02 220)", background: "oklch(0.14 0.03 260 / 60%)", border: "1px solid oklch(0.22 0.04 260 / 40%)" }}>
                  +{entry.tags.length - 4}
                </span>
              )}
            </div>
            <span className="text-[9px] flex-shrink-0" style={{ color: "oklch(0.40 0.02 220)", fontFamily: MONO }}>
              {entry.wordCount.toLocaleString()} w
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ── Details Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ entry }: { entry: TimelineEntry | null }) {
  if (!entry) {
    return (
      <div 
        className="rounded-xl p-6 text-center border border-dashed border-muted/30"
        style={{ background: "oklch(0.10 0.03 260 / 60%)" }}
      >
        <BookOpen className="h-5 w-5 mx-auto mb-2 text-muted-foreground opacity-60" />
        <p className="text-xs font-semibold mb-1" style={{ color: "oklch(0.60 0.03 220)" }}>Select a Date</p>
        <p className="text-[10px] text-muted-foreground">Click any highlighted calendar date or list card to inspect detail logs.</p>
      </div>
    );
  }

  const dc = DIFFICULTY_COLORS[entry.difficulty];

  return (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-5 border"
      style={{
        background: "oklch(0.11 0.03 260 / 80%)",
        borderColor: dc.border,
        boxShadow: `0 0 20px ${dc.text}10`,
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" style={{ color: dc.text }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "oklch(0.50 0.03 220)", fontFamily: MONO }}>
            {formatDate(entry.date)}
          </span>
        </div>
        <span
          className="text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
          style={{ color: dc.text, background: dc.bg, border: `1px solid ${dc.border}` }}
        >
          {entry.difficulty}
        </span>
      </div>

      <h3 className="text-sm font-bold text-white mb-3 leading-snug" style={{ fontFamily: SANS }}>
        {entry.title}
      </h3>

      <div className="space-y-4">
        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest block mb-1 text-muted-foreground" style={{ fontFamily: MONO }}>
            // Summary
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
            {entry.summary}
          </p>
        </div>

        <div className="h-px style-border" style={{ background: "oklch(0.18 0.04 260 / 50%)" }} />

        <div className="grid grid-cols-2 gap-3 text-[10px]" style={{ fontFamily: MONO }}>
          <div>
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider mb-1">// Word Count</span>
            <span className="text-white font-semibold">{entry.wordCount} words</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[9px] uppercase tracking-wider mb-1">// Source</span>
            <span className="text-white truncate block">{entry.sourceFile}</span>
          </div>
        </div>

        <div>
          <span className="text-[8px] font-bold uppercase tracking-widest block mb-1.5 text-muted-foreground" style={{ fontFamily: MONO }}>
            // Technologies & Tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((t) => (
              <span 
                key={t} 
                className="px-2 py-0.5 rounded text-[9px]" 
                style={{ 
                  color: "oklch(0.82 0.18 170 / 85%)", 
                  background: "oklch(0.82 0.18 170 / 08%)", 
                  border: "1px solid oklch(0.82 0.18 170 / 22%)" 
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        <motion.a
          href={entry.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-widest"
          style={{
            background: "oklch(0.82 0.18 170 / 10%)",
            border: `1px solid oklch(0.82 0.18 170 / 38%)`,
            color: "oklch(0.82 0.18 170)",
          }}
          whileHover={{ background: "oklch(0.82 0.18 170 / 18%)" }}
          whileTap={{ scale: 0.98 }}
        >
          View GitHub Commit <ExternalLink className="h-3 w-3" />
        </motion.a>
      </div>
    </motion.div>
  );
}

// ── Interactive Learning Calendar & Heatmap Sidebar ──────────────────────────
function LearningCalendarSidebar({
  entries,
  selected,
  setSelected,
  currentMonth,
  setCurrentMonth,
  statsCalculations,
  sorted,
}: {
  entries: TimelineEntry[] | undefined;
  selected: TimelineEntry | null;
  setSelected: (entry: TimelineEntry | null) => void;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  statsCalculations: any;
  sorted: TimelineEntry[];
}) {
  const [viewMode, setViewMode] = useState<"calendar" | "heatmap">("calendar");
  const [hoveredDay, setHoveredDay] = useState<{ entry: TimelineEntry; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group entries by exact YYYY-MM-DD
  const entriesByDate = useMemo(() => {
    const map = new Map<string, TimelineEntry>();
    if (!entries) return map;
    entries.forEach((e) => {
      map.set(e.date.split("T")[0], e);
    });
    return map;
  }, [entries]);

  // Generate calendar days
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startDayOfWeek = firstDay.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentMonth]);

  // Generate heatmap weeks (columns)
  const heatmapWeeks = useMemo(() => {
    if (!entries) return [];
    const latestDate = sorted && sorted.length > 0 ? new Date(sorted[0].date) : new Date();
    const startDate = new Date(latestDate);
    startDate.setDate(latestDate.getDate() - 17 * 7); // 18 weeks back
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay); // Align to Sunday

    const weeks = [];
    let currentDay = new Date(startDate);
    for (let w = 0; w < 18; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [entries, sorted]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (entry: TimelineEntry) => {
    setSelected(entry);
    const cardEl = document.getElementById(`card-${entry.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, entry: TimelineEntry) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setHoveredDay({
        entry,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-6">
      {/* View Switcher Toggle */}
      <div className="flex justify-between items-center rounded-xl p-1 border border-muted/30" style={{ background: "oklch(0.10 0.03 260 / 60%)" }}>
        <button
          onClick={() => setViewMode("calendar")}
          className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
          style={{
            background: viewMode === "calendar" ? "oklch(0.82 0.18 170)" : "transparent",
            color: viewMode === "calendar" ? "black" : "oklch(0.65 0.03 220)",
          }}
        >
          Calendar View
        </button>
        <button
          onClick={() => setViewMode("heatmap")}
          className="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
          style={{
            background: viewMode === "heatmap" ? "oklch(0.82 0.18 170)" : "transparent",
            color: viewMode === "heatmap" ? "black" : "oklch(0.65 0.03 220)",
          }}
        >
          Heatmap View
        </button>
      </div>

      {/* Calendar Panel */}
      {viewMode === "calendar" ? (
        <div className="rounded-xl p-4 border border-muted/30" style={{ background: "oklch(0.10 0.03 260 / 80%)" }}>
          {/* Month Navigator */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:text-white text-muted-foreground transition-colors font-bold text-sm">
              &larr;
            </button>
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:text-white text-muted-foreground transition-colors font-bold text-sm">
              &rarr;
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-muted-foreground uppercase mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Grid of Days */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} />;
              const dateKey = date.toISOString().split("T")[0];
              const entry = entriesByDate.get(dateKey);
              const isSel = selected?.id === entry?.id;
              const dayStyle = getDayStyle(entry);

              return (
                <div key={dateKey} className="relative">
                  <motion.button
                    onClick={() => entry && handleDayClick(entry)}
                    onMouseEnter={(e) => entry && handleMouseEnter(e, entry)}
                    onMouseLeave={() => setHoveredDay(null)}
                    disabled={!entry}
                    className="w-8 h-8 rounded-md text-[10px] flex items-center justify-center font-medium transition-all"
                    style={{
                      background: "oklch(0.12 0.03 260)",
                      color: entry ? "white" : "oklch(0.35 0.02 220)",
                      border: "1px solid oklch(0.18 0.03 260)",
                      ...dayStyle,
                      ...(isSel ? { border: `1.5px solid oklch(0.82 0.18 170)`, boxShadow: `0 0 10px oklch(0.82 0.18 170)` } : {}),
                    }}
                    whileHover={entry ? { scale: 1.15 } : {}}
                  >
                    {date.getDate()}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Heatmap Panel */
        <div className="rounded-xl p-4 border border-muted/30 overflow-x-auto scrollbar-hide" style={{ background: "oklch(0.10 0.03 260 / 80%)" }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">// Heatmap Log (Last 18 Weeks)</span>
            
            <div className="flex gap-1.5">
              <div className="flex flex-col justify-between text-[8px] text-muted-foreground pr-1 pt-1.5 h-20">
                <span>Su</span>
                <span>Tu</span>
                <span>Th</span>
                <span>Sa</span>
              </div>

              <div className="flex gap-1">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1">
                    {week.map((date) => {
                      const dateKey = date.toISOString().split("T")[0];
                      const entry = entriesByDate.get(dateKey);
                      const isSel = selected?.id === entry?.id;
                      const dayStyle = getDayStyle(entry);

                      return (
                        <motion.button
                          key={dateKey}
                          onClick={() => entry && handleDayClick(entry)}
                          onMouseEnter={(e) => entry && handleMouseEnter(e, entry)}
                          onMouseLeave={() => setHoveredDay(null)}
                          disabled={!entry}
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{
                            background: "oklch(0.12 0.03 260)",
                            border: "1px solid oklch(0.15 0.03 260)",
                            ...dayStyle,
                            ...(isSel ? { border: `1px solid oklch(0.82 0.18 170)`, boxShadow: `0 0 4px oklch(0.82 0.18 170)` } : {}),
                          }}
                          whileHover={entry ? { scale: 1.3 } : {}}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end items-center gap-1.5 mt-3 text-[9px] text-muted-foreground">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.12 0.03 260)" }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.82 0.18 170 / 10%)", border: "1px solid oklch(0.82 0.18 170 / 30%)" }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.82 0.18 170 / 25%)", border: "1px solid oklch(0.82 0.18 170 / 60%)" }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.82 0.18 170 / 40%)", border: "1px solid oklch(0.82 0.18 170 / 90%)" }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.7 0.22 320 / 30%)", border: "1px solid oklch(0.7 0.22 320 / 80%)" }} />
              <span>More</span>
            </div>
          </div>
        </div>
      )}

      {/* Hover Info Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-50 p-3 rounded-lg border text-[10px] w-52 leading-relaxed pointer-events-none"
            style={{
              top: hoveredDay.y - 130,
              left: Math.max(10, Math.min(130, hoveredDay.x - 104)),
              background: "oklch(0.09 0.03 260 / 95%)",
              borderColor: "oklch(0.25 0.04 260 / 80%)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.9)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="font-semibold text-white truncate mb-1">{hoveredDay.entry.title}</div>
            <div style={{ color: DIM }} className="mb-1">{formatDate(hoveredDay.entry.date)}</div>
            <div className="flex gap-2 mb-1.5">
              <span className="font-semibold" style={{ color: hoveredDay.entry.difficulty === "Advanced" ? PURPLE : CYAN }}>
                {hoveredDay.entry.difficulty}
              </span>
              <span style={{ color: FAINT }}>•</span>
              <span className="text-white">{hoveredDay.entry.wordCount} words</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {hoveredDay.entry.tags.slice(0, 3).map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[8px] bg-muted/20 text-muted-foreground font-mono">#{t}</span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Learning Statistics */}
      <div className="rounded-xl p-4 border border-muted/30 space-y-3" style={{ background: "oklch(0.10 0.03 260 / 60%)", fontFamily: MONO }}>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">// Streak & Logs Dashboard</span>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="p-2 rounded bg-muted/05 border border-muted/15">
            <span style={{ color: DIM }} className="block">Current Streak</span>
            <span className="text-sm font-bold text-white mt-1 block">{statsCalculations.currentStreak} Days</span>
          </div>
          <div className="p-2 rounded bg-muted/05 border border-muted/15">
            <span style={{ color: DIM }} className="block">Longest Streak</span>
            <span className="text-sm font-bold text-white mt-1 block">{statsCalculations.longestStreak} Days</span>
          </div>
          <div className="p-2 rounded bg-muted/05 border border-muted/15">
            <span style={{ color: DIM }} className="block">Month Logs</span>
            <span className="text-sm font-bold text-white mt-1 block">{statsCalculations.entriesThisMonth} Days</span>
          </div>
          <div className="p-2 rounded bg-muted/05 border border-muted/15">
            <span style={{ color: DIM }} className="block">Month Words</span>
            <span className="text-sm font-bold text-white mt-1 block">{statsCalculations.wordsThisMonth.toLocaleString()}</span>
          </div>
        </div>
        <div className="p-2.5 rounded bg-muted/05 border border-muted/15 text-[10px] flex justify-between items-center">
          <span style={{ color: DIM }}>Advanced Logs This Month</span>
          <span className="text-xs font-bold" style={{ color: PURPLE }}>{statsCalculations.advancedThisMonth} Days</span>
        </div>
      </div>

      {/* Details Panel content displaying here */}
      <DetailPanel entry={selected} />
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ stats }: { stats: TimelineStats }) {
  const items = [
    { icon: BookOpen, value: stats.totalLearningDays, label: "Days Logged" },
    { icon: Cpu,      value: stats.totalTechnologies,  label: "Technologies" },
    { icon: Tag,      value: stats.totalTags,           label: "Tags" },
    { icon: FileText, value: stats.totalWordsWritten.toLocaleString(), label: "Words Written" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {items.map(({ icon: Icon, value, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="relative flex flex-col items-center justify-center rounded-xl py-4 px-3 overflow-hidden"
          style={{ background: "oklch(0.11 0.04 260 / 80%)", border: "1px solid oklch(0.82 0.18 170 / 18%)", backdropFilter: "blur(12px)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, oklch(0.82 0.18 170 / 45%), transparent)" }} />
          <Icon className="h-4 w-4 mb-1.5" style={{ color: "oklch(0.82 0.18 170 / 55%)" }} />
          <span className="text-2xl font-bold leading-none" style={{ color: "oklch(0.85 0.16 195)", fontFamily: MONO }}>
            {value}
          </span>
          <span className="mt-1 text-[9px] font-semibold tracking-widest uppercase text-center" style={{ color: "oklch(0.48 0.02 220)" }}>
            {label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="h-14 w-14 flex items-center justify-center rounded-full" style={{ background: "oklch(0.7 0.22 320 / 12%)", border: "1px solid oklch(0.7 0.22 320 / 30%)" }}>
        <AlertTriangle className="h-6 w-6" style={{ color: "oklch(0.7 0.22 320)" }} />
      </div>
      <p className="text-sm font-semibold" style={{ color: "oklch(0.75 0.02 200)" }}>Timeline temporarily unavailable</p>
      <motion.button onClick={onRetry} className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-widest" style={{ background: "oklch(0.82 0.18 170 / 10%)", border: "1px solid oklch(0.82 0.18 170 / 30%)", color: "oklch(0.82 0.18 170)" }} whileHover={{ background: "oklch(0.82 0.18 170 / 18%)" }} whileTap={{ scale: 0.96 }}>
        <RefreshCw className="h-3.5 w-3.5" />Retry
      </motion.button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
function TimelinePage() {
  useEffect(() => {
    document.title = "Learning Timeline — Sanskar Phougat";
  }, []);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TimelineEntry | null>(null);
  const [diffFilter, setDiffFilter] = useState<string>("All");
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: entries, isLoading: el, isError: ee, refetch } = useQuery<TimelineEntry[]>({
    queryKey: ["timeline"],
    queryFn: async () => { const r = await fetch(TIMELINE_URL); if (!r.ok) throw new Error(); return r.json(); },
    staleTime: 600_000, retry: 2,
  });
  const { data: stats, isLoading: sl } = useQuery<TimelineStats>({
    queryKey: ["timeline-stats"],
    queryFn: async () => { const r = await fetch(STATS_URL); if (!r.ok) throw new Error(); return r.json(); },
    staleTime: 600_000, retry: 2,
  });

  const sorted = useMemo(() => entries ? [...entries].reverse() : [], [entries]);

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date(2026, 5)); // Initialized to June 2026

  useEffect(() => {
    if (sorted && sorted.length > 0) {
      const latestDate = new Date(sorted[0].date);
      setCurrentMonth(new Date(latestDate.getFullYear(), latestDate.getMonth(), 1));
    }
  }, [sorted]);

  // All unique tags for filter
  const allTags = useMemo(() => {
    if (!entries) return [];
    const set = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let list = sorted;
    if (diffFilter !== "All") list = list.filter((e) => e.difficulty === diffFilter);
    if (tagFilter !== "All") list = list.filter((e) => e.tags.includes(tagFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.date.includes(q) ||
          e.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sorted, search, diffFilter, tagFilter]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; entries: TimelineEntry[] }>();
    filtered.forEach((e) => {
      const key = monthKey(e.date);
      if (!map.has(key)) map.set(key, { label: formatMonthYear(e.date), entries: [] });
      map.get(key)!.entries.push(e);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const statsCalculations = useMemo(() => {
    if (!entries || entries.length === 0) {
      return { currentStreak: 0, longestStreak: 0, entriesThisMonth: 0, wordsThisMonth: 0, advancedThisMonth: 0 };
    }

    const chronological = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dateSet = new Set(chronological.map(e => e.date.split("T")[0]));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const uniqueDates = Array.from(dateSet).map(d => new Date(d));
    
    if (uniqueDates.length > 0) {
      let prevDate: Date | null = null;
      uniqueDates.forEach((date) => {
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const diffTime = Math.abs(date.getTime() - prevDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            tempStreak += 1;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        prevDate = date;
      });

      const latestEntryDateStr = chronological[chronological.length - 1].date.split("T")[0];
      const latestEntryDate = new Date(latestEntryDateStr);
      
      let checkDate = new Date(latestEntryDate);
      while (true) {
        const checkKey = checkDate.toISOString().split("T")[0];
        if (dateSet.has(checkKey)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthEntries = entries.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const entriesThisMonth = monthEntries.length;
    const wordsThisMonth = monthEntries.reduce((acc, e) => acc + e.wordCount, 0);
    const advancedThisMonth = monthEntries.filter(e => e.difficulty === "Advanced").length;

    return { currentStreak, longestStreak, entriesThisMonth, wordsThisMonth, advancedThisMonth };
  }, [entries, currentMonth]);

  const isLoading = el || sl;

  return (
    <div className="relative min-h-screen grid-bg" style={{ background: "oklch(0.08 0.02 260)" }}>
      <CustomCursor />
      <Navbar />

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.15 0.05 280 / 40%) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-20">
        {/* Back Link */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary" style={{ color: "oklch(0.50 0.03 220)" }}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: "oklch(0.82 0.18 170 / 50%)" }} />
            <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: "oklch(0.82 0.18 170 / 60%)", fontFamily: MONO }}>
              ~/daily-learnings
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
              <span className="text-[8px] tracking-widest uppercase" style={{ color: "oklch(0.55 0.03 220)", fontFamily: MONO }}>live</span>
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: SANS }}>
            Learning <span className="text-gradient">Timeline</span>
          </h1>
          <p className="mt-3 text-sm max-w-xl" style={{ color: "oklch(0.60 0.03 220)" }}>
            A live archive of every learning session — cybersecurity, cryptography, tooling, and beyond.
          </p>
        </motion.div>

        {/* Stats Bar */}
        {stats && !isLoading && <StatsBar stats={stats} />}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl h-24 animate-pulse" style={{ background: "oklch(0.12 0.04 260)" }} />
            ))}
          </div>
        )}

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "oklch(0.82 0.18 170 / 50%)" }} />
            <input
              ref={searchRef}
              id="timeline-page-search"
              type="text"
              placeholder="Search title, tags, summary, date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl py-3 pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground transition-all"
              style={{ background: "oklch(0.11 0.03 260 / 90%)", border: "1px solid oklch(0.25 0.04 260 / 60%)", color: "oklch(0.92 0.01 180)", fontFamily: MONO }}
              onFocus={(e) => { e.currentTarget.style.border = `1px solid ${CYAN}55`; e.currentTarget.style.boxShadow = `0 0 16px ${CYAN}15`; }}
              onBlur={(e) => { e.currentTarget.style.border = "1px solid oklch(0.25 0.04 260 / 60%)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" style={{ color: "oklch(0.82 0.18 170)" }} />
              </button>
            )}
          </div>

          <motion.button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-widest flex-shrink-0 transition-all"
            style={{
              background: filterOpen ? "oklch(0.82 0.18 170 / 15%)" : "oklch(0.11 0.03 260 / 90%)",
              border: filterOpen ? "1px solid oklch(0.82 0.18 170 / 50%)" : "1px solid oklch(0.25 0.04 260 / 60%)",
              color: filterOpen ? "oklch(0.82 0.18 170)" : "oklch(0.60 0.03 220)",
            }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {(diffFilter !== "All" || tagFilter !== "All") && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: "oklch(0.82 0.18 170)", color: "oklch(0.1 0.02 260)" }}>
                {(diffFilter !== "All" ? 1 : 0) + (tagFilter !== "All" ? 1 : 0)}
              </span>
            )}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`} />
          </motion.button>
        </motion.div>

        {/* Dynamic Filters Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-xl p-4 space-y-4" style={{ background: "oklch(0.10 0.03 260 / 90%)", border: "1px solid oklch(0.22 0.04 260 / 60%)" }}>
                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-2" style={{ color: "oklch(0.45 0.02 220)" }}>Difficulty</p>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Beginner", "Intermediate", "Advanced"].map((d) => {
                      const dc = d !== "All" ? DIFFICULTY_COLORS[d as keyof typeof DIFFICULTY_COLORS] : null;
                      return (
                        <button
                          key={d}
                          onClick={() => setDiffFilter(d)}
                          className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all"
                          style={{
                            background: diffFilter === d ? (dc ? dc.bg : "oklch(0.82 0.18 170 / 18%)") : "oklch(0.14 0.03 260)",
                            border: diffFilter === d ? `1px solid ${dc ? dc.border : "oklch(0.82 0.18 170 / 50%)"}` : "1px solid oklch(0.22 0.04 260 / 50%)",
                            color: diffFilter === d ? (dc ? dc.text : "oklch(0.82 0.18 170)") : "oklch(0.50 0.03 220)",
                          }}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-2" style={{ color: "oklch(0.45 0.02 220)" }}>Technology / Tag</p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
                    {["All", ...allTags].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTagFilter(t)}
                        className="rounded px-2 py-1 text-[9px] font-medium transition-all"
                        style={{
                          background: tagFilter === t ? "oklch(0.82 0.18 170 / 14%)" : "oklch(0.14 0.03 260)",
                          border: tagFilter === t ? "1px solid oklch(0.82 0.18 170 / 45%)" : "1px solid oklch(0.20 0.04 260 / 50%)",
                          color: tagFilter === t ? "oklch(0.82 0.18 170)" : "oklch(0.48 0.03 220)",
                        }}
                      >
                        {t === "All" ? "All Tags" : `#${t}`}
                      </button>
                    ))}
                  </div>
                </div>

                {(diffFilter !== "All" || tagFilter !== "All") && (
                  <button onClick={() => { setDiffFilter("All"); setTagFilter("All"); }} className="text-[9px] font-bold uppercase tracking-widest transition-colors hover:text-primary" style={{ color: "oklch(0.55 0.03 220)" }}>
                    ✕ Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Counter */}
        <AnimatePresence>
          {(search || diffFilter !== "All" || tagFilter !== "All") && !isLoading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] mb-5" style={{ color: "oklch(0.50 0.03 220)", fontFamily: MONO }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
            </motion.p>
          )}
        </AnimatePresence>

        {/* Layout Grid */}
        {isLoading ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div>{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
            <div className="rounded-xl h-96 animate-pulse" style={{ background: "oklch(0.12 0.04 260)" }} />
          </div>
        ) : ee ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Left: Interactive Timeline Card Stack */}
            <div>
              {grouped.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm" style={{ color: "oklch(0.45 0.02 220)" }}>No entries match your search.</p>
                </div>
              ) : (
                grouped.map(([key, group], gi) => {
                  const prevCount = grouped.slice(0, gi).reduce((acc, [, g]) => acc + g.entries.length, 0);
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: gi * 0.05 }}
                      className="mb-8"
                    >
                      {/* Month Header Banner */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-xs font-bold tracking-widest uppercase"
                          style={{ color: "oklch(0.82 0.18 170 / 70%)", fontFamily: MONO }}
                        >
                          {group.label}
                        </span>
                        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, oklch(0.82 0.18 170 / 25%), transparent)" }} />
                        <span className="text-[9px]" style={{ color: "oklch(0.40 0.02 220)" }}>
                          {group.entries.length} {group.entries.length === 1 ? "entry" : "entries"}
                        </span>
                      </div>

                      {group.entries.map((entry, i) => (
                        <EntryCard
                          key={entry.id}
                          entry={entry}
                          index={prevCount + i}
                          isLast={i === group.entries.length - 1}
                          onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
                          isSelected={selected?.id === entry.id}
                        />
                      ))}
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Right Sticky Sidebar: Interactive Learning Calendar & Heatmap Dashboard */}
            <div className="sticky top-24">
              <LearningCalendarSidebar
                entries={entries}
                selected={selected}
                setSelected={setSelected}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                statsCalculations={statsCalculations}
                sorted={sorted}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
