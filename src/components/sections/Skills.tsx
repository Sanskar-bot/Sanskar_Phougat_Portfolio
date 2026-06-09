import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const GREEN = "#00e5a0";

const groups = [
  {
    label: "Offensive Security",
    items: [
      "Burp Suite",
      "Metasploit",
      "Nmap",
      "Wireshark",
      "Ghidra",
      "radare2",
      "pwntools",
      "mitmproxy",
      "Hashcat",
    ],
  },
  {
    label: "Languages",
    items: ["Python", "C/C++", "Rust", "TypeScript", "Java", "Bash", "Assembly", "Solidity"],
  },
  {
    label: "Cryptography",
    items: ["AES-256-GCM", "RSA-2048", "Argon2id", "SHA-256", "zk-SNARKs", "TLS", "PKI", "WebCrypto"],
  },
  {
    label: "Frameworks & Backend",
    items: ["Flask", "Spring Boot", "React", "Node.js", "REST API", "ML Inference"],
  },
  {
    label: "Infra & DevOps",
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
          duration: 0.6,
          ease: "power3.out",
          delay: i * 0.07,
          scrollTrigger: { trigger: group, start: "top 90%" },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section id="skills" ref={ref} className="relative py-28">
      <div className="relative z-10 mx-auto max-w-6xl px-6">

        {/* ── Section header ─────────────────────────────────── */}
        <div className="skills-heading mb-14">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="text-xs font-semibold uppercase tracking-[0.35em]"
              style={{ color: GREEN }}
            >
              Toolkit
            </span>
            <span style={{ color: GREEN, fontSize: "10px" }}>✦</span>
          </div>
          <h2
            className="text-5xl font-bold leading-tight sm:text-6xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
          >
            Stack &amp; <span style={{ color: GREEN }}>arsenal.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: "oklch(0.65 0.03 220)" }}>
            Technologies, tools, and frameworks I use to build, secure,
            and ship impactful solutions.
          </p>
        </div>

        {/* ── Skill groups ───────────────────────────────────── */}
        <div className="space-y-10">
          {groups.map((g) => (
            <div key={g.label} className="skill-group">
              {/* Category label + separator */}
              <div className="mb-5 flex items-center gap-4">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.3em] whitespace-nowrap"
                  style={{ color: GREEN }}
                >
                  {g.label}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: "oklch(0.25 0.04 260 / 60%)" }}
                />
              </div>

              {/* Skill tiles */}
              <div className="flex flex-wrap gap-3">
                {g.items.map((skill) => (
                  <SkillTile key={skill} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function SkillTile({ skill }: { skill: string }) {
  return (
    <div
      className="group relative flex cursor-default select-none items-center justify-center rounded-xl px-6 py-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "oklch(0.11 0.03 260 / 70%)",
        border: "1px solid oklch(0.25 0.04 260 / 60%)",
        backdropFilter: "blur(8px)",
        minWidth: "100px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${GREEN}50`;
        el.style.background = "oklch(0.13 0.04 260 / 80%)";
        el.style.boxShadow = `0 0 16px ${GREEN}18, 0 4px 16px oklch(0.05 0.02 260 / 40%)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "oklch(0.25 0.04 260 / 60%)";
        el.style.background = "oklch(0.11 0.03 260 / 70%)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top shimmer on hover */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${GREEN}60, transparent)` }}
      />

      <span
        className="text-sm font-medium text-white"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {skill}
      </span>
    </div>
  );
}