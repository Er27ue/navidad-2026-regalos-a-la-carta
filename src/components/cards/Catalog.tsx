import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Heart, Search } from "lucide-react";
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

function GiftCard({ card, onOpen, selected, onToggleSelection }: { card: Card; onOpen: () => void; selected: boolean; onToggleSelection: () => void }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-2xl bg-card shadow-soft">
      <button type="button" onClick={onOpen} aria-label={`Ver tarjeta ${card.name} en grande`} className="flex w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine">
        <motion.div layoutId={`img-${card.id}`} className="aspect-[4/3] overflow-hidden bg-white">
          <img src={card.image} alt={card.name} loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]" />
        </motion.div>
        <div className="border-t border-border px-3 py-3 pr-14 sm:px-4">
          <p className="truncate text-sm font-medium text-ink">{card.name}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-olive">{categories.find((c) => c.id === card.category)?.label}</p>
        </div>
      </button>
      <button type="button" onClick={onToggleSelection} aria-pressed={selected} aria-label={selected ? `Quitar ${card.name} de Mi selección` : `Guardar ${card.name} en Mi selección`} className={`absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine ${selected ? "bg-wine text-white" : "bg-white/95 text-wine"}`}>
        <Heart aria-hidden className={`h-5 w-5 ${selected ? "fill-current" : ""}`} />
      </button>
    </motion.article>
  );
}

function CardModal({ list, index, onClose, onMove }: { list: Card[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const card = list[index] ?? list[0]!;
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

export function Catalog({ filter, setFilter, selectedIds, onToggleSelection }: { filter: Filter; setFilter: (f: Filter) => void; selectedIds: string[]; onToggleSelection: (id: string) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const list = useMemo(() => {
    const categoryList = filter === "todas" ? cards : cards.filter((c) => c.category === filter);
    const normalized = query.trim().toLocaleLowerCase();
    return normalized ? categoryList.filter((c) => c.name.toLocaleLowerCase().includes(normalized)) : categoryList;
  }, [filter, query]);
  const visible = list.slice(0, visibleCount);
  return (
    <section id="catalogo" className="relative bg-[#fffefa] px-4 py-20 md:px-8 md:py-24">
      <div className="text-center">
        <p className="eyebrow text-xs text-olive">Mostrando {visible.length} de {list.length} diseños</p>
        <h2 className="mt-2 font-script text-6xl text-wine md:text-7xl">Nuestras tarjetas</h2>
        <Sparkle className="mx-auto mt-4 w-6" />
      </div>
      <div className="sticky top-0 z-20 mx-auto mt-8 max-w-7xl bg-[#fffefa]/95 py-3 backdrop-blur-md md:top-14">
        <div className="mx-auto max-w-5xl"><CategoryFilter value={filter} onChange={(next) => { setFilter(next); setVisibleCount(12); }} /></div>
        <label className="mx-auto mt-3 flex min-h-12 max-w-md items-center gap-3 rounded-full border border-wine/15 bg-white px-4 text-sm text-ink shadow-sm">
          <Search aria-hidden className="h-4 w-4 text-olive" />
          <span className="sr-only">Buscar tarjetas por nombre</span>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(12); }} placeholder="Buscar diseño por nombre" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
        </label>
      </div>
      <motion.div layout className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {visible.map((c, i) => <GiftCard key={c.id} card={c} onOpen={() => setOpen(i)} selected={selectedIds.includes(c.id)} onToggleSelection={() => onToggleSelection(c.id)} />)}
        </AnimatePresence>
      </motion.div>
      {visibleCount < list.length && <div className="mt-10 text-center"><button onClick={() => setVisibleCount((count) => count + 12)} className="min-h-12 rounded-full border border-wine/30 px-7 text-sm font-semibold text-wine transition-colors hover:bg-wine hover:text-white">Ver más diseños</button></div>}
      <AnimatePresence>
        {open !== null && (
          <CardModal list={list} index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((o) => ((o ?? 0) + d + list.length) % list.length)} />
        )}
      </AnimatePresence>
    </section>
  );
}

export type { Filter };
