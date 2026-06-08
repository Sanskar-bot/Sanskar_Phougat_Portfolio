const groups = [
  {
    label: "Offensive",
    icon: "⚔️",
    items: ["Burp Suite", "Metasploit", "Nmap", "Wireshark", "Ghidra", "radare2", "pwntools", "Hashcat"],
  },
  {
    label: "Languages",
    icon: "💻",
    items: ["Python", "C/C++", "Rust", "TypeScript", "Solidity", "Bash", "Assembly"],
  },
  {
    label: "Cryptography",
    icon: "🔐",
    items: ["AES-GCM", "Argon2id", "Curve25519", "zk-SNARKs", "TLS", "PKI", "WebCrypto"],
  },
  {
    label: "Infra",
    icon: "🛠️",
    items: ["Linux", "Docker", "Kali", "AWS", "Git", "Nginx", "PostgreSQL"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-primary">// 04 — Toolkit</p>
        <h2 className="text-4xl font-bold leading-tight sm:text-6xl">
          Stack &amp; <span className="text-gradient">arsenal.</span>
        </h2>

        <div className="mt-16 space-y-12">
          {groups.map((g) => (
            <div key={g.label}>
              {/* Category header */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-lg">{g.icon}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                  {g.label}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Tile grid */}
              <div className="flex flex-wrap gap-3">
                {g.items.map((skill) => (
                  <span
                    key={skill}
                    className="glass rounded-md px-3 py-1.5 text-xs font-medium text-foreground
                               border border-border hover:border-primary hover:text-primary
                               transition-colors duration-200 cursor-default select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}