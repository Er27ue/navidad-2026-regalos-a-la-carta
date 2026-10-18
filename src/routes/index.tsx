import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Hero } from "@/components/intro/Hero";
import { AboutYaritza, ThankYou, Welcome } from "@/components/sections/Story";
import { Catalog, StartChoice, type Filter } from "@/components/cards/Catalog";
import { BottomBar, ContactSection, SelectionPanel, TopBar } from "@/components/layout/Navigation";
import { cards } from "@/data/cards";
import { useSelection } from "@/hooks/useSelection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Tarjetas de Regalo Navidad 2026 · Yaritza Madera Creations" },
      { name: "description", content: "Descubre más de 100 tarjetas de regalo navideñas ilustradas por @yaritzamaderacreations." },
      { property: "og:title", content: "Catálogo Tarjetas de Regalo Navidad 2026" },
      { property: "og:description", content: "Tarjetas navideñas ilustradas por Yaritza Madera para tus regalos y tu negocio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState<Filter>("todas");
  const [selectionOpen, setSelectionOpen] = useState(false);
  const { selectedIds, toggle, remove } = useSelection();
  const selectedCards = cards.filter((card) => selectedIds.includes(card.id));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (a) { e.preventDefault(); lenis.scrollTo(a.getAttribute("href")!, { offset: -76 }); }
    };
    document.addEventListener("click", onClick);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => { cancelAnimationFrame(id); lenis.destroy(); document.removeEventListener("click", onClick); };
  }, []);

  const pick = (f: Filter) => {
    setFilter(f);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo("#catalogo", { offset: -76 });
    else document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <TopBar count={selectedIds.length} onSelection={() => setSelectionOpen(true)} />
      <main className="overflow-x-clip pb-20 pt-0 md:pb-0 md:pt-14">
        <Hero />
        <Welcome />
        <AboutYaritza />
        <StartChoice onPick={pick} />
        <Catalog filter={filter} setFilter={setFilter} selectedIds={selectedIds} onToggleSelection={toggle} />
        <ContactSection />
        <ThankYou />
      </main>
      <BottomBar count={selectedIds.length} onSelection={() => setSelectionOpen(true)} />
      {selectionOpen && <SelectionPanel cards={selectedCards} onRemove={remove} onClose={() => setSelectionOpen(false)} />}
    </MotionConfig>
  );
}
