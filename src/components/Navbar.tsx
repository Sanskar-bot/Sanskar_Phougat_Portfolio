import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";

const CYAN = "oklch(0.82 0.18 170)";

export function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { location } = useRouterState();
  const isTimelinePage = location.pathname === "/timeline";
  const isStoryPage    = location.pathname === "/story";
  // On any sub-page, anchor links need the /#hash prefix to go back to home
  const isSubPage = isTimelinePage || isStoryPage;

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

  // Helper: build anchor href, prefixing "/" on sub-pages
  const anchor = (hash: string) => (isSubPage ? `/${hash}` : hash);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-6"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">

        {/* ── Logo: cyberpunk Home icon → /story ─────────────────────────── */}
        <div className="flex items-center gap-2.5">
          <Link to="/story" aria-label="Personal story">
            <motion.div
              className="relative flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden"
              style={{
                background: "oklch(0.10 0.03 260)",
                border: `1px solid ${CYAN}35`,
              }}
              whileHover="hover"
              whileTap={{ scale: 0.93 }}
              initial="idle"
            >
              {/* Idle glow ring */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-lg"
                variants={{
                  idle: { boxShadow: `0 0 0px ${CYAN}00`, opacity: 0 },
                  hover: { boxShadow: `0 0 18px ${CYAN}50, inset 0 0 12px ${CYAN}18`, opacity: 1 },
                }}
                transition={{ duration: 0.25 }}
              />

              {/* Scan-line sweep on hover */}
              <motion.div
                className="pointer-events-none absolute left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${CYAN}80, transparent)`, top: "50%" }}
                variants={{
                  idle: { scaleX: 0, opacity: 0 },
                  hover: { scaleX: 1, opacity: 1 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${CYAN}60, transparent)` }}
              />

              {/* Home icon */}
              <motion.div
                variants={{
                  idle: { color: `${CYAN}80`, filter: "drop-shadow(0 0 0px transparent)" },
                  hover: { color: CYAN,        filter: `drop-shadow(0 0 6px ${CYAN})` },
                }}
                transition={{ duration: 0.2 }}
              >
                <Home className="h-4 w-4 relative z-10" />
              </motion.div>

              {/* Corner bracket decorations */}
              <span className="pointer-events-none absolute top-1 left-1 h-2 w-2 border-t border-l rounded-tl-sm" style={{ borderColor: `${CYAN}50` }} />
              <span className="pointer-events-none absolute bottom-1 right-1 h-2 w-2 border-b border-r rounded-br-sm" style={{ borderColor: `${CYAN}50` }} />
            </motion.div>
          </Link>

          {/* _sanskar.phougat — links back to home */}
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
            { label: "Home",     hash: "#home"     },
            { label: "About",    hash: "#about"    },
            { label: "Projects", hash: "#projects" },
            { label: "Skills",   hash: "#skills"   },
            { label: "Contact",  hash: "#contact"  },
          ].map(({ label, hash }) => (
            <li key={label}>
              <a
                href={anchor(hash)}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </a>
            </li>
          ))}

          {/* /timeline — router Link */}
          <li>
            <Link
              to="/timeline"
              className="transition-colors hover:text-primary"
              style={{ color: isTimelinePage ? CYAN : "" }}
              activeProps={{ style: { color: CYAN } }}
            >
              Timeline
            </Link>
          </li>

          {/* /story — router Link */}
          <li>
            <Link
              to="/story"
              className="transition-colors hover:text-primary"
              style={{ color: isStoryPage ? "oklch(0.7 0.22 320)" : "" }}
              activeProps={{ style: { color: "oklch(0.7 0.22 320)" } }}
            >
              Story
            </Link>
          </li>
        </ul>

        {/* ── Desktop CTA ───────────────────────────────────────────────── */}
        <a
          href={anchor("#contact")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest neon-border text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 md:inline-block hidden ${
            modalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          Get in touch
        </a>

        {/* ── Mobile hamburger ──────────────────────────────────────────── */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span
            className={`block h-px w-5 transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            style={{ background: CYAN }}
          />
          <span
            className={`block h-px w-5 transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
            style={{ background: CYAN }}
          />
          <span
            className={`block h-px w-5 transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            style={{ background: CYAN }}
          />
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
              background: "oklch(0.09 0.025 260 / 96%)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid oklch(0.25 0.04 260 / 50%)",
            }}
          >
            <div className="px-6 py-4 space-y-3">
              {/* Anchor links */}
              {[
                { label: "Home",     hash: "#home"     },
                { label: "About",    hash: "#about"    },
                { label: "Projects", hash: "#projects" },
                { label: "Skills",   hash: "#skills"   },
                { label: "Contact",  hash: "#contact"  },
              ].map(({ label, hash }) => (
                <a
                  key={label}
                  href={anchor(hash)}
                  className="block text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </a>
              ))}

              {/* Router links */}
              <Link
                to="/timeline"
                className="block text-sm font-semibold uppercase tracking-widest transition-colors hover:text-primary"
                style={{ color: isTimelinePage ? CYAN : "" }}
                onClick={() => setMobileOpen(false)}
              >
                Timeline
              </Link>
              <Link
                to="/story"
                className="block text-sm font-semibold uppercase tracking-widest transition-colors hover:text-primary"
                style={{ color: isStoryPage ? "oklch(0.7 0.22 320)" : "" }}
                onClick={() => setMobileOpen(false)}
              >
                Story
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}