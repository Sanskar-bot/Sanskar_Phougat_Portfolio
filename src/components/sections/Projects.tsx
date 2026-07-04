import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["All", "Security Tooling", "Cryptography", "AI / ML", "Backend"] as const;
type Category = (typeof CATEGORIES)[number];

const projects: {
  n: string;
  title: string;
  tag: string;
  desc: string;
  stack: string[];
  href: string;
  categories: Category[];
  featured?: boolean;
}[] = [
  {
    n: "01",
    title: "VaultZero",
    tag: "Zero-Knowledge Password Manager",
    desc: "Google Password Manager-style autofill — with a guarantee Google can't make: the server only ever sees ciphertext. Argon2id-derived keys, AES-256-GCM encryption, phishing-aware origin matching, dual-path recovery (master password or one-time key), per-entry sharing PINs, and native Android AutofillService + iOS CredentialProvider extension.",
    stack: ["TypeScript", "AES-256-GCM", "Argon2id", "Browser Extension", "Android", "iOS", "React", "Prisma"],
    href: "https://github.com/Sanskar-bot/VaultZero",
    categories: ["Security Tooling", "Cryptography"],
    featured: true,
  },
  {
    n: "02",
    title: "SecureHealth",
    tag: "Encrypted Medical Records Platform",
    desc: "End-to-end encrypted medical data sharing system. Client-side AES-256-GCM encryption, RSA key wrapping, and Windows DPAPI-backed private key storage ensure the server sees zero plaintext. Fully migrated to PostgreSQL with 19 tables covering users, patients, doctors, rate limits, and a complete audit log.",
    stack: ["Python", "Flask", "AES-256-GCM", "RSA-2048", "DPAPI", "PostgreSQL"],
    href: "https://github.com/Sanskar-bot/medical-data-decentralisation",
    categories: ["Cryptography", "Backend"],
    featured: true,
  },
  {
    n: "03",
    title: "Clarifact",
    tag: "AI-Powered Real-Time Fact Checker",
    desc: "Manifest V3 Chrome Extension that intercepts claims on any web page and stress-tests them in real time. Nvidia Nemotron Nano 30B via Amazon Bedrock + Tavily web search cross-reference each claim, while a local TF-IDF cosine similarity + negation detector adds offline comparison — injecting a live verdict sidebar without ever slowing the page.",
    stack: ["JavaScript", "Chrome Extension MV3", "Amazon Bedrock", "Nvidia Nemotron", "Tavily API", "Express", "TF-IDF"],
    href: "https://github.com/Sanskar-bot/clarifact",
    categories: ["AI / ML", "Security Tooling"],
    featured: true,
  },
  {
    n: "04",
    title: "PhishingCheck4U",
    tag: "Real-Time Phishing Detection Service",
    desc: "Hosted email phishing detection and OSINT intelligence service. 15+ header features scored by rule-based ML, live AbuseIPDB + VirusTotal + WHOIS API integrations, automated IMAP polling, and an SMTP report responder. 90% accuracy at under 80ms p99 latency.",
    stack: ["Python", "FastAPI", "ML", "SQLite", "AbuseIPDB", "VirusTotal API", "IMAP/SMTP"],
    href: "https://github.com/Sanskar-bot/PhishingCheck4U",
    categories: ["Security Tooling", "AI / ML"],
  },
  {
    n: "05",
    title: "PassGuard",
    tag: "Offline Browser Password Analyzer",
    desc: "Browser extension that evaluates password strength entirely offline. Trie-based substring search detects leet-speak wordlist matches, entropy scoring flags predictable patterns, username similarity checks catch credential-stuffing shortcuts, and CUPP-inspired context-aware suggestions are generated from domain metadata — zero data ever leaves the device.",
    stack: ["JavaScript", "Chrome Extension", "Trie Search", "NLP", "CUPP", "Python"],
    href: "https://github.com/Sanskar-bot/PassGuard",
    categories: ["Security Tooling", "Cryptography"],
  },
  {
    n: "06",
    title: "E2E Attack Lab",
    tag: "Live MITM Attack Research & Demo",
    desc: "Three-act live demo of a key-substitution Man-in-the-Middle attack defeating RSA+AES-256-GCM. An mitmproxy script injects mock public keys mid-handshake while a real-time monitoring dashboard visualises the attack. SHA-256 fingerprint verification (Signal-style 'Safety Numbers') is demonstrated as the defense. Built for CyberPeace Foundation.",
    stack: ["Python", "mitmproxy", "Flask", "Wireshark", "AES-256-GCM", "RSA"],
    href: "https://github.com/Sanskar-bot/E2E-Encryption-Attack-Lab",
    categories: ["Security Tooling", "Cryptography"],
  },
  {
    n: "07",
    title: "VaultStream",
    tag: "E2E Encrypted Video & Image Streaming",
    desc: "Self-hosted secure media streaming over HTTPS. AES-128-GCM with PBKDF2 key derivation encrypts raw camera frames client-side before transmission; the server never touches plaintext video. Server-Sent Events stream live SSE logs, and a one-click script auto-provisions SSL certificates for the local network.",
    stack: ["Python", "Flask", "AES-128-GCM", "PBKDF2", "SSE", "HTTPS", "OpenSSL"],
    href: "https://github.com/Sanskar-bot/secure-media-encryption",
    categories: ["Cryptography", "Backend"],
  },
  {
    n: "08",
    title: "TaskFlow API",
    tag: "Production-Grade REST API",
    desc: "Scalable task management REST API mirroring enterprise Salesforce service patterns. Spring Boot + PostgreSQL with JWT auth, layered Repository/Service/Controller architecture, 80%+ test coverage, and CI/CD. Modular by design and ready to extend with RBAC, rate limiting, or event sourcing.",
    stack: ["Java", "Spring Boot", "PostgreSQL", "JWT", "JUnit 5", "REST API"],
    href: "https://github.com/Sanskar-bot/A-Task-Management-REST-API-in-Java",
    categories: ["Backend"],
  },
];

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.categories.includes(active));

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".proj-card").forEach((card) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 85%" },
      });
    });
  }, { scope: ref });

  return (
    <section id="projects" ref={ref} className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-primary opacity-70" />
              <span className="text-xs uppercase tracking-[0.4em] text-primary">Selected Work</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight sm:text-6xl">
              Things I've <span className="text-gradient">shipped.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Security tooling, applied cryptography, AI integrations and zero-knowledge system design.
          </p>
        </div>

        {/* ── Filter tabs ────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-widest transition-all duration-200 ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-neon)]"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Cards grid ─────────────────────────────────────── */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((p) => (
            <a
              key={p.n}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="proj-card group relative overflow-hidden rounded-3xl glass p-8 transition-all hover:-translate-y-1"
              data-cursor="hover"
            >
              {/* Featured accent */}
              {p.featured && (
                <span
                  className="absolute right-6 top-6 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
                  style={{ background: "var(--gradient-hero)", color: "var(--color-primary-foreground)" }}
                >
                  Featured
                </span>
              )}

              {/* Hover glow */}
              <div
                className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: "var(--gradient-hero)", filter: "blur(60px)", opacity: 0.15 }}
              />

              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.n}</span>
                <FiArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              <h3 className="mt-8 text-3xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-primary">{p.tag}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Category chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest"
                    style={{ background: "oklch(from var(--primary) l c h / 12%)", color: "var(--primary)" }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* ── View all on GitHub ──────────────────────────────── */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/Sanskar-bot?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            View all repositories on GitHub
            <FiArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}