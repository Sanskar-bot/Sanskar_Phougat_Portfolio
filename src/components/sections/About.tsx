import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".about-line", {
      y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 70%" },
    });
  }, { scope: ref });

  return (
    <section id="about" ref={ref} className="relative py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="about-line mb-8 text-xs uppercase tracking-[0.4em] text-primary">// 02 — Whoami</p>
        <h2 className="about-line text-4xl font-bold leading-tight sm:text-6xl">
          I break things so <span className="text-gradient">they don't break later.</span>
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-5 text-muted-foreground">
            <p className="about-line">I'm a pre-final year B.Tech ECE student at <span className="text-foreground">JIIT Noida</span>, focused on applied threat research, cryptography and offensive security.</p>
            <p className="about-line">Currently a Research Intern at <span className="text-foreground">CyberPeace Foundation</span>, where I investigate phishing infrastructure, malware artifacts and emerging attack vectors.</p>
            <p className="about-line">I build security primitives end-to-end — from zero-knowledge password managers to decentralized medical record systems — with a bias for cryptographic rigor.</p>
          </div>
          <div className="about-line space-y-4">
            <div className="glass rounded-2xl p-6"><p className="text-xs uppercase tracking-widest text-muted-foreground">Focus</p><p className="mt-2 font-semibold">Applied Threat Research · Cryptography · Offensive Security</p></div>
            <div className="glass rounded-2xl p-6"><p className="text-xs uppercase tracking-widest text-muted-foreground">Currently</p><p className="mt-2 font-semibold">Research Intern @ CyberPeace Foundation</p></div>
            <div className="glass rounded-2xl p-6"><p className="text-xs uppercase tracking-widest text-muted-foreground">Education</p><p className="mt-2 font-semibold">B.Tech ECE, JIIT Noida — Class of 2026</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}