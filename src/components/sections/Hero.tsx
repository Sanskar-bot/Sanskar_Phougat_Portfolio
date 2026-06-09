import { useRef } from "react";
import { TimelinePreview } from "@/components/timeline/TimelinePreview";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  return (
    <section id="home" ref={root} className="relative min-h-screen overflow-hidden grid-bg">
      {/* Radial gradient overlay — theme-aware */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 25% 50%, var(--hero-overlay) 0%, transparent 70%)",
        }}
      />

      {/* Two-column layout — hero dominates, timeline is a sidebar widget */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row lg:items-center px-6 pt-24 pb-16 gap-10 lg:gap-16">

        {/* ── LEFT: Hero content (~70%) ───────────────────────────────────── */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h1 className="hero-title text-5xl font-bold leading-[0.95] sm:text-6xl md:text-7xl xl:text-8xl">
            <span className="block">Sanskar</span>
            <span className="block text-gradient">Phougat.</span>
          </h1>

          <p className="hero-sub mt-8 max-w-xl text-base text-muted-foreground sm:text-lg">
            Cybersecurity researcher &amp; security engineer crafting offensive tooling,
            cryptographic systems and zero-knowledge architectures.
          </p>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center h-12 rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
              style={{ boxShadow: "var(--shadow-neon)" }}
            >
              View work →
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 rounded-full neon-border px-6 text-sm font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Contact
            </a>
          </div>

          <div
            className="hero-meta mt-16 grid w-full grid-cols-2 gap-x-10 gap-y-8 border-t border-border pt-8 text-xs uppercase tracking-widest text-muted-foreground"
            style={{ maxWidth: "28rem" }}
          >
            <div>
              <p className="text-2xl font-bold text-foreground">Top 15%</p>
              <p className="mt-1">TryHackMe Global</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">7+</p>
              <p className="mt-1">Security tools shipped</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">CyberPeace</p>
              <p className="mt-1">Research intern</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">JIIT</p>
              <p className="mt-1">B.Tech ECE '26</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Timeline preview widget (~28%) ───────────────────────── */}
        <div className="flex-shrink-0 w-full lg:w-72 xl:w-80 flex flex-col self-center">
          {/* Label */}
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg, oklch(0.82 0.18 170 / 20%), oklch(0.82 0.18 170 / 40%))" }}
            />
            <span
              className="text-[8px] font-bold tracking-[0.3em] uppercase flex-shrink-0"
              style={{ color: "oklch(0.82 0.18 170 / 50%)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              Learning Log
            </span>
            <div className="h-px w-6" style={{ background: "oklch(0.82 0.18 170 / 40%)" }} />
          </div>

          <TimelinePreview />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
        scroll ↓
      </div>
    </section>
  );
}