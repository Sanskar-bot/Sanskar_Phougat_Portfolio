import { motion } from "framer-motion";
import type { TimelineStats as StatsType } from "./types";

interface TimelineStatsProps {
  stats: StatsType;
}

const statItems = (stats: StatsType) => [
  { value: stats.totalLearningDays, label: "DAYS LOGGED" },
  { value: stats.totalTechnologies, label: "TECHNOLOGIES" },
  { value: stats.totalTags, label: "TAGS" },
  { value: stats.totalWordsWritten.toLocaleString(), label: "WORDS" },
];

export function TimelineStats({ stats }: TimelineStatsProps) {
  const items = statItems(stats);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 gap-2 mb-3"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="relative flex flex-col items-center justify-center rounded-md py-2 px-1 overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Subtle glow top edge */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--neon-cyan), transparent)", opacity: 0.5 }}
          />
          <span
            className="text-lg font-bold leading-none tracking-tight text-primary"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {item.value}
          </span>
          <span
            className="mt-0.5 text-[9px] font-semibold tracking-widest text-muted-foreground"
          >
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
