import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// Category accent colors mapped to the portfolio's cyber palette
const CYAN = "oklch(0.82 0.18 170)";
const GREEN = "oklch(0.75 0.2 145)";
const PURPLE = "oklch(0.7 0.22 320)";
const AMBER = "oklch(0.80 0.18 75)";

const groups = [
  {
    label: "Offensive Security",
    accent: CYAN,
    items: [
      "Burp Suite",
      "Metasploit",
      "Nmap",
      "Wireshark",
      "Ghidra",
      "radare2",
      "pwntools",
      "Hashcat",
    ],
  },
  {
    label: "Languages",
    accent: GREEN,
    items: ["Python", "C / C++", "Rust", "TypeScript", "Solidity", "Bash", "Assembly"],
  },
  {
    label: "Cryptography",
    accent: PURPLE,
    items: ["AES-GCM", "Argon2id", "Curve25519", "zk-SNARKs", "TLS", "PKI", "WebCrypto"],
  },
  {
    label: "Infrastructure",
    accent: AMBER,
    items: ["Linux", "Docker", "Kali Linux", "AWS", "Git", "Nginx", "PostgreSQL"],
  },
];

export function Skills() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".skills-heading", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.utils.toArray<HTMLElement>(".skill-group").forEach((group, i) => {
        gsap.from(group, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: group, start: "top 88%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="skills" ref={ref} className="relative py-32">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 80% 40%, oklch(0.15 0.05 280 / 25%) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="skills-heading mb-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-6 opacity-70" style={{ background: CYAN }} />
            <span
              className="text-xs uppercase tracking-[0.4em]"
              style={{ color: CYAN }}
            >
              Toolkit
            </span>
          </div>
          <h2 className="text-4xl font-bold leading-tight sm:text-6xl">
            Stack &amp; <span className="text-gradient">arsenal.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Tools, languages, and systems I use to research, build, and break things.
          </p>
        </div>

        {/* Category groups */}
        <div className="space-y-14">
          {groups.map((g) => (
            <div key={g.label} className="skill-group">
              {/* Category header */}
              <div className="mb-6 flex items-center gap-4">
                {/* Glowing accent dot */}
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{
                    background: g.accent,
                    boxShadow: `0 0 8px ${g.accent}, 0 0 16px ${g.accent}50`,
                  }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: g.accent }}
                >
                  {g.label}
                </span>
                {/* Thin separator line */}
                <div
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(90deg, ${g.accent}40, transparent)`,
                  }}
                />
              </div>

              {/* Skill tile grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {g.items.map((skill) => (
                  <SkillTile key={skill} skill={skill} accent={g.accent} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillTile({ skill, accent }: { skill: string; accent: string }) {
  return (
    <div
      className="skill-tile group relative flex cursor-default select-none flex-col items-start justify-between overflow-hidden rounded-xl px-4 py-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "oklch(0.11 0.03 260 / 70%)",
        border: `1px solid oklch(0.25 0.04 260 / 60%)`,
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${accent}60`;
        el.style.background = `oklch(0.13 0.04 260 / 80%)`;
        el.style.boxShadow = `0 0 18px ${accent}15, 0 4px 16px oklch(0.05 0.02 260 / 40%)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "oklch(0.25 0.04 260 / 60%)";
        el.style.background = "oklch(0.11 0.03 260 / 70%)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top accent line that glows on hover */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}70, transparent)`,
        }}
      />

      {/* Skill name */}
      <span
        className="text-sm font-medium leading-snug text-foreground transition-colors duration-200 group-hover:text-white"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {skill}
      </span>

      {/* Subtle bottom accent dot on hover */}
      <span
        className="mt-3 h-1 w-1 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: accent }}
      />
    </div>
  );
}