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

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/timeline")({
  component: TimelinePage,
});

// ── Constants ─────────────────────────────────────────────────────────────────
const DIFFICULTY_COLORS = {
  Beginner:     { text: "oklch(0.75 0.2 145)",  bg: "oklch(0.75 0.2 145 / 12%)",  border: "oklch(0.75 0.2 145 / 35%)"  },
  Intermediate: { text: "oklch(0.82 0.18 170)", bg: "oklch(0.82 0.18 170 / 12%)", border: "oklch(0.82 0.18 170 / 35%)" },
  Advanced:     { text: "oklch(0.7 0.22 320)",  bg: "oklch(0.7 0.22 320 / 12%)",  border: "oklch(0.7 0.22 320 / 35%)"  },
};

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
      className="flex gap-4"
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
          border: isSelected ? `1px solid ${dc.border}` : "1px solid oklch(0.22 0.04 260 / 60%)",
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
              style={{ color: "oklch(0.50 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}
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
            <span className="text-[9px] flex-shrink-0" style={{ color: "oklch(0.40 0.02 220)", fontFamily: "'JetBrains Mono', monospace" }}>
              {entry.wordCount.toLocaleString()} w
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({ entry, onClose }: { entry: TimelineEntry | null; onClose: () => void }) {
  useCallback(() => {
    if (!entry) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [entry, onClose]);

  const dc = entry ? DIFFICULTY_COLORS[entry.difficulty] : DIFFICULTY_COLORS.Beginner;

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
          className="sticky top-24 flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.09 0.03 260)",
            border: `1px solid ${dc.border}`,
            boxShadow: `0 0 40px ${dc.text}12, 0 20px 60px oklch(0.04 0.02 260 / 80%)`,
            maxHeight: "calc(100vh - 8rem)",
          }}
        >
          {/* Glow top */}
          <div className="h-px w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${dc.text}, transparent)` }} />

          {/* Header */}
          <div className="flex-shrink-0 px-5 py-4" style={{ borderBottom: "1px solid oklch(0.18 0.04 260 / 60%)" }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3 flex-shrink-0" style={{ color: dc.text }} />
                  <span className="text-[9px] tracking-widest uppercase" style={{ color: "oklch(0.50 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {formatDate(entry.date)}
                  </span>
                  <span className="ml-auto text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex-shrink-0" style={{ color: dc.text, background: dc.bg, border: `1px solid ${dc.border}` }}>
                    {entry.difficulty}
                  </span>
                </div>
                <h2 className="text-sm font-bold leading-snug" style={{ color: "oklch(0.95 0.01 180)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {entry.title}
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-full"
                style={{ background: "oklch(0.15 0.03 260)" }}
                whileHover={{ scale: 1.1, background: "oklch(0.20 0.04 260)" }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" style={{ color: "oklch(0.60 0.03 220)" }} />
              </motion.button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
            {/* Summary */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-3 w-3" style={{ color: dc.text }} />
                <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "oklch(0.45 0.02 220)" }}>Summary</span>
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "oklch(0.70 0.02 200)" }}>
                {entry.summary}
              </p>
            </div>

            <div className="h-px" style={{ background: "oklch(0.18 0.04 260 / 60%)" }} />

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Tag className="h-3 w-3" style={{ color: dc.text }} />
                <span className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "oklch(0.45 0.02 220)" }}>Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((t) => (
                  <span key={t} className="text-[10px] rounded-md px-2 py-1" style={{ color: "oklch(0.82 0.18 170 / 85%)", background: "oklch(0.82 0.18 170 / 08%)", border: "1px solid oklch(0.82 0.18 170 / 22%)" }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 rounded-lg px-4 py-3" style={{ background: "oklch(0.12 0.03 260 / 60%)", border: "1px solid oklch(0.18 0.04 260 / 60%)" }}>
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5" style={{ color: dc.text }} />
                <span className="text-xs" style={{ color: "oklch(0.60 0.03 220)" }}>
                  <span className="font-bold mr-1" style={{ color: "oklch(0.92 0.01 180)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {entry.wordCount.toLocaleString()}
                  </span>
                  words
                </span>
              </div>
            </div>

            {/* GitHub */}
            <motion.a
              href={entry.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "oklch(0.82 0.18 170 / 10%)", border: `1px solid oklch(0.82 0.18 170 / 38%)`, color: "oklch(0.82 0.18 170)", boxShadow: "0 0 16px oklch(0.82 0.18 170 / 08%)" }}
              whileHover={{ background: "oklch(0.82 0.18 170 / 18%)", boxShadow: "0 0 28px oklch(0.82 0.18 170 / 22%)", scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
              <ExternalLink className="h-3 w-3 opacity-70" />
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
          <span className="text-2xl font-bold leading-none" style={{ color: "oklch(0.85 0.16 195)", fontFamily: "'JetBrains Mono', monospace" }}>
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

  const isLoading = el || sl;

  return (
    <div className="relative min-h-screen grid-bg" style={{ background: "oklch(0.08 0.02 260)" }}>
      <CustomCursor />
      <Navbar />

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.15 0.05 280 / 40%) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-20">
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary" style={{ color: "oklch(0.50 0.03 220)" }}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8" style={{ background: "oklch(0.82 0.18 170 / 50%)" }} />
            <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: "oklch(0.82 0.18 170 / 60%)", fontFamily: "'JetBrains Mono', monospace" }}>
              ~/daily-learnings
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.75 0.2 145)" }} />
              <span className="text-[8px] tracking-widest uppercase" style={{ color: "oklch(0.55 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}>live</span>
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Learning <span className="text-gradient">Timeline</span>
          </h1>
          <p className="mt-3 text-sm max-w-xl" style={{ color: "oklch(0.60 0.03 220)" }}>
            A live archive of every learning session — cybersecurity, cryptography, tooling, and beyond.
          </p>
        </motion.div>

        {/* Stats */}
        {stats && !isLoading && <StatsBar stats={stats} />}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl h-24 animate-pulse" style={{ background: "oklch(0.12 0.04 260)" }} />
            ))}
          </div>
        )}

        {/* Search + Filter bar */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
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
              style={{ background: "oklch(0.11 0.03 260 / 90%)", border: "1px solid oklch(0.25 0.04 260 / 60%)", color: "oklch(0.92 0.01 180)", fontFamily: "'JetBrains Mono', monospace" }}
              onFocus={(e) => { e.currentTarget.style.border = "1px solid oklch(0.82 0.18 170 / 55%)"; e.currentTarget.style.boxShadow = "0 0 16px oklch(0.82 0.18 170 / 15%)"; }}
              onBlur={(e) => { e.currentTarget.style.border = "1px solid oklch(0.25 0.04 260 / 60%)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" style={{ color: "oklch(0.82 0.18 170)" }} />
              </button>
            )}
          </div>

          {/* Filter button */}
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

        {/* Filter panel */}
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
                {/* Difficulty */}
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

                {/* Tags */}
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

                {/* Clear */}
                {(diffFilter !== "All" || tagFilter !== "All") && (
                  <button onClick={() => { setDiffFilter("All"); setTagFilter("All"); }} className="text-[9px] font-bold uppercase tracking-widest transition-colors hover:text-primary" style={{ color: "oklch(0.55 0.03 220)" }}>
                    ✕ Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result count */}
        <AnimatePresence>
          {(search || diffFilter !== "All" || tagFilter !== "All") && !isLoading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] mb-5" style={{ color: "oklch(0.50 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
            </motion.p>
          )}
        </AnimatePresence>

        {/* Main content */}
        {isLoading ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div>{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          </div>
        ) : ee ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Left: Timeline */}
            <div>
              {grouped.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm" style={{ color: "oklch(0.45 0.02 220)" }}>No entries match your search.</p>
                </div>
              ) : (
                grouped.map(([key, group], gi) => {
                  // global entry index for stagger
                  const prevCount = grouped.slice(0, gi).reduce((acc, [, g]) => acc + g.entries.length, 0);
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: gi * 0.05 }}
                      className="mb-8"
                    >
                      {/* Month header */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-xs font-bold tracking-widest uppercase"
                          style={{ color: "oklch(0.82 0.18 170 / 70%)", fontFamily: "'JetBrains Mono', monospace" }}
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

            {/* Right: Detail panel */}
            <div>
              <DetailPanel entry={selected} onClose={() => setSelected(null)} />
              {!selected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl p-6 text-center"
                  style={{ background: "oklch(0.10 0.03 260 / 60%)", border: "1px solid oklch(0.18 0.04 260 / 50%)" }}
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "oklch(0.82 0.18 170 / 10%)", border: "1px solid oklch(0.82 0.18 170 / 25%)" }}>
                    <BookOpen className="h-4 w-4" style={{ color: "oklch(0.82 0.18 170 / 60%)" }} />
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: "oklch(0.60 0.03 220)" }}>Select an entry</p>
                  <p className="text-[10px]" style={{ color: "oklch(0.40 0.02 220)" }}>Click any card to view details</p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
