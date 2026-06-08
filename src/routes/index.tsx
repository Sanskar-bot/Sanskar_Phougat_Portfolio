import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanskar Phougat — Cybersecurity Researcher & Security Engineer" },
      { name: "description", content: "Portfolio of Sanskar Phougat — cybersecurity researcher, offensive security practitioner and builder of cryptographic systems." },
      { property: "og:title", content: "Sanskar Phougat — Cybersecurity Researcher" },
      { property: "og:description", content: "Offensive security, applied cryptography & threat research." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
