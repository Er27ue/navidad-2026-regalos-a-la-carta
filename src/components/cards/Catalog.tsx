import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Heart, MessageCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cards, categories, type Card } from "@/data/cards";
import { EASE } from "../decor/Decor";
import { buildWhatsAppMessage, CATALOG_COPY, whatsappUrl } from "@/config/contact";

export type Filter = "todas" | "letras" | "personajes" | "frases" | "ilustraciones";
const filterOptions: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" }, { id: "letras", label: "Letras" },
  { id: "personajes", label: "Personajes" }, { id: "frases", label: "Frases" },
  { id: "ilustraciones", label: "Ilustraciones" },
];

function CategoryFilter({ value, onChange }: { value: Filter; onChange: (f: Filter) => void }) {
  return (
    <LayoutGroup>
      <div role="group" aria-label="Filtrar por categoría" className="category-filter">
        {filterOptions.map((o) => (
          <button type="button" key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)} className="category-chip">
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
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} whileHover={{ y: -3 }} className="group relative overflow-hidden rounded-2xl bg-card shadow-soft">
      <button type="button" onClick={onOpen} aria-label={`Ver tarjeta ${card.name} en grande`} className="flex w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine">
        <motion.div layoutId={`img-${card.id}`} className="aspect-[4/3] overflow-hidden bg-white">
          <img src={card.image} alt={card.name} width="640" height="480" loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]" />
        </motion.div>
        <div className="border-t border-border px-3 py-3 pr-14 sm:px-4">
          <p className="truncate text-sm font-medium text-ink">{card.name}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-olive">{categories.find((c) => c.id === card.category)?.label}</p>
        </div>
      </button>
      <button type="button" onClick={onToggleSelection} aria-pressed={selected} aria-label={selected ? `Quitar ${card.name} de Mi selección` : `Guardar ${card.name} en Mi selección`} className={`absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine ${selected ? "bg-wine text-white" : "bg-white/95 text-wine"}`}>
        <Heart aria-hidden className={`h-5 w-5 ${selected ? "fill-current favorite-bounce" : ""}`} />
      </button>
    </motion.article>
  );
}

function CardModal({ list, index, onClose, onMove, selectedIds, onToggleSelection }: { list: Card[]; index: number; onClose: () => void; onMove: (d: number) => void; selectedIds: string[]; onToggleSelection: (id: string) => void }) {
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
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 40, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-lift sm:max-h-[90svh] sm:max-w-lg sm:rounded-3xl sm:p-6"
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
            className="mx-auto max-h-[48svh] w-full object-contain sm:max-h-[60svh]"
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
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => onToggleSelection(card.id)} aria-pressed={selectedIds.includes(card.id)} className="min-h-12 rounded-full border border-wine/25 px-4 text-sm font-semibold text-wine">{selectedIds.includes(card.id) ? "Quitar guardada" : "Guardar tarjeta"}</button>
          <a href={whatsappUrl(buildWhatsAppMessage([card.name]))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-wine px-3 text-center text-xs font-semibold text-white sm:text-sm"><MessageCircle aria-hidden className="h-4 w-4" />Pedir por WhatsApp</a>
        </div>
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-ink">✕</button>
      </motion.div>
    </motion.div>
  );
}

export function Catalog({ filter, setFilter, selectedIds, onToggleSelection }: { filter: Filter; setFilter: (f: Filter) => void; selectedIds: string[]; onToggleSelection: (id: string) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const list = useMemo(() => {
    const categoryList = cards.filter((card) => {
      if (filter === "todas") return true;
      if (filter === "letras") return card.category === "iniciales";
      if (filter === "frases") return card.category === "frases";
      if (filter === "personajes") return ["santa", "gnomos", "animales"].includes(card.category);
      return !["iniciales", "frases", "santa", "gnomos", "animales"].includes(card.category);
    });
    const normalized = query.trim().toLocaleLowerCase();
    return categoryList.filter((card) => !normalized || card.name.toLocaleLowerCase().includes(normalized));
  }, [filter, query]);
  const visible = list.slice(0, visibleCount);
  return (
    <section id="catalogo" className="catalog-section">
      <div className="catalog-heading">
        <p className="eyebrow text-[10px] text-olive sm:text-xs">{cards.length} diseños para elegir</p>
        <h2 className="mt-1 font-script text-5xl text-wine sm:text-6xl md:text-7xl">{CATALOG_COPY.catalogHeading}</h2>
      </div>
      <div className="catalog-controls">
        <div className="category-scroll-hint"><CategoryFilter value={filter} onChange={(next) => { setFilter(next); setVisibleCount(12); }} /></div>
        <div className="catalog-tools">
        <label className="search-field">
          <Search aria-hidden className="h-4 w-4 text-olive" />
          <span className="sr-only">Buscar tarjetas por nombre</span>
          <input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(12); }} placeholder="Buscar un diseño" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
        </label>
        <p className="selection-status" aria-live="polite">{selectedIds.length ? `${selectedIds.length} ${selectedIds.length === 1 ? "diseño guardado" : "diseños guardados"}` : "Elige tus favoritos con el corazón"}</p>
        </div>
      </div>
      <motion.div layout className="mx-auto mt-4 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:mt-6 md:grid-cols-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {visible.map((c, i) => <GiftCard key={c.id} card={c} onOpen={() => setOpen(i)} selected={selectedIds.includes(c.id)} onToggleSelection={() => onToggleSelection(c.id)} />)}
        </AnimatePresence>
      </motion.div>
      {visibleCount < list.length && <div className="mt-10 text-center"><button onClick={() => setVisibleCount((count) => count + 12)} className="min-h-12 rounded-full border border-wine/30 px-7 text-sm font-semibold text-wine transition-colors hover:bg-wine hover:text-white">Ver más diseños</button></div>}
      <AnimatePresence>
        {open !== null && (
          <CardModal list={list} index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((o) => ((o ?? 0) + d + list.length) % list.length)} selectedIds={selectedIds} onToggleSelection={onToggleSelection} />
        )}
      </AnimatePresence>
    </section>
  );
}


