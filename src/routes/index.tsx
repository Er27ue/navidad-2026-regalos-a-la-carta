import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { Hero } from "@/components/intro/Hero";
import { ThankYou, Welcome } from "@/components/sections/Story";
import { Catalog, type Filter } from "@/components/cards/Catalog";
import { Marquee } from "@/components/decor/BrandExperience";
import { BottomBar, ContactSection, SelectionPanel, TopBar } from "@/components/layout/Navigation";
import { cards } from "@/data/cards";
import { useSelection } from "@/hooks/useSelection";
import { useOrder } from "@/hooks/useOrder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Tarjetas de Regalo Navidad 2026 · Yaritza Madera Creations" },
      { name: "description", content: "Descubre 104 tarjetas de regalo navideñas ilustradas por @yaritzamaderacreations." },
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
  const { selectedIds, toggle } = useSelection();
  const { quantities, setQuantity, remove, total } = useOrder();
  const orderItems = cards.filter((card) => quantities[card.id] > 0).map((card) => ({ card, quantity: quantities[card.id] }));

  return (
    <MotionConfig reducedMotion="user">
      <TopBar count={total} onSelection={() => setSelectionOpen(true)} />
      <main className="overflow-x-clip pb-20 pt-0 md:pb-0 md:pt-14">
        <Hero />
        <Welcome />
        <Marquee />
        <Catalog filter={filter} setFilter={setFilter} favoriteIds={selectedIds} onToggleFavorite={toggle} quantities={quantities} onQuantity={setQuantity} />
        <ContactSection items={orderItems} onQuantity={setQuantity} onRemove={remove} onSelection={() => setSelectionOpen(true)} />
        <ThankYou />
      </main>
      <BottomBar count={total} onSelection={() => setSelectionOpen(true)} />
      {selectionOpen && <SelectionPanel items={orderItems} onQuantity={setQuantity} onRemove={remove} onClose={() => setSelectionOpen(false)} />}
    </MotionConfig>
  );
}

