import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

// Section IDs in document order
const SECTIONS = ["home", "about", "skills", "projects", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

/** Track which section is currently in view using IntersectionObserver */
function useActiveSection(): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the first intersecting entry (topmost in viewport)
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id as SectionId);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -20% 0px" }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return active;
}

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { location } = useRouterState();
  const isTimelinePage = location.pathname === "/timeline";
  const isStoryPage    = location.pathname === "/story";
  const isSubPage      = isTimelinePage || isStoryPage;

  // Only track active section on the homepage (not on sub-pages)
  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setModalOpen(document.body.style.overflow === "hidden");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const anchor = (hash: string) => (isSubPage ? `/${hash}` : hash);

  const navColor = (sectionId: string) => {
    if (isSubPage) return ""; // On sub-pages don't highlight anchor items
    return activeSection === sectionId ? "var(--primary)" : "";
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-6"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">

        {/* ── Logo area ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          {/* Theme toggle — leftmost */}
          <ThemeToggle />

          <Link to="/story" aria-label="Personal story">
            <motion.div
              className="relative flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden"
              style={{
                background: "var(--nav-logo-bg)",
                border: "1px solid color-mix(in oklch, var(--neon-cyan) 22%, transparent)",
              }}
              whileHover="hover"
              whileTap={{ scale: 0.93 }}
              initial="idle"
            >
              {/* Glow ring */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-lg"
                style={{
                  boxShadow: "0 0 18px color-mix(in oklch, var(--neon-cyan) 45%, transparent), inset 0 0 12px color-mix(in oklch, var(--neon-cyan) 15%, transparent)",
                }}
                variants={{ idle: { opacity: 0 }, hover: { opacity: 1 } }}
                transition={{ duration: 0.25 }}
              />
              {/* Scan-line sweep */}
              <motion.div
                className="pointer-events-none absolute left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, color-mix(in oklch, var(--neon-cyan) 70%, transparent), transparent)",
                  top: "50%",
                }}
                variants={{ idle: { scaleX: 0, opacity: 0 }, hover: { scaleX: 1, opacity: 1 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklch, var(--neon-cyan) 55%, transparent), transparent)" }}
              />
              {/* Home icon */}
              <motion.div
                variants={{
                  idle:  { color: "var(--muted-foreground)", filter: "drop-shadow(0 0 0px transparent)" },
                  hover: { color: "var(--neon-cyan)",        filter: "drop-shadow(0 0 6px var(--neon-cyan))" },
                }}
                transition={{ duration: 0.2 }}
              >
                <Home className="h-4 w-4 relative z-10" />
              </motion.div>
              {/* Corner brackets */}
              <span className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l rounded-tl-sm" style={{ borderColor: "color-mix(in oklch, var(--neon-cyan) 35%, transparent)" }} />
              <span className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r rounded-br-sm" style={{ borderColor: "color-mix(in oklch, var(--neon-cyan) 35%, transparent)" }} />
            </motion.div>
          </Link>

          {/* Site name */}
          <a
            href={anchor("#home")}
            className="hidden sm:inline text-sm font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            _sanskar.phougat
          </a>
        </div>

        {/* ── Desktop nav (centred) ─────────────────────────────────────── */}
        <ul className="hidden gap-6 text-xs uppercase tracking-widest md:flex absolute left-1/2 -translate-x-1/2">
          {[
            { label: "Home",     hash: "#home",     id: "home"     },
            { label: "About",    hash: "#about",    id: "about"    },
            { label: "Skills",   hash: "#skills",   id: "skills"   },
            { label: "Projects", hash: "#projects", id: "projects" },
            { label: "Contact",  hash: "#contact",  id: "contact"  },
          ].map(({ label, hash, id }) => {
            const isActive = !isSubPage && activeSection === id;
            return (
              <li key={label} className="relative">
                <a
                  href={anchor(hash)}
                  className="transition-colors duration-200 hover:text-primary"
                  style={{ color: isActive ? "var(--primary)" : "" }}
                >
                  {label}
                  {/* Active underline dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                      style={{ background: "var(--primary)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}

          <li className="relative">
            <Link
              to="/timeline"
              className="transition-colors hover:text-primary"
              style={{ color: isTimelinePage ? "var(--primary)" : "" }}
              activeProps={{ style: { color: "var(--primary)" } }}
            >
              Timeline
              {isTimelinePage && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                  style={{ background: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </li>

          <li className="relative">
            <Link
              to="/story"
              className="transition-colors hover:text-primary"
              style={{ color: isStoryPage ? "var(--primary)" : "" }}
              activeProps={{ style: { color: "var(--primary)" } }}
            >
              Story
              {isStoryPage && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full"
                  style={{ background: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </li>
        </ul>

        {/* ── Desktop CTAs ──────────────────────────────────────────────── */}
        <div className={`hidden md:flex items-center gap-3 transition-opacity duration-200 ${
          modalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          <a
            href="/resume.pdf"
            download="Sanskar_Phougat_Resume.pdf"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-widest neon-border text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-semibold"
          >
            Resume
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
              <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75v6.69l1.97-1.97a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.53a.75.75 0 0 1 1.06-1.06l1.97 1.97V1.75A.75.75 0 0 1 8 1ZM2.75 13a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H2.75Z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href={anchor("#contact")}
            className="rounded-full px-4 py-2 text-xs uppercase tracking-widest neon-border text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 font-semibold"
          >
            Get in touch
          </a>
        </div>

        {/* ── Mobile hamburger ──────────────────────────────────────────── */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {[
            mobileOpen ? "rotate-45 translate-y-2" : "",
            mobileOpen ? "opacity-0" : "",
            mobileOpen ? "-rotate-45 -translate-y-2" : "",
          ].map((cls, i) => (
            <span
              key={i}
              className={`block h-px w-5 transition-all duration-200 ${cls}`}
              style={{ background: "var(--neon-cyan)" }}
            />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "var(--nav-mobile-bg)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid var(--nav-mobile-border)",
            }}
          >
            <div className="px-6 py-4 space-y-3">
              {/* Theme toggle row */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <ThemeToggle />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Theme</span>
              </div>

              {[
                { label: "Home",     hash: "#home",     id: "home"     },
                { label: "About",    hash: "#about",    id: "about"    },
                { label: "Skills",   hash: "#skills",   id: "skills"   },
                { label: "Projects", hash: "#projects", id: "projects" },
                { label: "Contact",  hash: "#contact",  id: "contact"  },
              ].map(({ label, hash, id }) => {
                const isActive = !isSubPage && activeSection === id;
                return (
                  <a
                    key={label}
                    href={anchor(hash)}
                    className="block text-sm font-semibold uppercase tracking-widest transition-colors"
                    style={{ color: isActive ? "var(--primary)" : "" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </a>
                );
              })}

              <Link
                to="/timeline"
                className="block text-sm font-semibold uppercase tracking-widest transition-colors"
                style={{ color: isTimelinePage ? "var(--primary)" : "" }}
                onClick={() => setMobileOpen(false)}
              >
                Timeline
              </Link>
              <Link
                to="/story"
                className="block text-sm font-semibold uppercase tracking-widest transition-colors"
                style={{ color: isStoryPage ? "var(--primary)" : "" }}
                onClick={() => setMobileOpen(false)}
              >
                Story
              </Link>

              <a
                href="/resume.pdf"
                download="Sanskar_Phougat_Resume.pdf"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Resume ↓
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}