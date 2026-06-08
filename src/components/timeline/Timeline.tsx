import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertTriangle } from "lucide-react";
import type { TimelineEntry, TimelineStats } from "./types";
import { TimelineStats as StatsBar } from "./TimelineStats";
import { TimelineSearch } from "./TimelineSearch";
import { TimelineCard } from "./TimelineCard";
import { TimelineModal } from "./TimelineModal";

const TIMELINE_URL =
  "https://raw.githubusercontent.com/Sanskar-bot/Daily-Learnings/main/portfolio-data/timeline.json";
const STATS_URL =
  "https://raw.githubusercontent.com/Sanskar-bot/Daily-Learnings/main/portfolio-data/stats.json";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      className="flex gap-3 mb-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06 }}
    >
      {/* Node + rail */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: "20px" }}>
        <div
          className="rounded-full flex-shrink-0 animate-pulse"
          style={{ width: "10px", height: "10px", background: "oklch(0.25 0.04 260)", marginTop: "10px" }}
        />
        <div
          className="flex-1 w-px mt-1 animate-pulse"
          style={{ background: "oklch(0.18 0.03 260)", minHeight: "60px" }}
        />
      </div>
      {/* Card */}
      <div
        className="w-full rounded-lg px-3 py-2.5 animate-pulse"
        style={{ background: "oklch(0.11 0.03 260)", border: "1px solid oklch(0.2 0.04 260 / 50%)" }}
      >
        <div className="flex justify-between mb-2">
          <div className="h-2 w-20 rounded" style={{ background: "oklch(0.2 0.03 260)" }} />
          <div className="h-2 w-14 rounded" style={{ background: "oklch(0.2 0.03 260)" }} />
        </div>
        <div className="h-3 w-full rounded mb-1" style={{ background: "oklch(0.2 0.03 260)" }} />
        <div className="h-3 w-3/4 rounded mb-2" style={{ background: "oklch(0.18 0.03 260)" }} />
        <div className="flex gap-1">
          {[40, 55, 45].map((w, i) => (
            <div key={i} className="h-2 rounded" style={{ width: `${w}px`, background: "oklch(0.18 0.03 260)" }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "oklch(0.7 0.22 320 / 12%)",
          border: "1px solid oklch(0.7 0.22 320 / 30%)",
        }}
      >
        <AlertTriangle className="h-5 w-5" style={{ color: "oklch(0.7 0.22 320)" }} />
      </div>
      <div>
        <p className="text-xs font-semibold mb-1" style={{ color: "oklch(0.75 0.02 200)" }}>
          Timeline temporarily unavailable
        </p>
        <p className="text-[10px]" style={{ color: "oklch(0.45 0.02 220)" }}>
          Could not fetch data from GitHub
        </p>
      </div>
      <motion.button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
        style={{
          background: "oklch(0.82 0.18 170 / 10%)",
          border: "1px solid oklch(0.82 0.18 170 / 30%)",
          color: "oklch(0.82 0.18 170)",
        }}
        whileHover={{ background: "oklch(0.82 0.18 170 / 18%)" }}
        whileTap={{ scale: 0.96 }}
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </motion.button>
    </motion.div>
  );
}

// ── Main Timeline ─────────────────────────────────────────────────────────────
export function Timeline() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TimelineEntry | null>(null);

  const {
    data: entries,
    isLoading: timelineLoading,
    isError: timelineError,
    refetch: refetchTimeline,
  } = useQuery<TimelineEntry[]>({
    queryKey: ["timeline"],
    queryFn: async () => {
      const res = await fetch(TIMELINE_URL);
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 min cache
    retry: 2,
  });

  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery<TimelineStats>({
    queryKey: ["timeline-stats"],
    queryFn: async () => {
      const res = await fetch(STATS_URL);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  // Newest first, then filter
  const sorted = useMemo(() => {
    if (!entries) return [];
    return [...entries].reverse();
  }, [entries]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.date.includes(q)
    );
  }, [sorted, search]);

  const handleRetry = useCallback(() => {
    refetchTimeline();
  }, [refetchTimeline]);

  const isLoading = timelineLoading || statsLoading;

  return (
    <>
      <div
        className="flex h-full flex-col rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.09 0.025 260 / 70%)",
          border: "1px solid oklch(0.25 0.04 260 / 50%)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 40px oklch(0.82 0.18 170 / 05%), inset 0 0 40px oklch(0.05 0.02 260 / 30%)",
        }}
      >
        {/* Panel header */}
        <div
          className="flex-shrink-0 px-4 pt-4 pb-3"
          style={{ borderBottom: "1px solid oklch(0.2 0.04 260 / 60%)" }}
        >
          {/* Terminal label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.7 0.22 320)" }} />
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.82 0.18 75)" }} />
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.75 0.2 145)" }} />
            </div>
            <span
              className="text-[9px] font-semibold tracking-widest uppercase"
              style={{ color: "oklch(0.45 0.02 220)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              ~/learning-log
            </span>
            {/* Live indicator */}
            <span className="ml-auto flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.75 0.2 145)" }}
              />
              <span
                className="text-[8px] tracking-widest uppercase"
                style={{ color: "oklch(0.75 0.2 145 / 70%)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                live
              </span>
            </span>
          </div>

          {/* Stats */}
          {stats && !isLoading && <StatsBar stats={stats} />}
          {isLoading && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-md py-4 animate-pulse"
                  style={{ background: "oklch(0.12 0.04 260 / 80%)", border: "1px solid oklch(0.2 0.04 260 / 30%)" }}
                />
              ))}
            </div>
          )}

          {/* Search */}
          <TimelineSearch value={search} onChange={setSearch} />

          {/* Results count */}
          <AnimatePresence>
            {search && !timelineLoading && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[9px] mb-1"
                style={{ color: "oklch(0.55 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable cards area */}
        <div
          className="flex-1 overflow-y-auto px-4 pt-4 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {/* Loading skeletons */}
          {isLoading && (
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {timelineError && !isLoading && <ErrorState onRetry={handleRetry} />}

          {/* Empty search results */}
          {!isLoading && !timelineError && filtered.length === 0 && search && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center"
            >
              <p className="text-xs" style={{ color: "oklch(0.45 0.02 220)" }}>
                No entries match "{search}"
              </p>
            </motion.div>
          )}

          {/* Cards */}
          {!isLoading && !timelineError && (
            <div>
              {filtered.map((entry, i) => (
                <TimelineCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  isLast={i === filtered.length - 1}
                  onClick={() => setSelected(entry)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <TimelineModal entry={selected} onClose={() => setSelected(null)} />
    </>
  );
}
