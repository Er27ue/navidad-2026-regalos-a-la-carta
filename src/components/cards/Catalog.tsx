import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cards, categories, type Card, type CategoryId } from "@/data/cards";
import { EASE, Sparkle } from "../decor/Decor";

type Filter = CategoryId | "todas";

export function StartChoice({ onPick }: { onPick: (c: Filter) => void }) {
  return (
    <section id="eleccion" className="relative px-6 py-28">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
        className="text-center font-script text-6xl leading-tight text-wine md:text-7xl"
      >
        Empecemos con tu elección:
      </motion.h2>
      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-5 md:grid-cols-5">
        {categories.map((c, i) => (
          <motion.button
            key={c.id}
            onClick={() => onPick(c.id)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.09 }}
            whileHover={{ y: -8, transition: { type: "spring", stiffness: 120, damping: 20 } }}
            className="group overflow-hidden rounded-3xl bg-card text-left shadow-soft"
          >
            <div className="aspect-square overflow-hidden bg-card">
              <img src={c.cover} alt="" loading="lazy" className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="px-5 pb-5 pt-2">
              <p className="font-script text-3xl text-wine">{c.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.blurb}</p>
            </div>
          </motion.button>
        ))}
      </div>
      <div className="mt-10 text-center">
        <button onClick={() => onPick("todas")} className="eyebrow text-xs text-olive underline-offset-8 hover:underline">
          Ver todas las tarjetas
        </button>
      </div>
    </section>
  );
}

function CategoryFilter({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  const opts: { id: Filter; label: string }[] = [{ id: "todas", label: "Todas" }, ...categories.map((c) => ({ id: c.id, label: c.label }))];
  return (
    <LayoutGroup>
      <div className="flex flex-wrap justify-center gap-2">
        {opts.map((o) => (
          <button key={o.id} onClick={() => onChange(o.id)} className="relative rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em]">
            {value === o.id && (
              <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 260, damping: 28 }} />
            )}
            <span className={`relative ${value === o.id ? "text-primary-foreground" : "text-ink"}`}>{o.label}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  );
}

function GiftCard({ card, onOpen }: { card: Card; onOpen: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      whileHover={{ y: -6, rotate: -1 }}
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card text-left shadow-soft"
    >
      <motion.div layoutId={`img-${card.id}`} className="aspect-[4/5] overflow-hidden">
        <img src={card.image} alt={card.name} loading="lazy" className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
      </motion.div>
      <div className="border-t border-border px-4 py-3">
        <p className="truncate text-sm font-medium text-ink">{card.name}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-olive">{categories.find((c) => c.id === card.category)?.label}</p>
      </div>
    </motion.button>
  );
}

function CardModal({ list, index, onClose, onMove }: { list: Card[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const card = list[index];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onMove]);
  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 40, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative w-full max-w-lg rounded-3xl bg-card p-6 shadow-lift"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={card.id}
            src={card.image}
            alt={card.name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mx-auto max-h-[60vh] w-full object-contain"
          />
        </AnimatePresence>
        <div className="mt-5 flex items-center justify-between gap-4">
          <button onClick={() => onMove(-1)} aria-label="Anterior" className="rounded-full border border-border px-4 py-2 text-wine hover:bg-muted">←</button>
          <div className="text-center">
            <p className="font-script text-3xl text-wine">{card.name}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-olive">{index + 1} / {list.length}</p>
          </div>
          <button onClick={() => onMove(1)} aria-label="Siguiente" className="rounded-full border border-border px-4 py-2 text-wine hover:bg-muted">→</button>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 h-9 w-9 rounded-full bg-muted text-ink">✕</button>
      </motion.div>
    </motion.div>
  );
}

export function Catalog({ filter, setFilter }: { filter: Filter; setFilter: (f: Filter) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => (filter === "todas" ? cards : cards.filter((c) => c.category === filter)), [filter]);
  return (
    <section id="catalogo" className="relative px-4 py-24 md:px-8">
      <div className="text-center">
        <p className="eyebrow text-xs text-olive">{list.length} diseños</p>
        <h2 className="mt-2 font-script text-6xl text-wine md:text-7xl">Nuestras tarjetas</h2>
        <Sparkle className="mx-auto mt-4 w-6" />
      </div>
      <div className="mx-auto mt-10 max-w-5xl"><CategoryFilter value={filter} onChange={setFilter} /></div>
      <motion.div layout className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {list.map((c, i) => <GiftCard key={c.id} card={c} onOpen={() => setOpen(i)} />)}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {open !== null && (
          <CardModal list={list} index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((o) => ((o ?? 0) + d + list.length) % list.length)} />
        )}
      </AnimatePresence>
    </section>
  );
}

export type { Filter };
