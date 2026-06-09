import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft, Shield, Lock, Code2, Brain, Eye,
  BookOpen, Cpu, Globe, Key, Activity, Wifi,
  Layers, AlertCircle, Compass, ChevronRight, Terminal,
  Zap, Heart, Star, Menu,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/story")({
  component: StoryPage,
});

// ── Design tokens ─────────────────────────────────────────────────────────────
const CYAN   = "oklch(0.82 0.18 170)";
const GREEN  = "oklch(0.75 0.2 145)";
const PURPLE = "oklch(0.7 0.22 320)";
const DIM    = "oklch(0.50 0.03 220)";
const FAINT  = "oklch(0.35 0.02 220)";
const TEXT   = "oklch(0.88 0.01 180)";
const MUTED  = "oklch(0.65 0.03 220)";
const MONO   = "'JetBrains Mono', monospace";
const SANS   = "'Space Grotesk', sans-serif";

// ── Sections constant for TOC ─────────────────────────────────────────────────
const STORY_SECTIONS = [
  { id: "quick-profile", label: "At a Glance" },
  { id: "about-me", label: "About Me" },
  { id: "ece-to-security", label: "ECE to Security" },
  { id: "why-cybersecurity", label: "Why Cybersecurity" },
  { id: "timeline", label: "Milestones" },
  { id: "journey", label: "Learning Log" },
  { id: "tryhackme-journey", label: "TryHackMe" },
  { id: "projects-taught-me", label: "Key Projects" },
  { id: "what-defines-me", label: "What Defines Me" },
  { id: "currently-exploring", label: "What I'm Building" },
  { id: "failures-lessons", label: "Failures & Lessons" },
  { id: "fun-facts", label: "Fun Facts" },
  { id: "beyond-tech", label: "Beyond Tech" },
  { id: "future-goals", label: "Future Goals" },
  { id: "work-with-me", label: "Work With Me" },
];

// ── Shared scroll-reveal wrapper ──────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const initial =
    direction === "left" ? { opacity: 0, x: -28 }
    : direction === "right" ? { opacity: 0, x: 28 }
    : { opacity: 0, y: 28 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Terminal chrome wrapper ───────────────────────────────────────────────────
function TerminalBlock({
  label,
  children,
  accent = CYAN,
}: {
  label: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "oklch(0.09 0.025 260 / 80%)",
        border: `1px solid oklch(0.22 0.04 260 / 70%)`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid oklch(0.18 0.04 260 / 60%)", background: "oklch(0.10 0.03 260 / 80%)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: PURPLE }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.82 0.18 75)" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN }} />
        <span className="ml-2 text-[9px] font-semibold tracking-widest uppercase" style={{ color: FAINT, fontFamily: MONO }}>
          {label}
        </span>
        <div className="ml-auto h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${accent}30)` }} />
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Reusable Callout Box ──────────────────────────────────────────────────────
function CalloutBox({
  title,
  children,
  accent = GREEN,
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="rounded-xl p-5 my-4"
      style={{
        background: `${accent}05`,
        border: `1px solid ${accent}18`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: accent, fontFamily: MONO }}>
        // {title}
      </h4>
      <div className="text-xs leading-relaxed" style={{ color: MUTED }}>
        {children}
      </div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ prompt, title, sub }: { prompt: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: GREEN, fontFamily: MONO }}>
          {prompt}
        </span>
        <div className="h-px w-12" style={{ background: `${GREEN}40` }} />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: SANS, color: TEXT }}>
        {title}
      </h2>
      {sub && (
        <p className="mt-2 text-sm leading-relaxed max-w-2xl" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Inline highlight / glowing phrase ────────────────────────────────────────
function Glow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold" style={{ color: GREEN, textShadow: `0 0 20px ${GREEN}50` }}>
      {children}
    </span>
  );
}

// ── Hover-reveal easter egg word ──────────────────────────────────────────────
function SecretWord({ word, secret }: { word: string; secret: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <span
        className="cursor-help border-b border-dashed"
        style={{ borderColor: `${GREEN}50`, color: GREEN }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {word}
      </span>
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 whitespace-nowrap rounded-md px-3 py-1.5 text-[10px] font-medium"
            style={{ background: "oklch(0.12 0.04 260)", border: `1px solid ${GREEN}35`, color: TEXT, fontFamily: MONO, boxShadow: `0 0 16px ${GREEN}20` }}
          >
            {secret}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// ── Journey timeline data ─────────────────────────────────────────────────────
const JOURNEY = [
  {
    num: "01",
    title: "Electronics & Communication Engineering",
    period: "2022 — Present",
    icon: Cpu,
    color: CYAN,
    story:
      "I chose ECE because I wanted to understand both layers — hardware and software. Most engineers specialize in one. ECE forces you to see the boundary between them, which is where the interesting problems tend to live.",
    lesson: "Systems thinking: not just what a thing does, but why it was built to trust what it trusts.",
  },
  {
    num: "02",
    title: "Networking Fundamentals",
    period: "2022 — 2023",
    icon: Wifi,
    color: GREEN,
    story:
      "TCP/IP, routing, DNS. Standard textbook material. But somewhere in there I kept noticing something that didn't sit right: every protocol makes assumptions about trust. TCP assumes the endpoint is who it claims. DNS assumes resolvers are honest.",
    lesson: "Every protocol is a trust model. Security is what happens when you take that seriously.",
  },
  {
    num: "03",
    title: "Cybersecurity Fundamentals",
    period: "2023",
    icon: Shield,
    color: CYAN,
    story:
      "ARP poisoning. MITM attacks. SQL injection. Not because I wanted to break things, but because breaking things is the fastest way to understand how they were designed to work — and where those design assumptions break down.",
    lesson: "The best way to understand a system's defences is to find where they aren't.",
  },
  {
    num: "04",
    title: "TryHackMe Journey",
    period: "2023 — Present",
    icon: Terminal,
    color: GREEN,
    story:
      "Theory only takes you so far. You can read about buffer overflows until you know the stack layout cold, then open a terminal and have no idea where to start. TryHackMe fixed that. Top 15% globally — less important than the fact that I genuinely look forward to each session.",
    lesson: "Knowing something and being able to do it are very different skills. Close the gap.",
  },
  {
    num: "05",
    title: "Cryptography & Secure Systems",
    period: "2023 — Present",
    icon: Lock,
    color: PURPLE,
    story:
      "Encryption is not paranoia. It's engineering. Once I understood the math — why AES-256-GCM is the choice it is, how ECDH works, what authenticated encryption actually provides — security stopped feeling like a dark art.",
    lesson: "Cryptography is applied mathematics for building trust between parties that cannot meet.",
  },
  {
    num: "06",
    title: "Healthcare Security Research",
    period: "2024",
    icon: Activity,
    color: GREEN,
    story:
      "The AIIMS research internship. Healthcare data is terrifying from a security perspective — sensitive records, legacy systems, complex org structures, and real consequences for breaches. I spent weeks mapping the threat surface before writing any code.",
    lesson: "Security isn't just about technical controls. It's about understanding human systems too.",
  },
  {
    num: "07",
    title: "Building Security Tools",
    period: "2024 — 2025",
    icon: Code2,
    color: CYAN,
    story:
      "The E2E Encryption Attack Lab: a three-act MITM demonstration, progressing from plaintext to AES-256-GCM. I wanted to make the invisible visible. To show, clearly, why encryption isn't optional in serious systems.",
    lesson: "The best way to explain a concept is to build something that makes it tangible.",
  },
  {
    num: "08",
    title: "VaultZero",
    period: "2025 — Present",
    icon: Key,
    color: PURPLE,
    story:
      "My own password manager. Not because the world needs one — it doesn't — but because I needed to understand every layer of storing secrets properly. Zero-knowledge encryption. TypeScript. A product I'd actually trust with my own data.",
    lesson: "Build what you'd use. Trust yourself enough to build it properly.",
  },
];

// ── Failures data ─────────────────────────────────────────────────────────────
const FAILURES = [
  {
    title: "The Encryption I Thought I Invented",
    icon: Lock,
    body: "Spent a weekend designing a symmetric encryption scheme that felt elegant. Went to write up the security proof and found a paper from 2009 demonstrating that exact approach was trivially broken. This is why you don't roll your own crypto. The lesson wasn't just 'read the literature first.' It was: clever is not the same as correct.",
    takeaway: "Standing on shoulders is not cheating. It's the point.",
  },
  {
    title: "The Scraper That Worked Locally",
    icon: Code2,
    body: "A web scraper that passed every test I ran. Then it went to production and immediately failed. I had hardcoded assumptions about HTML structure that were completely obvious in retrospect — and that took me a week to find because I kept looking for complex bugs. The bug was simple. My assumptions were the problem.",
    takeaway: "Test your assumptions. Not just your code.",
  },
  {
    title: "The Collaboration That Wasn't",
    icon: AlertCircle,
    body: "A group project that fell apart not from technical failure but from a communication failure. We had different definitions of 'done.' Different levels of investment. That's harder to debug than any code issue — because there's no stack trace for 'we didn't actually agree on what we were building.'",
    takeaway: "Align on the definition of done before writing a single line.",
  },
];

// ── Easter egg data ───────────────────────────────────────────────────────────
const SECRET_FACTS = [
  "My hostel room looks like a server room. Not planned — just what happens when you build constantly.",
  "I debug code at 2 AM more often than I'd like to admit.",
  "I've read the Diffie-Hellman paper multiple times. Still find it remarkable.",
  "I once spent 3 hours on a bug that had a 3-line fix. Those hours taught me something the fix never would have.",
  "I keep a physical notebook for ideas that don't fit in code.",
  "My first 'security' project was writing a Caesar cipher decoder in school. I was very impressed with myself.",
];

// ════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

// ── 1. StoryTableOfContents ──────────────────────────────────────────────────
function StoryTableOfContents({ activeId, scrollProgress }: { activeId: string; scrollProgress: number }) {
  return (
    <div className="relative flex flex-col py-2" style={{ fontFamily: MONO }}>
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: GREEN }}>
        // Navigator
      </span>

      {/* Progress track */}
      <div className="absolute left-[3px] top-[32px] bottom-0 w-[1px]" style={{ background: "oklch(0.20 0.04 260 / 60%)" }} />
      <div 
        className="absolute left-[3px] top-[32px] w-[1px] transition-all duration-100" 
        style={{ 
          height: `calc(${scrollProgress}% - 32px)`, 
          background: GREEN,
          boxShadow: `0 0 8px ${GREEN}`
        }} 
      />

      <div className="space-y-1">
        {STORY_SECTIONS.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative flex items-center pl-6 py-2 text-[10px] font-medium tracking-wider uppercase transition-colors"
              style={{
                color: isActive ? TEXT : MUTED,
              }}
            >
              {/* Dot on line */}
              <span 
                className="absolute left-[1px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full border transition-all duration-300"
                style={{
                  background: isActive ? GREEN : "transparent",
                  borderColor: isActive ? GREEN : "oklch(0.35 0.02 220)",
                  boxShadow: isActive ? `0 0 8px ${GREEN}` : "none",
                  transform: isActive ? "translateY(-50%) scale(1.25)" : "translateY(-50%) scale(1)",
                }}
              />
              <span className="transition-all duration-200 group-hover:text-white group-hover:translate-x-1 inline-block">
                {sec.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── 2. MobileTOC ─────────────────────────────────────────────────────────────
function MobileTOC({ activeId }: { activeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden flex items-center gap-2 rounded-full px-5 py-3 text-xs uppercase tracking-widest font-semibold neon-border glass text-primary shadow-lg"
        style={{ background: "oklch(0.11 0.03 260 / 95%)", borderColor: GREEN }}
      >
        <Menu className="h-4 w-4" /> Contents
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 max-w-full p-6 glass flex flex-col justify-between lg:hidden"
              style={{ background: "oklch(0.10 0.03 260)", borderLeft: `1px solid oklch(0.25 0.04 260 / 60%)` }}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs uppercase tracking-widest font-bold" style={{ color: GREEN }}>Table of Contents</span>
                  <button onClick={() => setOpen(false)} className="text-xs opacity-60 hover:opacity-100" style={{ color: TEXT }}>✕</button>
                </div>
                <nav className="flex flex-col gap-1">
                  {STORY_SECTIONS.map((sec) => {
                    const isActive = activeId === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setOpen(false);
                          document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="py-2 text-xs font-medium uppercase tracking-wider transition-colors border-l-2 pl-4"
                        style={{
                          color: isActive ? GREEN : MUTED,
                          borderColor: isActive ? GREEN : "transparent",
                          background: isActive ? "oklch(0.12 0.04 260 / 50%)" : "transparent",
                        }}
                      >
                        {sec.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── 3. RecruiterSnapshot ─────────────────────────────────────────────────────
function RecruiterSnapshot() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <SectionHeading
        prompt="> identity --snapshot"
        title="Quick Profile"
        sub="A scan-optimized dashboard detailing my core engineering background."
      />
      <div 
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6 text-xs"
        style={{ fontFamily: MONO }}
      >
        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ color: GREEN }}>// Core Identity</span>
          <div className="space-y-2">
            <div><span style={{ color: DIM }}>Name:</span> <span className="text-white font-semibold">Sanskar Phougat</span></div>
            <div><span style={{ color: DIM }}>Degree:</span> <span className="text-white">B.Tech ECE (JIIT '26)</span></div>
            <div><span style={{ color: DIM }}>Learning:</span> <span className="text-white">Build-first, project-driven</span></div>
          </div>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ color: GREEN }}>// Focus Areas</span>
          <ul className="space-y-1.5 text-white">
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Cybersecurity</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Cryptography</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Secure Systems</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Backend Engineering</li>
          </ul>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ color: GREEN }}>// Current Interests</span>
          <ul className="space-y-1.5 text-white">
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Offensive Security</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Zero Knowledge Systems</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Identity & Auth</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Security Research</li>
          </ul>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ color: GREEN }}>// Key Strengths</span>
          <ul className="space-y-1.5 text-white">
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Fast learner</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Deep tech curiosity</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Strong self-learning</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Long-form execution</li>
          </ul>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ color: GREEN }}>// Major Project</span>
          <div>
            <span className="text-white font-semibold flex items-center gap-1.5">
              VaultZero <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${PURPLE}18`, color: PURPLE }}>Active</span>
            </span>
            <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
              Zero-knowledge E2E encrypted password manager built to master secrets storage.
            </p>
          </div>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <span className="text-[10px] uppercase tracking-widest block mb-3 font-semibold" style={{ color: GREEN }}>// Open To</span>
          <ul className="space-y-1.5 text-white">
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Internships</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Security Engineering</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Backend Engineering</li>
            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full" style={{ background: GREEN }} /> Research placements</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── 4. PersonalTimeline ──────────────────────────────────────────────────────
function PersonalTimeline() {
  const milestones = [
    { label: "School", desc: "First introduction to programming; wrote custom cipher decoders in high school." },
    { label: "ECE at JIIT Noida", desc: "Chose Electronics & Communication to master boundaries between hardware and software." },
    { label: "Curiosity About Security", desc: "Studying routing algorithms exposed trust naivety in networking layers." },
    { label: "TryHackMe Journey", desc: "Climbed to the top 15% globally while converting theoretical concepts to terminal labs." },
    { label: "Building Projects", desc: "Transitioned to active engineering: built attack labs, secure scrapers, and secure health systems." },
    { label: "Applied Cryptography", desc: "Deep study of ECDH, AES-256-GCM, and designing hybrid encryption wrapper systems." },
    { label: "VaultZero", desc: "Architecting a secure, zero-knowledge, local-first credentials locker in TypeScript." },
    { label: "Future Goals", desc: "Bridge the gap between theoretical research and production systems engineering." },
  ];

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <SectionHeading
        prompt="> traceroute journey.hop"
        title="Personal Timeline"
        sub="The pivotal steps that defined my development as an engineer."
      />
      <div className="relative mt-8 pl-8 border-l border-dashed border-muted/30 space-y-6">
        {milestones.map((m, i) => (
          <div key={m.label} className="relative">
            {/* Dot marker */}
            <div 
              className="absolute -left-[37px] top-1.5 w-[10px] h-[10px] rounded-full border bg-background transition-all duration-300"
              style={{ borderColor: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
            />
            <div>
              <span className="text-[9px] font-bold tracking-widest text-muted-foreground block mb-0.5" style={{ fontFamily: MONO }}>
                STEP 0{i + 1}
              </span>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{m.label}</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 5. DefinitionCards ───────────────────────────────────────────────────────
function DefinitionCards() {
  const definitions = [
    { title: "I learn by building", desc: "Reading specs is useful; compiling code, writing tests, and running exploits is where the real knowledge is acquired." },
    { title: "First principles understanding", desc: "I prefer knowing what is happening down at the protocol, hardware, and mathematical layer instead of treating tools as magic boxes." },
    { title: "Breaking complex systems", desc: "I enjoy dissecting large, intimidating problems into simple, testable, and logically sound components." },
    { title: "Depth over hype", desc: "I prioritize building a solid foundation in cryptographic primitives, networking, and system internals over chasing temporary tech trends." },
    { title: "Document everything", desc: "Writing design docs, lessons learned, and failure logs forms the core of how I track my personal learning progress." }
  ];

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <SectionHeading
        prompt="> cat config/principles.yaml"
        title="What Defines Me"
        sub="Core operating principles that guide my research and development."
      />
      <div className="grid gap-4 sm:grid-cols-2 mt-6">
        {definitions.map((d) => (
          <div 
            key={d.title}
            className="rounded-xl p-5 border transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "oklch(0.10 0.03 260 / 60%)",
              borderColor: "oklch(0.20 0.04 260 / 50%)",
            }}
          >
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2" style={{ color: GREEN }}>
              {d.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {d.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 6. CurrentlyExploring ────────────────────────────────────────────────────
function CurrentlyExploring() {
  const list = [
    { area: "Zero Knowledge Systems", status: "Active Research", progress: "Understanding zk-SNARKs & algebraic circuits" },
    { area: "Modern Cryptography", status: "Active Study", progress: "Hybrid key wrapping, post-quantum candidates" },
    { area: "Secure Authentication", status: "Building", progress: "WebAuthn passkeys, FIDO2 flows, device binding" },
    { area: "Browser Security", status: "Experimenting", progress: "Exploiting CSP bypasses, origin models, DOM XSS" },
    { area: "Offensive Security", status: "Practicing", progress: "TryHackMe advanced rooms, Active Directory, binary exploitation" },
    { area: "System Design", status: "Studying", progress: "Distributed ledger security, high-throughput secure APIs" },
  ];

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <SectionHeading
        prompt="> tail -n 10 exploration.log"
        title="What I'm Building & Exploring"
        sub="Concepts, tools, and technical models currently loaded in my memory."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6" style={{ fontFamily: MONO }}>
        {list.map((item) => (
          <div 
            key={item.area}
            className="rounded-xl p-4 border flex flex-col justify-between"
            style={{
              background: "oklch(0.10 0.03 260 / 70%)",
              borderColor: "oklch(0.20 0.04 260 / 50%)",
            }}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded animate-pulse" style={{ background: `${GREEN}12`, color: GREEN, border: `1px solid ${GREEN}25` }}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                {item.area}
              </h4>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-4" style={{ borderTop: "1px solid oklch(0.18 0.04 260 / 50%)", paddingTop: "8px" }}>
              <span className="text-white">//</span> {item.progress}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 7. FunFactsSection ────────────────────────────────────────────────────────
function FunFactsSection() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <SectionHeading
        prompt="> cat facts/misc.md"
        title="Fun Facts"
        sub="A few quick, informal highlights that define my environment."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6" style={{ fontFamily: MONO }}>
        {SECRET_FACTS.map((fact, i) => (
          <div 
            key={i}
            className="rounded-xl p-4 border"
            style={{
              background: "oklch(0.10 0.03 260 / 70%)",
              borderColor: "oklch(0.20 0.04 260 / 50%)",
            }}
          >
            <span className="text-[9px] text-muted-foreground block mb-2">// Fact #0{i + 1}</span>
            <p className="text-xs text-white leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 8. WorkWithMe ────────────────────────────────────────────────────────────
function WorkWithMe() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <SectionHeading
        prompt="> cat collab_spec.md"
        title="Work With Me"
        sub="How we can build, secure, and research together."
      />
      <div className="grid gap-6 sm:grid-cols-2 mt-6" style={{ fontFamily: MONO }}>
        {/* What I enjoy */}
        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
            What I Enjoy
          </h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li><span className="text-white">Security Engineering</span> — building cryptographic trust systems, threat modeling, API hardening</li>
            <li><span className="text-white">Backend Systems</span> — scaling services, memory safety, designing clean protocols</li>
            <li><span className="text-white">Research Projects</span> — threat actor infrastructure analysis, OSINT scraping</li>
            <li><span className="text-white">Developer Tools</span> — building local debuggers, parsers, ciphers, CLI utilities</li>
          </ul>
        </div>

        {/* What I'm looking for */}
        <div className="rounded-xl p-5 border" style={{ background: "oklch(0.10 0.03 260 / 70%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
            What I'm Looking For
          </h4>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            <li><span className="text-white">Internship Roles</span> — security engineering, backend dev, or research placements</li>
            <li><span className="text-white">Open Source Work</span> — contributing to security tools, protocols, privacy tech</li>
            <li><span className="text-white">Security-focused Teams</span> — engineering teams prioritizing architectural security</li>
            <li><span className="text-white">Intense Technical Problems</span> — low-level, cryptographically heavy, or protocol challenges</li>
          </ul>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <a
          href="https://mail.google.com/mail/?view=cm&to=sanskarphougat2004@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center h-12 rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
          style={{ boxShadow: "var(--shadow-neon)" }}
        >
          Start a Conversation →
        </a>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════════
// ORIGINAL SECTIONS (REFACTORED FOR SCANNABILITY)
// ════════════════════════════════════════════════════════════════════════════

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [blink, setBlink] = useState(true);
  const [easterCount, setEasterCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBlink((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  const handleCursorClick = () => {
    const next = easterCount + 1;
    setEasterCount(next);
    if (next >= 3) {
      setFactIdx(Math.floor(Math.random() * SECRET_FACTS.length));
      setShowSecret(true);
      setEasterCount(0);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center grid-bg overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 70% 60% at 40% 40%, oklch(0.15 0.05 280 / 50%) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-20">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary"
            style={{ color: DIM }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Portfolio
          </Link>
          <span style={{ color: FAINT }}>/</span>
          <span className="text-xs uppercase tracking-widest" style={{ color: GREEN, fontFamily: MONO }}>
            story
          </span>
        </motion.div>

        {/* Terminal prompt label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-10" style={{ background: `${GREEN}50` }} />
          <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: `${GREEN}80`, fontFamily: MONO }}>
            ~/personal/story.log
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: GREEN }} />
            <span className="text-[8px] uppercase tracking-widest" style={{ color: `${GREEN}80`, fontFamily: MONO }}>
              unfiltered
            </span>
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[0.92] mb-6"
          style={{ fontFamily: SANS }}
        >
          Behind The{" "}
          <span className="text-gradient">Portfolio.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-2xl text-base sm:text-lg leading-relaxed mb-10"
          style={{ color: MUTED }}
        >
          A more personal look at the journey, curiosity, failures, experiments, and ideas
          that shaped the person behind the projects.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            opacity: { duration: 0.6, delay: 0.6 }
          }}
          className="mt-16 flex items-center gap-3"
          style={{ color: GREEN }}
        >
          <div className="h-px w-8" style={{ background: `${GREEN}60` }} />
          <span className="text-[10px] uppercase tracking-[0.35em] font-semibold" style={{ fontFamily: MONO }}>
            scroll to read ↓
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 1: Introduction (About Me) ─────────────────────────────────────────
function IntroSection() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> section_01.init()"
          title="About Me"
        />
      </Reveal>

      <div className="grid md:grid-cols-[1fr_260px] gap-8 items-start">
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: MUTED }}>
          <Reveal delay={0.05}>
            <p>
              The honest version of how I got into cybersecurity starts with a question I couldn't stop asking:{" "}
              <Glow>how does this actually work?</Glow> Not at a surface level. All the way down. Why does this protocol trust that? What breaks if that assumption is wrong?
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              I'm an ECE student at JIIT — Electronics and Communication Engineering. This forces me to see the boundary between hardware and software, which is exactly where the most interesting security vulnerabilities tend to live.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <CalloutBox title="Why It Matters" accent={GREEN}>
              Security isn't a dark art; it's the process of identifying the gap between what a system designer assumed was true, and what is actually true in the real world.
            </CalloutBox>
          </Reveal>
        </div>

        {/* Terminal sidebar */}
        <Reveal direction="right" delay={0.2}>
          <TerminalBlock label="~/identity.json" accent={GREEN}>
            <div className="space-y-3 text-[10px]" style={{ fontFamily: MONO }}>
              {[
                ["role", '"ECE Student, JIIT Noida"'],
                ["focus", '"Cybersecurity & Crypto"'],
                ["intern", '"CyberPeace Foundation"'],
                ["rank", '"TryHackMe Top 15%"'],
                ["mode", '"Build-first learner"'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span style={{ color: PURPLE }}>"{k}"</span>
                  <span style={{ color: FAINT }}>:</span>
                  <span style={{ color: v.startsWith('"') ? GREEN : CYAN }}>{v}</span>
                </div>
              ))}
            </div>
          </TerminalBlock>
        </Reveal>
      </div>
    </div>
  );
}

// ── Section 2: Why ECE (ECE to Security) ───────────────────────────────────────
function WhyECESection() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> cat why_ece.txt"
          title="ECE to Security"
          sub="Understanding the boundary between hardware and software."
        />
      </Reveal>

      <div className="space-y-4">
        <Reveal delay={0.05}>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            Most engineers specialise in hardware or software. ECE forces you to understand both layers. Signal processing gave me intuition about noise and degradation. Communication systems taught me about protocols and the assumptions buried inside them.
          </p>
        </Reveal>

        {/* Highlighted Insight */}
        <Reveal delay={0.1}>
          <CalloutBox title="The Realization" accent={GREEN}>
            Every communication protocol is a trust model. TCP assumes endpoint identity. DNS assumes resolver integrity. Security is what happens when you proactively look for where these assumptions break down.
          </CalloutBox>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            ECE gave me a habit I've never been able to shake: asking <em>"what's assumed here, and what happens if that assumption breaks?"</em> That question turns out to be almost the entire discipline of security engineering.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

// ── Section 3: How I Discovered Cybersecurity ─────────────────────────────────
function DiscoverySection() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> grep -r 'origin' ./security"
          title="Why Cybersecurity"
        />
      </Reveal>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <Reveal delay={0.05}>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              My introduction to security wasn't dramatic. It was a networking lecture studying TCP/IP packets. I had this quiet realisation: I had no way of verifying that the packet I was receiving actually came from who it claimed.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              I went down a rabbit hole of ARP poisoning, DNS spoofing, and Man-in-the-middle attacks. Not to exploit, but to understand how a globally trusted system could be so structurally naive about verification.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <CalloutBox title="Key Takeaway" accent={GREEN}>
              I'm less interested in the exploit itself and more interested in the design choices. Security is the art of robust system design.
            </CalloutBox>
          </Reveal>
        </div>

        {/* Visual: trust assumptions stack */}
        <Reveal direction="right" delay={0.2}>
          <div className="space-y-2">
            {[
              { label: "Application Layer", note: "assumes transport is secure", c: GREEN },
              { label: "TLS / Encryption",  note: "assumes CAs are honest", c: GREEN },
              { label: "TCP / Transport",   note: "assumes IP is reliable", c: GREEN },
              { label: "IP / Network",      note: "assumes routing is honest", c: GREEN },
              { label: "Physical / Link",   note: "assumes medium is trusted", c: GREEN },
            ].map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="flex items-center gap-3 rounded-lg px-4 py-2"
                style={{ background: `${layer.c}05`, border: `1px solid ${layer.c}18` }}
              >
                <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: layer.c, boxShadow: `0 0 6px ${layer.c}` }} />
                <div className="flex-1">
                  <span className="text-[11px] font-semibold text-white">{layer.label}</span>
                  <span className="ml-2 text-[9px]" style={{ color: FAINT, fontFamily: MONO }}>// {layer.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

// ── Section 4: Detailed Journey Log ───────────────────────────────────────────
function JourneySection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> git log --oneline journey"
          title="Detailed Learning Log"
          sub="Click any phase below to expand details and lessons learned."
        />
      </Reveal>

      <div className="relative mt-4">
        <div
          className="absolute left-5 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, ${GREEN}40, ${PURPLE}20, transparent)` }}
        />

        <div className="space-y-2 pl-12">
          {JOURNEY.map((stage, i) => {
            const Icon = stage.icon;
            const isOpen = active === i;
            return (
              <Reveal key={stage.num} delay={Math.min(i * 0.05, 0.4)}>
                <div className="relative">
                  {/* Node */}
                  <motion.div
                    className="absolute -left-[3.05rem] top-3.5 flex h-7.5 w-7.5 items-center justify-center rounded-full cursor-pointer z-10"
                    style={{
                      background: isOpen ? `${GREEN}18` : "oklch(0.10 0.03 260)",
                      border: `2px solid ${isOpen ? GREEN : `${GREEN}40`}`,
                      boxShadow: isOpen ? `0 0 12px ${GREEN}30` : "none",
                    }}
                    whileHover={{ scale: 1.12, boxShadow: `0 0 16px ${GREEN}40` }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    onClick={() => setActive(isOpen ? null : i)}
                  >
                    <Icon className="h-3 w-3" style={{ color: isOpen ? GREEN : `${GREEN}70` }} />
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      background: isOpen ? "oklch(0.12 0.04 260 / 90%)" : "oklch(0.10 0.03 260 / 70%)",
                      border: `1px solid ${isOpen ? `${GREEN}35` : "oklch(0.20 0.04 260 / 50%)"}`,
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => setActive(isOpen ? null : i)}
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold" style={{ color: `${GREEN}70`, fontFamily: MONO }}>
                          {stage.num}
                        </span>
                        <span className="text-xs font-semibold text-white">{stage.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span className="text-[9px]" style={{ color: FAINT, fontFamily: MONO }}>{stage.period}</span>
                        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronRight className="h-3 w-3" style={{ color: DIM }} />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${GREEN}18` }}>
                            <p className="pt-3 text-xs leading-relaxed text-muted-foreground">{stage.story}</p>
                            <div
                              className="flex items-start gap-2 rounded-lg px-3 py-2"
                              style={{ background: `${GREEN}05`, border: `1px solid ${GREEN}15` }}
                            >
                              <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: GREEN }} />
                              <p className="text-[11px] leading-snug" style={{ color: TEXT }}>
                                <span className="font-semibold" style={{ color: GREEN }}>Key lesson: </span>
                                {stage.lesson}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Section 5: TryHackMe ──────────────────────────────────────────────────────
function TryHackMeSection() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> ssh tryhackme@lab"
          title="TryHackMe Journey"
          sub="Bridging the gap between conceptual specs and terminal execution."
        />
      </Reveal>

      <div className="grid md:grid-cols-[1fr_220px] gap-8 items-start">
        <div className="space-y-4">
          <Reveal delay={0.05}>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              I started TryHackMe because theory only takes you so far. You can read about buffer overflows until you know the stack layout cold. Then you open a terminal and your first thought is: <em>"where do I even start?"</em>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              TryHackMe fixed that. It forces you to execute. To fail in a controlled environment, analyze why, and try again. The feedback loop is tight enough to turn confusion into working intuition.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <CalloutBox title="Lessons Learned" accent={GREEN}>
              <p className="mb-1"><strong>1. Theory is not practice:</strong> Conceptual understanding of vulnerabilities differs significantly from finding and exploiting them in a live system.</p>
              <p><strong>2. Value the click:</strong> The moment of understanding—when simple components click into a complete picture—is the target of every lab.</p>
            </CalloutBox>
          </Reveal>
        </div>

        {/* Stats card */}
        <Reveal direction="right" delay={0.2}>
          <TerminalBlock label="~/thm/stats" accent={GREEN}>
            <div className="space-y-3.5 text-[10px]" style={{ fontFamily: MONO }}>
              <div>
                <div className="flex justify-between mb-1">
                  <span style={{ color: DIM }}>Global Rank</span>
                  <span style={{ color: GREEN }}>Top 15%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.15 0.03 260)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  />
                </div>
              </div>
              {[
                { label: "Web Exploitation", pct: 78 },
                { label: "Network Security", pct: 82 },
                { label: "Cryptography",     pct: 75 },
                { label: "Linux Fundamentals", pct: 90 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between mb-0.5">
                    <span style={{ color: DIM }}>{s.label}</span>
                    <span style={{ color: CYAN }}>{s.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "oklch(0.15 0.03 260)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: CYAN }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TerminalBlock>
        </Reveal>
      </div>
    </div>
  );
}

// ── Section 6: Projects I Loved ───────────────────────────────────────────────
function ProjectsSection() {
  const projects = [
    {
      icon: Eye,
      title: "E2E Encryption Attack Lab",
      tag: "CyberPeace Foundation",
      color: GREEN,
      why: "I built this for a research assignment: a three-act MITM demonstration progressing from plaintext to AES-256-GCM encrypted traffic.",
      what: "The key was design: creating a visual dashboard showing someone why encryption isn't optional, turning textbook equations into observable actions.",
      learned: "Security education is most effective when it visually demonstrates why the attacker wins, making defense intuitive.",
    },
    {
      icon: Activity,
      title: "AIIMS Healthcare Security Research",
      tag: "Research Internship",
      color: CYAN,
      why: "Healthcare security is underserved: sensitive records, legacy infrastructure, and real human stakes.",
      what: "Spent weeks threat modeling before writing code, mapping how info flows through systems to expose systemic trust gaps.",
      learned: "Vulnerabilities are rarely purely technical; they inherit structural, human, and institutional weaknesses.",
    },
    {
      icon: Key,
      title: "VaultZero",
      tag: "Personal Project",
      color: PURPLE,
      why: "Built to master zero-knowledge secrets storage. Not because the world needs another manager, but to understand every crypto layer.",
      what: "Zero-knowledge means server-side blindness. Built in TypeScript with a bar of security high enough for my own data.",
      learned: "Building what you would personally trust with your own keys forces rigorous architectural decisions.",
    },
  ];

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> ls -la ./projects"
          title="Projects That Taught Me the Most"
          sub="Not a checklist of features, but the core problems that pulled me in."
        />
      </Reveal>

      <div className="space-y-4">
        {projects.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 0.08}>
              <div
                className="rounded-xl p-5"
                style={{
                  background: "oklch(0.10 0.03 260 / 80%)",
                  border: `1px solid ${p.color}25`,
                  borderLeft: `3px solid ${p.color}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                    style={{ background: `${p.color}12`, border: `1px solid ${p.color}30` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: p.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-bold text-white" style={{ fontFamily: SANS }}>{p.title}</h3>
                      <span className="text-[8px] px-1.5 py-0.5 rounded uppercase tracking-widest font-bold" style={{ color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}30` }}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed mb-1.5" style={{ color: MUTED }}><span className="font-semibold" style={{ color: p.color }}>Why: </span>{p.why}</p>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: MUTED }}>{p.what}</p>
                    <div className="rounded-lg p-3 mt-2 text-[10px]" style={{ background: "oklch(0.08 0.02 260 / 50%)", border: "1px solid oklch(0.18 0.04 260 / 40%)" }}>
                      <span className="font-semibold" style={{ color: p.color }}>Lessons Learned: </span>
                      {p.learned}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

// ── Section 7: Beyond Technology ──────────────────────────────────────────────
function BeyondTechSection() {
  const items = [
    { icon: BookOpen, label: "Reading",         text: "Non-fiction systems thinking, cognitive science, and computer history. Exploring how complex models match cross-domain dynamics." },
    { icon: Brain,    label: "Experiments",     text: "Building minor scripts and setups to understand protocol details. A hostel room filled with hardware prototypes." },
    { icon: Compass,  label: "Hackathons",      text: "A few entries, mostly losses. Each one taught lessons on working under pressure and aligning constraints with new team members." },
    { icon: Heart,    label: "Team dynamics",   text: "Learned that clean communication and alignment on goals contribute as much to shipping software as code design itself." },
    { icon: Globe,    label: "Pattern matching", text: "Spotting trust models in daily, non-technical environments. Understanding how real-world friction designs interfaces." },
    { icon: Star,     label: "Hostel life",     text: "Late-night terminal debugging, shared setups, and building lasting friendships while learning core system engineering." },
  ];

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> whoami --full"
          title="Beyond Tech"
          sub="The interests and patterns that influence my approach to engineering."
        />
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.label} delay={i * 0.06}>
              <motion.div
                className="group rounded-xl p-4 h-full"
                style={{
                  background: "oklch(0.10 0.03 260 / 70%)",
                  border: "1px solid oklch(0.20 0.04 260 / 50%)",
                }}
                whileHover={{
                  border: `1px solid ${GREEN}25`,
                  background: "oklch(0.12 0.04 260 / 80%)",
                  transition: { duration: 0.15 },
                }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <Icon className="h-3.5 w-3.5 transition-colors" style={{ color: `${GREEN}60` }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: DIM }}>
                    {item.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{item.text}</p>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

// ── Section 8: Failures & Lessons ─────────────────────────────────────────────
function FailuresSection() {
  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> cat /var/log/errors.log"
          title="Failures & Lessons"
          sub="An honest review of technical experiments that went wrong, and what they taught me."
        />
      </Reveal>

      <div className="space-y-4 mt-6">
        {FAILURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={i * 0.08}>
              <div
                className="rounded-xl p-5"
                style={{
                  background: "oklch(0.10 0.03 260 / 80%)",
                  border: "1px solid oklch(0.22 0.04 260 / 50%)",
                  borderLeft: "3px solid oklch(0.7 0.22 320 / 50%)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg" style={{ background: "oklch(0.7 0.22 320 / 10%)", border: "1px solid oklch(0.7 0.22 320 / 25%)" }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: "oklch(0.7 0.22 320 / 80%)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "oklch(0.7 0.22 320 / 60%)", fontFamily: MONO }}>
                        // incident #0{i+1}
                      </span>
                      <h3 className="text-xs font-bold text-white">{f.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: MUTED }}>{f.body}</p>
                    <div className="flex items-start gap-2 rounded-md px-3 py-2" style={{ background: "oklch(0.7 0.22 320 / 06%)", border: "1px solid oklch(0.7 0.22 320 / 18%)" }}>
                      <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.7 0.22 320 / 70%)" }} />
                      <p className="text-[10px] leading-snug" style={{ color: DIM }}>
                        <span className="font-semibold" style={{ color: "oklch(0.7 0.22 320 / 80%)" }}>Key Takeaway: </span>
                        {f.takeaway}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

// ── Section 9: Future Vision (Future Goals) ───────────────────────────────────
function FutureSection() {
  const visions = [
    { label: "Near term", icon: Code2, color: CYAN, text: "Understand zero-knowledge proofs deeply enough to build real, low-level circuits. Not just importing third-party libraries, but understanding the proof math directly." },
    { label: "Medium term", icon: Layers, color: GREEN, text: "Contribute to security infrastructure where a compromise carries real human stakes—e.g. healthcare database structures or critical systems." },
    { label: "Long term", icon: Compass, color: PURPLE, text: "Work at the interface of theoretical research and production systems engineering to make modern security paradigms accessible." },
  ];

  return (
    <div className="rounded-2xl p-6 sm:p-8 border" style={{ background: "oklch(0.07 0.02 260 / 50%)", borderColor: "oklch(0.20 0.04 260 / 50%)" }}>
      <Reveal>
        <SectionHeading
          prompt="> cat ./future.plan"
          title="Future Goals"
          sub="Rigid plans are usually wrong. What I have is a direction."
        />
      </Reveal>

      <div className="space-y-4 mt-6">
        {visions.map((v, i) => {
          const Icon = v.icon;
          return (
            <Reveal key={v.label} delay={i * 0.08}>
              <div
                className="flex gap-4 rounded-xl p-4"
                style={{
                  background: `${v.color}05`,
                  border: `1px solid ${v.color}15`,
                }}
              >
                <div>
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg" style={{ background: `${v.color}10`, border: `1px solid ${v.color}25` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: v.color }} />
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: `${v.color}70`, fontFamily: MONO }}>
                    {v.label}
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.25}>
        <div className="mt-6">
          <TerminalBlock label="~/closing_thoughts.md" accent={GREEN}>
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-white">
                The target remains: understand trust, build mechanisms to defend it, and always check the core assumptions.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span style={{ color: GREEN, fontFamily: MONO, fontSize: "11px" }}>—</span>
                <span className="text-[10px]" style={{ color: DIM, fontFamily: MONO }}>Sanskar Phougat, June 2026</span>
                <span className="inline-block h-3 w-1.5 ml-1" style={{ background: GREEN, opacity: 0.8, animation: "pulse 1.2s infinite" }} />
              </div>
            </div>
          </TerminalBlock>
        </div>
      </Reveal>
    </div>
  );
}

// ── Footer easter egg ─────────────────────────────────────────────────────────
function StoryFooter() {
  return (
    <footer className="py-12 px-6 text-center" style={{ borderTop: "1px solid oklch(0.18 0.04 260 / 50%)" }}>
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-[9px] uppercase tracking-[0.25em]" style={{ color: FAINT, fontFamily: MONO }}>
          // if you read this far, we'd probably have an interesting conversation.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary"
            style={{ color: DIM }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
          <span style={{ color: FAINT }}>·</span>
          <Link
            to="/timeline"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary"
            style={{ color: DIM }}
          >
            Learning Timeline
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function StoryPage() {
  const [activeSection, setActiveSection] = useState<string>("quick-profile");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Active section tracking logic using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0.05 }
    );

    STORY_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      STORY_SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.title = "Behind The Portfolio — Sanskar Phougat";
    console.log(
      "%c👋 Hey, you found the console.\n%cIf you're curious enough to open DevTools on a portfolio page, we'd probably have a good conversation.\n\nsanskar.phougat@gmail.com",
      "font-size: 14px; font-weight: bold; color: #5af5c0;",
      "font-size: 12px; color: #8899aa;"
    );
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "oklch(0.08 0.02 260)", color: TEXT }}>
      <CustomCursor />
      <Navbar />

      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% -10%, oklch(0.14 0.05 280 / 35%) 0%, transparent 60%)" }}
      />

      <div className="relative z-10">
        <HeroSection />

        {/* Main Grid Wrapper for TOC & Content */}
        <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-[240px_1fr] lg:gap-16 items-start pb-24">
          
          {/* Left Sticky Sidebar: TOC */}
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:h-[calc(100vh-10rem)] pr-4 z-20 overflow-y-auto scrollbar-hide">
            <StoryTableOfContents activeId={activeSection} scrollProgress={scrollProgress} />
          </aside>

          {/* Right Column: Content */}
          <div className="min-w-0 space-y-12">
            <div id="quick-profile"><RecruiterSnapshot /></div>
            <div id="about-me"><IntroSection /></div>
            <div id="ece-to-security"><WhyECESection /></div>
            <div id="why-cybersecurity"><DiscoverySection /></div>
            <div id="timeline"><PersonalTimeline /></div>
            <div id="journey"><JourneySection /></div>
            <div id="tryhackme-journey"><TryHackMeSection /></div>
            <div id="projects-taught-me"><ProjectsSection /></div>
            <div id="what-defines-me"><DefinitionCards /></div>
            <div id="currently-exploring"><CurrentlyExploring /></div>
            <div id="failures-lessons"><FailuresSection /></div>
            <div id="fun-facts"><FunFactsSection /></div>
            <div id="beyond-tech"><BeyondTechSection /></div>
            <div id="future-goals"><FutureSection /></div>
            <div id="work-with-me"><WorkWithMe /></div>
            <StoryFooter />
          </div>

        </div>

        {/* Mobile menu content drawer & button */}
        <MobileTOC activeId={activeSection} />
      </div>
    </div>
  );
}
