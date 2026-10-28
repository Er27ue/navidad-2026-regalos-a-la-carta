import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/intro/Hero";
import { ThankYou, Welcome } from "@/components/sections/Story";
import { Catalog, CategoryOverview, type Filter } from "@/components/cards/Catalog";
import { Marquee } from "@/components/decor/BrandExperience";
import { BottomBar, ContactSection, TopBar } from "@/components/layout/Navigation";
import { cards } from "@/data/cards";
import { useOrder } from "@/hooks/useOrder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo Tarjetas de Regalo Navidad 2026 · Yaritza Madera Creations" },
      {
        name: "description",
        content:
          "Descubre 104 tarjetas de regalo navideñas ilustradas por @yaritzamaderacreations.",
      },
      { property: "og:title", content: "Catálogo Tarjetas de Regalo Navidad 2026" },
      {
        property: "og:description",
        content: "Tarjetas navideñas ilustradas por Yaritza Madera para tus regalos y tu negocio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState<Filter>(() => {
    const requested =
      typeof window === "undefined"
        ? "todas"
        : new URLSearchParams(window.location.search).get("cat");
    return ["todas", "letras", "personajes", "frases", "ilustraciones"].includes(requested ?? "")
      ? (requested as Filter)
      : "todas";
  });
  const { quantities, setQuantity, remove, total, customerName, setCustomerName, notes, setNotes } =
    useOrder();
  const orderItems = useMemo(
    () =>
      cards.flatMap((card) => {
        const quantity = quantities[card.id] ?? 0;
        return quantity > 0 ? [{ card, quantity }] : [];
      }),
    [quantities],
  );
  const chooseCategory = (next: Filter) => {
    setFilter(next);
    const url = new URL(window.location.href);
    url.searchParams.set("cat", next);
    url.searchParams.delete("p");
    window.history.pushState({}, "", url);
    window.setTimeout(
      () => document.querySelector("#catalogo")?.scrollIntoView({ behavior: "smooth" }),
      40,
    );
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: true,
      autoRaf: true,
      respectReducedMotion: true,
    });
    return () => lenis.destroy();
  }, []);
  useEffect(() => {
    const onPop = () => {
      const value = new URLSearchParams(window.location.search).get("cat");
      if (["todas", "letras", "personajes", "frases", "ilustraciones"].includes(value ?? ""))
        setFilter(value as Filter);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      <TopBar count={total} />
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] pt-0 md:pb-0 md:pt-14">
        <Hero />
        <Welcome />
        <Catalog
          filter={filter}
          setFilter={setFilter}
          quantities={quantities}
          onQuantity={setQuantity}
        />
        <ContactSection
          items={orderItems}
          onQuantity={setQuantity}
          onRemove={remove}
          customerName={customerName}
          setCustomerName={setCustomerName}
          notes={notes}
          setNotes={setNotes}
        />
        <ThankYou />
      </main>
      <BottomBar count={total} />
    </MotionConfig>
  );
}

