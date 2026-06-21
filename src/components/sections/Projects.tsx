import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";

const projects = [
  {
    n: "05",
    title: "VaultZero",
    tag: "Zero-Knowledge Password Manager",
    desc: "Local-first credential vault where the server never sees plaintext — only ciphertext. Argon2id key derivation hardens against brute-force, AES-256-GCM encrypts every vault entry client-side, and a phishing-aware browser extension cross-checks autofill targets against the saved origin before releasing credentials. Ships with native Android/iOS autofill integration.",
    stack: ["TypeScript", "AES-256-GCM", "Argon2id", "Browser Extension", "Android/iOS"],
    href: "https://github.com/Sanskar-bot/VaultZero",
  },
  {
    n: "01",
    title: "PhishingCheck4U",
    tag: "Real-time Phishing Detection",
    desc: "Email phishing detection service — ML inference pipeline that flags credential-harvesting URLs before a victim ever clicks submit. 90% accuracy, <80ms p99 latency.",
    stack: ["Python", "ML", "REST API", "PostgreSQL"],
    href: "https://github.com/Sanskar-bot/PhishingCheck4U",
  },
  {
    n: "02",
    title: "SecureHealth",
    tag: "Encrypted Medical Records Platform",
    desc: "End-to-end encrypted medical data sharing with hybrid cryptography (RSA + AES-256-GCM), client-side encryption, secure key wrapping and OS-backed private key storage.",
    stack: ["Flask", "AES-256-GCM", "RSA-2048", "PostgreSQL"],
    href: "https://github.com/Sanskar-bot/medical-data-decentralisation",
  },
  {
    n: "03",
    title: "E2E Attack Lab",
    tag: "MITM Attack Research & Demo",
    desc: "Live demo of a Man-in-the-Middle attack defeating RSA+AES-256-GCM via key substitution, with SHA-256 fingerprint verification defense. Built for CyberPeace Foundation.",
    stack: ["Python", "mitmproxy", "Wireshark", "Flask"],
    href: "https://github.com/Sanskar-bot/E2E-Encryption-Attack-Lab",
  },
  {
    n: "04",
    title: "TaskFlow API",
    tag: "Production-Grade REST API",
    desc: "Scalable task management REST API — Spring Boot + PostgreSQL with JWT auth, layered Repository/Service/Controller architecture, 80%+ test coverage and CI/CD.",
    stack: ["Java", "Spring Boot", "PostgreSQL", "JUnit 5"],
    href: "https://github.com/Sanskar-bot/A-Task-Management-REST-API-in-Java",
  },
];

export function Projects() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".proj-card").forEach((card) => {
      gsap.from(card, {
        y: 60, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 85%" },
      });
    });
  }, { scope: ref });

  return (
    <section id="projects" ref={ref} className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-primary opacity-70" />
              <span className="text-xs uppercase tracking-[0.4em] text-primary">Selected Work</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight sm:text-6xl">Things I've <span className="text-gradient">shipped.</span></h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">A mix of security tooling, applied cryptography, and zero-knowledge system design.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <a
              key={p.n}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="proj-card group relative overflow-hidden rounded-3xl glass p-8 transition-all hover:-translate-y-1"
              data-cursor="hover"
            >
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "var(--gradient-hero)", filter: "blur(60px)", opacity: 0.15 }} />
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.n}</span>
                <FiArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h3 className="mt-8 text-3xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-primary">{p.tag}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">{s}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}