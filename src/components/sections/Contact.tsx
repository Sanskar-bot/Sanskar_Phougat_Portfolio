import { FiGithub, FiLinkedin, FiMail, FiTarget } from "react-icons/fi";

const socials = [
  { icon: FiMail, label: "Email", value: "sanskarphougat2004@gmail.com", href: "https://mail.google.com/mail/?view=cm&to=sanskarphougat2004@gmail.com" },
  { icon: FiLinkedin, label: "LinkedIn", value: "sanskar-phougat", href: "https://linkedin.com/in/sanskar-phougat" },
  { icon: FiGithub, label: "GitHub", value: "Sanskar-bot", href: "https://github.com/Sanskar-bot" },
  { icon: FiTarget, label: "TryHackMe", value: "Sanskar2003", href: "https://tryhackme.com/p/Sanskar2003" },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-primary">// 05 — Handshake</p>
        <h2 className="text-5xl font-bold leading-tight sm:text-7xl">Let's <span className="text-gradient">connect.</span></h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">Open to security research collaborations, internships and freelance offensive engagements. The fastest way to reach me is email.</p>

        <a href="https://mail.google.com/mail/?view=cm&to=sanskarphougat2004@gmail.com" target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-primary px-10 py-5 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105" style={{ boxShadow: "var(--shadow-neon)" }}>
          sanskarphougat2004@gmail.com →
        </a>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group glass flex flex-col items-start gap-3 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:border-primary" data-cursor="hover">
              <s.icon className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="mt-1 truncate font-semibold">{s.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <footer className="mt-32 border-t border-border py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs uppercase tracking-widest text-muted-foreground sm:flex-row">
          <p>© 2026 Sanskar Phougat</p>
          <p>Built with React · Three.js · GSAP</p>
        </div>
      </footer>
    </section>
  );
}