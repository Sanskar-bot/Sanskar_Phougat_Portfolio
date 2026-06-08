# Portfolio Overview — Sanskar Phougat

A single-page cybersecurity portfolio built with **TanStack Start (React 19) + Vite**, styled with **Tailwind CSS v4**, and animated with **Three.js / React Three Fiber** + **GSAP**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (file-based routing, SSR-capable) |
| UI Library | React 19 |
| Bundler | Vite 7 |
| Styling | Tailwind CSS v4 (OKLCH design tokens) |
| 3D Graphics | Three.js + @react-three/fiber + @react-three/drei |
| Animations | GSAP 3 + ScrollTrigger + @gsap/react |
| UI Primitives | shadcn/ui (Radix UI) — full component library installed |
| Icons | react-icons (FI set), lucide-react |
| Forms | react-hook-form + zod |
| Data Fetching | @tanstack/react-query |
| Type Safety | TypeScript 5.8 |
| Fonts | Space Grotesk (headings) · JetBrains Mono (body) |

---

## Page Structure

The single `/` route composes **5 sections** in order:

```
<Navbar />        ← fixed header, scroll-aware glass effect
<Hero />          ← full-screen landing + 3D globe canvas
<About />         ← bio, current role, education
<Projects />      ← 4 project cards with GSAP scroll animations
<Skills />        ← tool/language skill chips grouped by category
<Contact />       ← social links grid + footer
```

---

## Components Deep-Dive

### 🌐 HeroScene (Three.js Globe) — [HeroScene.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/HeroScene.tsx)

The most technically impressive piece. A fully custom WebGL globe built from scratch:

| Feature | Detail |
|---|---|
| Globe mesh | `IcosahedronGeometry` wireframe at LOD 4 |
| Network nodes | 25 real-world city lat/lon positions → instanced `sphereGeometry` mesh |
| Connection arcs | Quadratic Bézier curves between nearest 3 nodes per city, vertex-colored cyan |
| Data packets | 40 animated dots travelling along arcs in real-time |
| Equator ring | Pulsing `ringGeometry` with additive blending |
| Star field | 600 points on a sphere shell, slowly counter-rotating |
| Horizon glow | Flat ellipse below globe with additive blend, breathing opacity |
| Mouse reactivity | Cursor speed tracked → modulates arc opacity, glow intensity, and tilt |
| Lighting | 3-point setup: blue key, purple rim, top fill |

> [!NOTE]
> The globe currently lives only in HeroScene.tsx but is **not yet rendered** — it is exported but not imported in [Hero.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/sections/Hero.tsx). The Hero section uses a CSS `grid-bg` background instead.

---

### 🏠 Hero — [Hero.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/sections/Hero.tsx)

- Full-viewport section with a CSS dot-grid background (`grid-bg` utility)
- Radial gradient overlay for depth
- Name headline with gradient text
- One-line bio: "Cybersecurity researcher & security engineer..."
- Two CTA buttons: **View work →** (primary, neon shadow) and **Contact** (outlined neon border)
- 4-stat grid: Top 15% TryHackMe · 3+ tools shipped · CyberPeace intern · JIIT B.Tech '26
- Animated "scroll ↓" pulse indicator at the bottom

---

### 👤 About — [About.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/sections/About.tsx)

- GSAP `ScrollTrigger` staggered reveal for each paragraph (`about-line` class)
- Two-column layout:
  - **Left**: 3 bio paragraphs (JIIT, CyberPeace Foundation, zero-knowledge work)
  - **Right**: 3 glassmorphism info cards — Focus / Currently / Education

---

### 🛠 Projects — [Projects.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/sections/Projects.tsx)

4 project cards in a 2-column responsive grid, each animated in on scroll:

| # | Project | Category | Stack |
|---|---|---|---|
| 01 | **PhishingCheck4U** | Real-time Phishing Detection | Python, ML, REST API, PostgreSQL |
| 02 | **SecureHealth** | Encrypted Medical Records | Flask, AES-256-GCM, RSA-2048, PostgreSQL |
| 03 | **E2E Attack Lab** | MITM Research & Demo | Python, mitmproxy, Wireshark, Flask |
| 04 | **TaskFlow API** | Production-Grade REST API | Java, Spring Boot, PostgreSQL, JUnit 5 |

Cards feature: hover lift + background gradient bloom, external link arrow icon, stack tags.

---

### ⚔️ Skills — [Skills.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/sections/Skills.tsx)

Flat tile layout grouped into 4 categories:

| Category | Tools |
|---|---|
| ⚔️ Offensive | Burp Suite, Metasploit, Nmap, Wireshark, Ghidra, radare2, pwntools, Hashcat |
| 💻 Languages | Python, C/C++, Rust, TypeScript, Solidity, Bash, Assembly |
| 🔐 Cryptography | AES-GCM, Argon2id, Curve25519, zk-SNARKs, TLS, PKI, WebCrypto |
| 🛠️ Infra | Linux, Docker, Kali, AWS, Git, Nginx, PostgreSQL |

---

### 📬 Contact — [Contact.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/sections/Contact.tsx)

- Centred section with CTA heading "Let's connect."
- Primary email CTA button (neon glow)
- 4-card social grid: Email · LinkedIn · GitHub · TryHackMe
- Footer: "© 2026 Sanskar Phougat · Built with React · Three.js · GSAP"

---

### 🧭 Navbar — [Navbar.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/Navbar.tsx)

- Fixed at top, transparent at rest
- Scrolls >30px → glass blur backdrop kicks in
- Logo: `[SP]` gradient text + `_sanskar.phougat` monospace tag
- Nav links: Home / About / Projects / Skills / Contact
- Right CTA button: "Get in touch" (neon border)

---

### 🖱 CustomCursor — [CustomCursor.tsx](file:///s:/Personal%20Projects/Portfolio/src/components/CustomCursor.tsx)

- Custom 8px dot cursor injected directly into `<body>` (outside React tree)
- Follows mouse via `requestAnimationFrame` for zero-lag rendering
- `mix-blend-mode: difference` for colour inversion effect
- Native cursor hidden via `cursor: none` in global CSS

---

## Design System — [styles.css](file:///s:/Personal Projects/Portfolio/src/styles.css)

All colors defined in **OKLCH** for perceptual uniformity:

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.08 0.02 260)` | Deep navy-black page background |
| `--primary` | `oklch(0.82 0.18 170)` | Neon cyan-green accent |
| `--accent` | `oklch(0.7 0.22 320)` | Neon magenta secondary |
| `--gradient-hero` | cyan → magenta 135° | Text gradient, card glows |
| `--shadow-neon` | 30px+60px cyan/magenta bloom | CTA button shadow |

**Custom utility classes:**
- `.text-gradient` — gradient text clip
- `.neon-border` — glowing 1px border
- `.glass` — `backdrop-filter: blur(12px)` + translucent bg
- `.grid-bg` — subtle dot-grid background pattern

**Animations defined:** `float` (hover bob) · `glitch` (text corruption effect)

---

## What's Done ✅

- [x] Full design system with cyber/hacker dark palette
- [x] Navbar with scroll-aware glass effect
- [x] Hero section with stats, CTAs, and grid background
- [x] About section with GSAP scroll-reveal stagger animations
- [x] Projects section with 4 real projects, scroll-in animations, external links
- [x] Skills section with 4 skill categories (26 tools listed)
- [x] Contact section with 4 social links and footer
- [x] Custom cursor with mix-blend-mode difference
- [x] Full 3D globe component (HeroScene) with cursor reactivity, data packets, star field
- [x] SEO meta tags (title, description, OG tags)
- [x] 404 and error boundary pages

---

## What's Pending / Could Be Improved ⚠️

> [!IMPORTANT]
> **HeroScene globe is built but not wired into Hero.tsx.** The `<HeroScene />` component is ready and exported but Hero.tsx doesn't import it. Adding it would dramatically elevate the visual impact.

> [!TIP]
> **Potential next steps:**
> - Wire `<HeroScene />` into `<Hero />` (half-screen right side split layout)
> - Add a **Daily Learnings / Timeline** section pulling from the `portfolio-data` JSON pipeline (from the previous conversation)
> - Add mobile hamburger menu to Navbar (currently hidden on mobile)
> - Add `float` and `glitch` animation keyframes (defined in CSS but not used anywhere yet)
> - Resume/CV download button in Hero CTAs
> - Add `<Suspense>` fallback loader for the 3D canvas
> - Populate `__root.tsx` with actual meta (still has "Lovable App" placeholder)
