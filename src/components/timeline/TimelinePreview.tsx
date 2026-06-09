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
  Beginner:     "var(--token-green)",
  Intermediate: "var(--token-cyan)",
  Advanced:     "var(--token-purple)",
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
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--token-purple)" }} />
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "oklch(0.82 0.18 75)" }} />
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--token-green)" }} />
        </div>
        <span
          className="text-[9px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--token-dim)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          ~/daily-log
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "var(--token-green)" }}
          />
          <span
            className="text-[8px] tracking-widest uppercase"
            style={{ color: "var(--token-muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            live
          </span>
        </span>
      </div>

      {/* Main card */}
      <div
        className="flex-1 flex flex-col rounded-xl overflow-hidden"
        style={{
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(16px)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Top glow accent */}
        <div
          className="h-px w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, transparent, var(--neon-cyan), transparent)", opacity: 0.4 }}
        />

        <div className="p-4 flex flex-col gap-4 flex-1">
          {/* Stats grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg h-14 animate-pulse"
                  style={{ background: "var(--muted)" }}
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
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, var(--neon-cyan), transparent)", opacity: 0.35 }}
                  />
                  <Icon className="h-3 w-3 mb-1 text-primary opacity-60" />
                  <span
                    className="text-base font-bold leading-none text-primary"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {value}
                  </span>
                  <span
                    className="mt-0.5 text-[8px] font-semibold tracking-widest uppercase text-muted-foreground"
                  >
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Latest entry */}
          <div className="flex flex-col gap-2">
            <span
              className="text-[8px] font-bold tracking-[0.3em] uppercase text-muted-foreground"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              ▸ Latest Entry
            </span>

            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-2 w-24 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-border" />
              </div>
            ) : latest ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-lg p-3"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[9px] tracking-widest text-muted-foreground"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {formatDate(latest.date)}
                  </span>
                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest"
                    style={{
                      color: DIFFICULTY_COLORS[latest.difficulty],
                      background: `oklch(from ${DIFFICULTY_COLORS[latest.difficulty]} l c h / 18%)`,
                      border: `1px solid oklch(from ${DIFFICULTY_COLORS[latest.difficulty]} l c h / 40%)`,
                    }}
                  >
                    {latest.difficulty}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-snug line-clamp-2 text-foreground">
                  {latest.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {latest.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] rounded px-1.5 py-0.5"
                      style={{
                        color: "var(--token-cyan)",
                        background: "oklch(from var(--token-cyan) l c h / 8%)",
                        border: "1px solid oklch(from var(--token-cyan) l c h / 20%)",
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
                background: "oklch(from var(--neon-cyan) l c h / 10%)",
                border: "1px solid oklch(from var(--neon-cyan) l c h / 35%)",
                color: "var(--neon-cyan)",
                boxShadow: "0 0 16px oklch(from var(--neon-cyan) l c h / 8%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "oklch(from var(--neon-cyan) l c h / 18%)";
                e.currentTarget.style.boxShadow = "0 0 24px oklch(from var(--neon-cyan) l c h / 20%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "oklch(from var(--neon-cyan) l c h / 10%)";
                e.currentTarget.style.boxShadow = "0 0 16px oklch(from var(--neon-cyan) l c h / 8%)";
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
