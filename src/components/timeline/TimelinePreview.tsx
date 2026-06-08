import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Cpu, Tag, FileText } from "lucide-react";
import type { TimelineEntry, TimelineStats } from "./types";

const TIMELINE_URL =
  "https://raw.githubusercontent.com/Sanskar-bot/Daily-Learnings/main/portfolio-data/timeline.json";
const STATS_URL =
  "https://raw.githubusercontent.com/Sanskar-bot/Daily-Learnings/main/portfolio-data/stats.json";

const DIFFICULTY_COLORS = {
  Beginner: "oklch(0.75 0.2 145)",
  Intermediate: "oklch(0.82 0.18 170)",
  Advanced: "oklch(0.7 0.22 320)",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export function TimelinePreview() {
  const { data: entries, isLoading: entriesLoading } = useQuery<TimelineEntry[]>({
    queryKey: ["timeline"],
    queryFn: async () => {
      const res = await fetch(TIMELINE_URL);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<TimelineStats>({
    queryKey: ["timeline-stats"],
    queryFn: async () => {
      const res = await fetch(STATS_URL);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });

  const latest = entries ? entries[entries.length - 1] : null;
  const isLoading = entriesLoading || statsLoading;

  const statItems = stats
    ? [
        { icon: BookOpen, value: stats.totalLearningDays, label: "Days" },
        { icon: Cpu, value: stats.totalTechnologies, label: "Techs" },
        { icon: Tag, value: stats.totalTags, label: "Tags" },
        { icon: FileText, value: (stats.totalWordsWritten / 1000).toFixed(1) + "k", label: "Words" },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-3 h-full"
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "oklch(0.7 0.22 320)" }} />
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "oklch(0.82 0.18 75)" }} />
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "oklch(0.75 0.2 145)" }} />
        </div>
        <span
          className="text-[9px] font-semibold tracking-widest uppercase"
          style={{ color: "oklch(0.40 0.02 220)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          ~/daily-log
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "oklch(0.75 0.2 145)" }}
          />
          <span
            className="text-[8px] tracking-widest uppercase"
            style={{ color: "oklch(0.55 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            live
          </span>
        </span>
      </div>

      {/* Main card */}
      <div
        className="flex-1 flex flex-col rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.09 0.025 260 / 75%)",
          border: "1px solid oklch(0.25 0.04 260 / 50%)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 30px oklch(0.82 0.18 170 / 06%), inset 0 0 30px oklch(0.05 0.02 260 / 20%)",
        }}
      >
        {/* Top glow accent */}
        <div
          className="h-px w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, transparent, oklch(0.82 0.18 170 / 40%), transparent)" }}
        />

        <div className="p-4 flex flex-col gap-4 flex-1">
          {/* Stats grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg h-14 animate-pulse"
                  style={{ background: "oklch(0.14 0.03 260)" }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {statItems.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="relative flex flex-col items-center justify-center rounded-lg py-2.5 px-2 overflow-hidden"
                  style={{
                    background: "oklch(0.12 0.04 260 / 80%)",
                    border: "1px solid oklch(0.82 0.18 170 / 15%)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, oklch(0.82 0.18 170 / 35%), transparent)" }}
                  />
                  <Icon className="h-3 w-3 mb-1" style={{ color: "oklch(0.82 0.18 170 / 50%)" }} />
                  <span
                    className="text-base font-bold leading-none"
                    style={{ color: "oklch(0.85 0.16 195)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {value}
                  </span>
                  <span
                    className="mt-0.5 text-[8px] font-semibold tracking-widest uppercase"
                    style={{ color: "oklch(0.45 0.02 220)" }}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ background: "oklch(0.2 0.04 260 / 60%)" }}
          />

          {/* Latest entry */}
          <div className="flex flex-col gap-2">
            <span
              className="text-[8px] font-bold tracking-[0.3em] uppercase"
              style={{ color: "oklch(0.45 0.02 220)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              ▸ Latest Entry
            </span>

            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-2 w-24 rounded" style={{ background: "oklch(0.18 0.03 260)" }} />
                <div className="h-3 w-full rounded" style={{ background: "oklch(0.18 0.03 260)" }} />
                <div className="h-3 w-3/4 rounded" style={{ background: "oklch(0.15 0.03 260)" }} />
              </div>
            ) : latest ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-lg p-3"
                style={{
                  background: "oklch(0.12 0.04 260 / 60%)",
                  border: "1px solid oklch(0.25 0.04 260 / 50%)",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[9px] tracking-widest"
                    style={{ color: "oklch(0.50 0.03 220)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {formatDate(latest.date)}
                  </span>
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest"
                    style={{
                      color: DIFFICULTY_COLORS[latest.difficulty],
                      background: `${DIFFICULTY_COLORS[latest.difficulty]}18`,
                      border: `1px solid ${DIFFICULTY_COLORS[latest.difficulty]}40`,
                    }}
                  >
                    {latest.difficulty}
                  </span>
                </div>
                <p
                  className="text-xs font-semibold leading-snug line-clamp-2"
                  style={{ color: "oklch(0.88 0.01 180)" }}
                >
                  {latest.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {latest.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] rounded px-1.5 py-0.5"
                      style={{
                        color: "oklch(0.82 0.18 170 / 70%)",
                        background: "oklch(0.82 0.18 170 / 07%)",
                        border: "1px solid oklch(0.82 0.18 170 / 18%)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-auto"
          >
            <Link
              to="/timeline"
              className="group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200"
              style={{
                background: "oklch(0.82 0.18 170 / 10%)",
                border: "1px solid oklch(0.82 0.18 170 / 35%)",
                color: "oklch(0.82 0.18 170)",
                boxShadow: "0 0 16px oklch(0.82 0.18 170 / 08%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "oklch(0.82 0.18 170 / 18%)";
                e.currentTarget.style.boxShadow = "0 0 24px oklch(0.82 0.18 170 / 20%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "oklch(0.82 0.18 170 / 10%)";
                e.currentTarget.style.boxShadow = "0 0 16px oklch(0.82 0.18 170 / 08%)";
              }}
            >
              View Full Timeline
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
