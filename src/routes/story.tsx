import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowLeft, Shield, Lock, Code2, Brain, Eye,
  BookOpen, Cpu, Globe, Key, Activity, Wifi,
  Layers, AlertCircle, Compass, ChevronRight, Terminal,
  Zap, Heart, Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Behind The Portfolio — Sanskar Phougat" },
      { name: "description", content: "The personal story behind Sanskar Phougat's journey into cybersecurity, cryptography, and secure systems engineering." },
    ],
  }),
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

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ prompt, title, sub }: { prompt: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: CYAN, fontFamily: MONO }}>
          {prompt}
        </span>
        <div className="h-px w-12" style={{ background: `${CYAN}40` }} />
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
    <span className="font-semibold" style={{ color: CYAN, textShadow: `0 0 20px ${CYAN}50` }}>
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
        style={{ borderColor: `${CYAN}50`, color: CYAN }}
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
            style={{ background: "oklch(0.12 0.04 260)", border: `1px solid ${CYAN}35`, color: TEXT, fontFamily: MONO, boxShadow: `0 0 16px ${CYAN}20` }}
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

// ── Current obsessions data ───────────────────────────────────────────────────
const OBSESSIONS = [
  { icon: Key,      label: "Applied Cryptography",    desc: "The math of building trust. Still chasing deeper intuition here." },
  { icon: Shield,   label: "Secure System Design",    desc: "Threat modelling before the first line of code." },
  { icon: Layers,   label: "Zero-Knowledge Proofs",   desc: "Proving you know something without revealing what. Genuinely magical." },
  { icon: Lock,     label: "Password Managers",       desc: "Where UX meets cryptography. Harder than it sounds." },
  { icon: Activity, label: "Healthcare Security",     desc: "Real stakes. Real consequences. That matters to me." },
  { icon: Globe,    label: "Privacy Technologies",    desc: "Not just for edge cases. For everyone." },
  { icon: Brain,    label: "Authentication Systems",  desc: "Proving identity is one of the oldest hard problems in computing." },
  { icon: Eye,      label: "Protocol Analysis",       desc: "Finding the trust assumptions baked into the design." },
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

// ── Easter egg: secret terminal ───────────────────────────────────────────────
const SECRET_FACTS = [
  "My hostel room looks like a server room. Not planned — just what happens when you build constantly.",
  "I debug code at 2 AM more often than I'd like to admit.",
  "I've read the Diffie-Hellman paper multiple times. Still find it remarkable.",
  "I once spent 3 hours on a bug that had a 3-line fix. Those hours taught me something the fix never would have.",
  "I keep a physical notebook for ideas that don't fit in code.",
  "My first 'security' project was writing a Caesar cipher decoder in school. I was very impressed with myself.",
];

// ════════════════════════════════════════════════════════════════════════════
// SECTIONS
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
          <span className="text-xs uppercase tracking-widest" style={{ color: CYAN, fontFamily: MONO }}>
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
          <div className="h-px w-10" style={{ background: `${CYAN}50` }} />
          <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: `${CYAN}80`, fontFamily: MONO }}>
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

        {/* Interactive terminal cursor easter egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2"
        >
          <span className="text-xs" style={{ color: FAINT, fontFamily: MONO }}>
            guest@portfolio:~/story$
          </span>
          <button
            onClick={handleCursorClick}
            title="Hmm… what happens if you click this three times?"
            className="focus:outline-none"
            aria-label="Terminal cursor"
          >
            <span
              className="inline-block text-sm font-bold transition-all"
              style={{
                color: CYAN,
                fontFamily: MONO,
                opacity: blink ? 1 : 0,
                textShadow: `0 0 12px ${CYAN}`,
              }}
            >
              █
            </span>
          </button>
          {easterCount > 0 && easterCount < 3 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px]"
              style={{ color: FAINT, fontFamily: MONO }}
            >
              ({3 - easterCount} more…)
            </motion.span>
          )}
        </motion.div>

        {/* Easter egg reveal */}
        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="mt-6 rounded-xl p-4 max-w-md"
              style={{ background: "oklch(0.11 0.04 260)", border: `1px solid ${CYAN}30`, boxShadow: `0 0 24px ${CYAN}10` }}
            >
              <div className="flex items-start gap-3">
                <Star className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: CYAN }} />
                <div>
                  <span className="text-[8px] font-bold tracking-widest uppercase block mb-1" style={{ color: `${CYAN}60`, fontFamily: MONO }}>
                    // hidden fact unlocked
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: TEXT }}>{SECRET_FACTS[factIdx]}</p>
                </div>
                <button onClick={() => setShowSecret(false)} className="ml-auto text-xs opacity-40 hover:opacity-80 transition-opacity" style={{ color: MUTED }}>✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex items-center gap-3"
          style={{ color: FAINT }}
        >
          <div className="h-px w-8" style={{ background: `${FAINT}60` }} />
          <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: MONO }}>
            scroll to read
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 1: Introduction ───────────────────────────────────────────────────
function IntroSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> section_01.init()"
            title="I didn't plan any of this."
          />
        </Reveal>

        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
          <div className="space-y-5 text-base leading-relaxed" style={{ color: MUTED }}>
            <Reveal delay={0.05}>
              <p>
                The honest version of how I got into cybersecurity starts with a question I couldn't stop asking:{" "}
                <Glow>how does this actually work?</Glow> Not at a surface level. All the way down. Why does this protocol trust that? What's actually happening inside this handshake? What breaks if that assumption is wrong?
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                I'm an ECE student at JIIT — Electronics and Communication Engineering, which sounds like it has nothing to do with security. Until you realise that communication is fundamentally about{" "}
                <SecretWord word="trust" secret="Every cryptographic protocol is trust, formalised." />: getting the right information to the right place despite interference, noise, and the occasional adversary. Security is what happens when you take that adversary seriously.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                I am not a cybersecurity expert. I'm an engineer who keeps asking uncomfortable questions about how trust is built, maintained, and broken inside digital systems. That curiosity led me to networking, then security, then cryptography, then building tools that take these ideas seriously. It's still going.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ color: `${MUTED}80` }}>
                This page isn't a resume. It's an attempt to explain the thinking behind the work. Why certain problems keep pulling me back. What I've built, broken, and learned. And what I'm still trying to understand.
              </p>
            </Reveal>
          </div>

          {/* Terminal sidebar */}
          <Reveal direction="right" delay={0.25}>
            <TerminalBlock label="~/identity.json">
              <div className="space-y-3 text-[11px]" style={{ fontFamily: MONO }}>
                {[
                  ["role", '"ECE Student, JIIT"'],
                  ["focus", '"Cybersecurity, Cryptography"'],
                  ["intern", '"CyberPeace Foundation"'],
                  ["rank", '"TryHackMe Top 15%"'],
                  ["tools", "3+"],
                  ["mode", '"perpetually curious"'],
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
    </section>
  );
}

// ── Section 2: Why ECE ────────────────────────────────────────────────────────
function WhyECESection() {
  return (
    <section className="py-24 px-6" style={{ background: "oklch(0.07 0.02 260 / 50%)" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> cat why_ece.txt"
            title="Why Electronics & Communication?"
            sub="The honest answer: I wanted to understand both layers."
          />
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.05}>
            <p className="text-base leading-relaxed" style={{ color: MUTED }}>
              Most engineers specialise in hardware or software. ECE forces you to understand the boundary between them — and that boundary turns out to be where the most interesting problems live. Signal processing gave me intuition about noise and degradation. Communication systems taught me about protocols and the assumptions buried inside them.
            </p>
          </Reveal>

          {/* Insight callout */}
          <Reveal delay={0.1}>
            <div
              className="rounded-xl p-5 my-6"
              style={{ background: `${CYAN}08`, border: `1px solid ${CYAN}25`, borderLeft: `3px solid ${CYAN}` }}
            >
              <div className="flex items-start gap-3">
                <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: CYAN }} />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: TEXT }}>
                    The realisation that changed everything
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                    Every communication protocol makes trust assumptions. TCP assumes the endpoint is who it claims. DNS assumes resolvers are honest. TLS assumes certificate authorities haven't been compromised. These are reasonable assumptions — <Glow>until they aren't</Glow>. That gap between assumption and reality is exactly where security lives.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-base leading-relaxed" style={{ color: MUTED }}>
              ECE gave me a habit I've never been able to shake: asking <em>"what's assumed here, and what happens if that assumption breaks?"</em> That question turns out to be almost the entire discipline of security engineering. I didn't know that when I chose ECE. I found it by accident, and I've been chasing it ever since.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Section 3: How I Discovered Cybersecurity ─────────────────────────────────
function DiscoverySection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> grep -r 'origin' ./security"
            title="How I Discovered Cybersecurity"
          />
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-5">
            <Reveal delay={0.05}>
              <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                My introduction to security wasn't dramatic. It was a <Glow>networking lecture</Glow>.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                We were studying TCP/IP — packet routing, addressing, the whole stack. Standard material. Somewhere in there I had this quiet realisation: I had no way of verifying that the packet I was receiving actually came from who it claimed to be from. Not in any cryptographic sense. Just trust.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                I went down a rabbit hole. ARP poisoning. DNS spoofing. Man-in-the-middle attacks. Not because I wanted to exploit anything — but because I wanted to understand how a system trusted globally could be so structurally naive about verification.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-base leading-relaxed" style={{ color: `${MUTED}90` }}>
                That curiosity is still what drives me. I'm less interested in{" "}
                <em>"how do I break this"</em> and more interested in{" "}
                <em>"why was this built to trust what it trusts?"</em>
              </p>
            </Reveal>
          </div>

          {/* Visual: trust assumptions stack */}
          <Reveal direction="right" delay={0.2}>
            <div className="space-y-2">
              {[
                { label: "Application Layer", note: "assumes transport is secure", c: CYAN },
                { label: "TLS / Encryption",  note: "assumes CAs are honest", c: GREEN },
                { label: "TCP / Transport",   note: "assumes IP is reliable", c: CYAN },
                { label: "IP / Network",      note: "assumes routing is honest", c: PURPLE },
                { label: "Physical / Link",   note: "assumes medium is trusted", c: GREEN },
              ].map((layer, i) => (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5"
                  style={{ background: `${layer.c}08`, border: `1px solid ${layer.c}22` }}
                >
                  <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: layer.c, boxShadow: `0 0 6px ${layer.c}` }} />
                  <div className="flex-1">
                    <span className="text-xs font-semibold" style={{ color: TEXT }}>{layer.label}</span>
                    <span className="ml-2 text-[10px]" style={{ color: FAINT, fontFamily: MONO }}>// {layer.note}</span>
                  </div>
                </motion.div>
              ))}
              <p className="text-[10px] mt-3 text-right" style={{ color: FAINT, fontFamily: MONO }}>
                // every layer inherits the layer below's assumptions
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Learning Journey ───────────────────────────────────────────────
function JourneySection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-24 px-6" style={{ background: "oklch(0.07 0.02 260 / 50%)" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> git log --oneline journey"
            title="The Learning Journey"
            sub="Eight stages. Each one changed how I think."
          />
        </Reveal>

        <div className="relative">
          {/* Vertical rail */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(to bottom, ${CYAN}40, ${PURPLE}20, transparent)` }}
          />

          <div className="space-y-2 pl-14">
            {JOURNEY.map((stage, i) => {
              const Icon = stage.icon;
              const isOpen = active === i;
              return (
                <Reveal key={stage.num} delay={Math.min(i * 0.05, 0.4)}>
                  <div className="relative">
                    {/* Node */}
                    <motion.div
                      className="absolute -left-[3.15rem] top-4 flex h-8 w-8 items-center justify-center rounded-full cursor-pointer z-10"
                      style={{
                        background: isOpen ? `${stage.color}20` : "oklch(0.10 0.03 260)",
                        border: `2px solid ${isOpen ? stage.color : `${stage.color}40`}`,
                        boxShadow: isOpen ? `0 0 16px ${stage.color}40` : "none",
                      }}
                      whileHover={{ scale: 1.15, boxShadow: `0 0 20px ${stage.color}50` }}
                      transition={{ type: "spring", stiffness: 380, damping: 22 }}
                      onClick={() => setActive(isOpen ? null : i)}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: isOpen ? stage.color : `${stage.color}70` }} />
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      className="rounded-xl overflow-hidden cursor-pointer"
                      style={{
                        background: isOpen ? "oklch(0.12 0.04 260 / 90%)" : "oklch(0.10 0.03 260 / 70%)",
                        border: `1px solid ${isOpen ? `${stage.color}35` : "oklch(0.20 0.04 260 / 50%)"}`,
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setActive(isOpen ? null : i)}
                      whileHover={{ y: -1 }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold" style={{ color: `${stage.color}70`, fontFamily: MONO }}>
                            {stage.num}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: TEXT }}>{stage.title}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <span className="text-[9px]" style={{ color: FAINT, fontFamily: MONO }}>{stage.period}</span>
                          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="h-3.5 w-3.5" style={{ color: DIM }} />
                          </motion.div>
                        </div>
                      </div>

                      {/* Expandable body */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3" style={{ borderTop: `1px solid ${stage.color}18` }}>
                              <p className="pt-3 text-sm leading-relaxed" style={{ color: MUTED }}>{stage.story}</p>
                              <div
                                className="flex items-start gap-2 rounded-lg px-3 py-2.5"
                                style={{ background: `${stage.color}08`, border: `1px solid ${stage.color}20` }}
                              >
                                <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: stage.color }} />
                                <p className="text-xs leading-snug" style={{ color: `${TEXT}90` }}>
                                  <span className="font-semibold" style={{ color: stage.color }}>Key lesson: </span>
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
    </section>
  );
}

// ── Section 5: TryHackMe ──────────────────────────────────────────────────────
function TryHackMeSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> ssh tryhackme@lab"
            title="The TryHackMe Journey"
            sub="Learning by doing. Failing by doing. Understanding by doing."
          />
        </Reveal>

        <div className="grid md:grid-cols-[1fr_220px] gap-10 items-start">
          <div className="space-y-5">
            <Reveal delay={0.05}>
              <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                I started TryHackMe because theory only takes you so far. You can read about buffer overflows until you know the stack layout cold. Then you open a terminal and your first thought is:{" "}
                <em style={{ color: `${TEXT}90` }}>"where do I even start?"</em>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                TryHackMe fixed that. Not because it gamifies learning — though the structure helps — but because it <Glow>forces you to actually execute</Glow>. To fail in a controlled environment, to look at why, to try again. The feedback loop is tight enough to actually learn from.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                My favourite moments weren't the ones where I got the flag. They were the ones where I got stuck for two hours, finally understood something fundamental about how a system was designed, and everything clicked. That click — the moment confusion becomes intuition — is what I'm chasing.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm" style={{ color: `${MUTED}70` }}>
                Top 15% globally. That number means less to me than the fact that I genuinely look forward to every session.
              </p>
            </Reveal>
          </div>

          {/* Stats card */}
          <Reveal direction="right" delay={0.2}>
            <TerminalBlock label="~/thm/stats" accent={GREEN}>
              <div className="space-y-4 text-xs" style={{ fontFamily: MONO }}>
                <div>
                  <div className="flex justify-between mb-1.5">
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
                    <div className="flex justify-between mb-1">
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
    </section>
  );
}

// ── Section 6: Projects I Loved ───────────────────────────────────────────────
function ProjectsSection() {
  const projects = [
    {
      icon: Eye,
      title: "E2E Encryption Attack Lab",
      tag: "CyberPeace Foundation",
      color: CYAN,
      why: "I built this for a research assignment: a three-act MITM demonstration progressing from plaintext to AES-256-GCM encrypted traffic.",
      what: "The interesting part wasn't the implementation. It was designing something that could show someone — clearly, visually — why encryption isn't optional. I wanted to make the invisible visible. To turn a textbook concept into something you could watch happen.",
      learned: "The best security education doesn't just explain what an attack is. It shows you why the attacker wins, so you understand what you're actually defending against.",
    },
    {
      icon: Activity,
      title: "AIIMS Healthcare Security Research",
      tag: "Research Internship",
      color: GREEN,
      why: "Healthcare data security is genuinely underserved. Sensitive records, legacy infrastructure, complex organisational structures — and real consequences when things go wrong.",
      what: "I spent weeks just understanding the threat surface before writing a line of code. The technical analysis was secondary to mapping how information actually flows through a healthcare system — where the gaps are, and why they exist.",
      learned: "Security isn't just about technical controls. It's about understanding human systems, institutional pressures, and why things were built the way they were. The vulnerabilities are rarely purely technical.",
    },
    {
      icon: Key,
      title: "VaultZero",
      tag: "Personal Project",
      color: PURPLE,
      why: "Not because the world needs another password manager — it doesn't. But because I needed to understand every single layer of storing secrets properly.",
      what: "Zero-knowledge encryption means the server never sees your plaintext. TypeScript because I wanted something I could actually ship. The goal was building something I would personally trust with my own credentials — which is a harder bar than most security products meet.",
      learned: "Building something you'd trust yourself to use is the most honest standard. It forces decisions that pure engineering doesn't.",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "oklch(0.07 0.02 260 / 50%)" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> ls -la ./projects"
            title="Projects I Actually Cared About"
            sub="Not a feature list. The reason I built them."
          />
        </Reveal>

        <div className="space-y-5">
          {projects.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: "oklch(0.10 0.03 260 / 80%)",
                    border: `1px solid ${p.color}25`,
                    borderLeft: `3px solid ${p.color}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                      style={{ background: `${p.color}12`, border: `1px solid ${p.color}30` }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ color: p.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-bold" style={{ color: TEXT, fontFamily: SANS }}>{p.title}</h3>
                        <span className="text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-bold" style={{ color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}30` }}>
                          {p.tag}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: `${MUTED}90` }}><span style={{ color: p.color }}>Why: </span>{p.why}</p>
                      <p className="text-sm leading-relaxed mb-2" style={{ color: MUTED }}>{p.what}</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: DIM }}>
                        <span className="font-semibold" style={{ color: `${p.color}80` }}>What it taught me: </span>
                        {p.learned}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section 7: Beyond Technology ──────────────────────────────────────────────
function BeyondTechSection() {
  const items = [
    { icon: BookOpen, label: "Reading",         text: "Mostly non-fiction. Systems thinking, cognitive science, the history of computing. Books that make me think about how ideas connect across domains." },
    { icon: Brain,    label: "Experiments",     text: "I build random things to understand them. Not to ship them. The hostel room currently has three projects in various states of 'I'll clean this up later.'" },
    { icon: Compass,  label: "Hackathons",      text: "Entered a few. Lost most of them. Every one taught me something I couldn't have learned from a textbook — usually something about working under pressure with people I'd just met." },
    { icon: Heart,    label: "Team experiences",text: "College life taught me that technical skill is maybe 40% of shipping something real. The rest is communication, alignment, and understanding what 'done' actually means to everyone on the team." },
    { icon: Globe,    label: "Cross-domain curiosity", text: "I think in security patterns even when I'm not thinking about security. Once you start seeing trust assumptions everywhere, you can't stop. It's useful and mildly inconvenient." },
    { icon: Star,     label: "College life",    text: "JIIT. Hostel experiences, late-night debugging sessions, competition preparations, and the specific kind of friendship that forms when everyone is figuring things out simultaneously." },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> whoami --full"
            title="Beyond Technology"
            sub="The parts that don't go in a résumé but probably matter more."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-base leading-relaxed mb-10" style={{ color: MUTED }}>
            I'm curious about a lot of things that have nothing to do with computers. I think that makes me a better engineer. You learn to see patterns across domains, and those cross-domain patterns often turn out to be more generalisable than domain-specific knowledge.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-4">
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
                    border: `1px solid ${CYAN}25`,
                    background: "oklch(0.12 0.04 260 / 80%)",
                    transition: { duration: 0.15 },
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Icon className="h-4 w-4 transition-colors" style={{ color: `${CYAN}60` }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: DIM }}>
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{item.text}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section 8: Current Obsessions ─────────────────────────────────────────────
function ObsessionsSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-24 px-6" style={{ background: "oklch(0.07 0.02 260 / 50%)" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> ps aux | grep obsessions"
            title="Current Obsessions"
            sub="What I'm actively thinking about. Hover to see why."
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OBSESSIONS.map((item, i) => {
            const Icon = item.icon;
            const colors = [CYAN, GREEN, PURPLE, CYAN, GREEN, CYAN, PURPLE, GREEN];
            const c = colors[i % colors.length];
            const isHov = hovered === i;

            return (
              <Reveal key={item.label} delay={i * 0.05}>
                <motion.div
                  className="relative group rounded-xl p-4 cursor-default overflow-hidden"
                  style={{
                    background: isHov ? `${c}10` : "oklch(0.10 0.03 260 / 80%)",
                    border: `1px solid ${isHov ? `${c}40` : "oklch(0.20 0.04 260 / 50%)"}`,
                    boxShadow: isHov ? `0 0 24px ${c}15, inset 0 0 24px ${c}05` : "none",
                    transition: "all 0.25s ease",
                    minHeight: 120,
                  }}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ y: -3 }}
                >
                  {/* Top glow on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)`, opacity: isHov ? 1 : 0 }}
                  />
                  <Icon className="h-5 w-5 mb-3 transition-all duration-300" style={{ color: isHov ? c : `${c}60`, filter: isHov ? `drop-shadow(0 0 8px ${c})` : "none" }} />
                  <p className="text-xs font-bold mb-1.5 leading-snug" style={{ color: isHov ? TEXT : `${TEXT}80` }}>
                    {item.label}
                  </p>
                  <AnimatePresence>
                    {isHov && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18 }}
                        className="text-[10px] leading-relaxed"
                        style={{ color: DIM }}
                      >
                        {item.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Section 9: Failures & Lessons ─────────────────────────────────────────────
function FailuresSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> cat /var/log/errors.log"
            title="Failures & What They Taught Me"
            sub="The honest list. These are the things I actually learned from."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-base leading-relaxed mb-10" style={{ color: MUTED }}>
            I think the best engineering education comes from failures you caused, not ones you read about. Textbooks describe attacks and defences in the abstract. Breaking your own things in concrete, embarrassing ways teaches you something different — something that sticks.
          </p>
        </Reveal>

        <div className="space-y-4">
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
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "oklch(0.7 0.22 320 / 60%)", fontFamily: MONO }}>
                          // failure
                        </span>
                        <h3 className="text-sm font-bold" style={{ color: TEXT }}>{f.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: MUTED }}>{f.body}</p>
                      <div className="flex items-start gap-2 rounded-md px-3 py-2" style={{ background: "oklch(0.7 0.22 320 / 06%)", border: "1px solid oklch(0.7 0.22 320 / 18%)" }}>
                        <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.7 0.22 320 / 70%)" }} />
                        <p className="text-[11px] leading-snug" style={{ color: DIM }}>
                          <span className="font-semibold" style={{ color: "oklch(0.7 0.22 320 / 80%)" }}>Takeaway: </span>
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
    </section>
  );
}

// ── Section 10: Future Vision ─────────────────────────────────────────────────
function FutureSection() {
  const visions = [
    { label: "Near term", icon: Code2, color: CYAN, text: "Understand zero-knowledge proofs deeply enough to build real systems with them. Not 'use the library' deeply — I mean understand what's happening in the proof itself. That's a different thing." },
    { label: "Medium term", icon: Layers, color: GREEN, text: "Security infrastructure for systems that actually matter. Healthcare, critical communication, financial systems. The places where a breach isn't an embarrassment — it causes real harm to real people." },
    { label: "Long term", icon: Compass, color: PURPLE, text: "Become an engineer who closes the gap between theoretical security and deployed systems. The research is good. The engineering to make it accessible is lagging. That gap is where I want to work." },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "oklch(0.07 0.02 260 / 50%)" }}>
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            prompt="> cat ./future.plan"
            title="Where I'm Heading"
            sub="Not a five-year plan. A direction."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-base leading-relaxed mb-10" style={{ color: MUTED }}>
            I don't have a detailed roadmap. The field moves too fast and I've learned enough to know that rigid plans are usually wrong. What I have is a direction, and a set of questions I find compelling enough to keep following.
          </p>
        </Reveal>

        <div className="space-y-4 mb-12">
          {visions.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.label} delay={i * 0.08}>
                <div
                  className="flex gap-5 rounded-xl p-5"
                  style={{
                    background: `${v.color}06`,
                    border: `1px solid ${v.color}22`,
                  }}
                >
                  <div>
                    <div className="h-9 w-9 flex items-center justify-center rounded-lg" style={{ background: `${v.color}12`, border: `1px solid ${v.color}30` }}>
                      <Icon className="h-4 w-4" style={{ color: v.color }} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: `${v.color}70`, fontFamily: MONO }}>
                      {v.label}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{v.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Closing statement */}
        <Reveal delay={0.25}>
          <TerminalBlock label="~/closing_thoughts.md" accent={CYAN}>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed" style={{ color: `${TEXT}90` }}>
                The direction is this: understand trust, build things that protect it, and never stop asking uncomfortable questions about systems that take it for granted.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                That's enough for now.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span style={{ color: GREEN, fontFamily: MONO, fontSize: "11px" }}>—</span>
                <span className="text-xs" style={{ color: DIM, fontFamily: MONO }}>Sanskar, June 2026</span>
                <span className="inline-block h-3 w-1.5 ml-1" style={{ background: CYAN, opacity: 0.8, animation: "pulse 1.2s infinite" }} />
              </div>
            </div>
          </TerminalBlock>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer easter egg ─────────────────────────────────────────────────────────
function StoryFooter() {
  return (
    <footer className="py-16 px-6 text-center" style={{ borderTop: "1px solid oklch(0.18 0.04 260 / 50%)" }}>
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: FAINT, fontFamily: MONO }}>
          // if you read this far, you're exactly the kind of person I'd enjoy talking to
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary"
            style={{ color: DIM }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portfolio
          </Link>
          <span style={{ color: FAINT }}>·</span>
          <Link
            to="/timeline"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:text-primary"
            style={{ color: DIM }}
          >
            View Learning Timeline
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function StoryPage() {
  // Easter egg: console log on mount
  useEffect(() => {
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
        <IntroSection />
        <WhyECESection />
        <DiscoverySection />
        <JourneySection />
        <TryHackMeSection />
        <ProjectsSection />
        <BeyondTechSection />
        <ObsessionsSection />
        <FailuresSection />
        <FutureSection />
        <StoryFooter />
      </div>
    </div>
  );
}
