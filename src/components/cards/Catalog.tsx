import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Heart, MessageCircle, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cards, categories, type Card } from "@/data/cards";
import { EASE } from "../decor/Decor";
import { createOrderCode, buildOrderMessage, CATALOG_COPY, whatsappUrl } from "@/config/contact";

export type Filter = "todas" | "letras" | "personajes" | "frases" | "ilustraciones";
const filterOptions: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" }, { id: "letras", label: "Letras" },
  { id: "personajes", label: "Personajes" }, { id: "frases", label: "Frases" },
  { id: "ilustraciones", label: "Ilustraciones" },
];
const matchesFilter = (card: Card, filter: Filter) => {
  if (filter === "todas") return true;
  if (filter === "letras") return card.category === "iniciales";
  if (filter === "frases") return card.category === "frases";
  if (filter === "personajes") return ["santa", "gnomos", "animales"].includes(card.category);
  return ["nacimiento", "florales", "puertas", "detalles"].includes(card.category);
};

function CategoryFilter({ value, onChange, counts }: { value: Filter; onChange: (f: Filter) => void; counts: Record<Filter, number> }) {
  return <LayoutGroup><div role="group" aria-label="Filtrar por categoría" className="category-filter">
    {filterOptions.map((o) => <button type="button" key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)} className="category-chip">
      {value === o.id && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-wine" transition={{ type: "spring", stiffness: 260, damping: 28 }} />}
      <span className={`relative ${value === o.id ? "text-primary-foreground" : "text-ink"}`}>{o.label} ({counts[o.id]})</span>
    </button>)}
  </div></LayoutGroup>;
}

function GiftCard({ card, favorite, quantity, onOpen, onToggleFavorite, onQuantity }: { card: Card; favorite: boolean; quantity: number; onOpen: () => void; onToggleFavorite: () => void; onQuantity: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(quantity || 1);
  const showPicker = () => { setDraft(quantity || 1); setOpen((value) => !value); };
  return <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.32, ease: EASE }} whileHover={{ y: -3 }} className="gift-card group relative overflow-visible rounded-2xl bg-card shadow-soft">
    <button type="button" onClick={onOpen} aria-label={`Ver tarjeta ${card.name} en grande`} className="flex w-full flex-col overflow-hidden rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine">
      <motion.div layoutId={`img-${card.id}`} className="aspect-[4/3] overflow-hidden bg-white">
        <img src={card.image} alt={card.name} width="640" height="480" loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]" />
      </motion.div>
      <div className="w-full border-t border-border px-3 py-3 sm:px-4">
        <p className="truncate text-sm font-medium text-ink">{card.name}</p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-olive">{categories.find((c) => c.id === card.category)?.label}</p>
      </div>
    </button>
    <div className="card-order-actions">
      <button type="button" onClick={onToggleFavorite} aria-pressed={favorite} aria-label={favorite ? `Quitar ${card.name} de favoritos` : `Guardar ${card.name} en favoritos`} className={`favorite-button ${favorite ? "is-favorite" : ""}`}><Heart aria-hidden className={favorite ? "fill-current favorite-bounce" : ""} size={19} /></button>
      <button type="button" onClick={showPicker} aria-expanded={open} aria-label={`Añadir ${card.name} al pedido`} className="add-order-button"><Plus aria-hidden size={19} />{quantity > 0 && <span>{quantity}</span>}</button>
    </div>
    {open && <div className="quantity-picker" role="group" aria-label={`Cantidad de ${card.name}`}>
      <p>Unidades de esta tarjeta</p>
      <div className="quantity-quick">{[1,5,10,15,20].map((n) => <button key={n} type="button" onClick={() => { onQuantity(n); setOpen(false); }}>{n}</button>)}</div>
      <div className="quantity-custom"><button type="button" aria-label="Restar una" onClick={() => setDraft((n) => Math.max(1,n-1))}>−</button><output aria-live="polite">{draft}</output><button type="button" aria-label="Sumar una" onClick={() => setDraft((n) => n+1)}>+</button><button type="button" className="quantity-apply" onClick={() => { onQuantity(draft); setOpen(false); }}>Añadir</button></div>
    </div>}
  </motion.article>;
}

function CardModal({ list, index, onClose, onMove, favoriteIds, onToggleFavorite, onQuantity }: { list: Card[]; index: number; onClose: () => void; onMove: (d: number) => void; favoriteIds: string[]; onToggleFavorite: (id: string) => void; onQuantity: (id: string, quantity: number) => void }) {
  const card = list[index] ?? list[0]!;
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") onMove(1); if (e.key === "ArrowLeft") onMove(-1); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose, onMove]);
  return <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
    <motion.div initial={{ y: 40, scale: .95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, scale: .95 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 pb-[max(env(safe-area-inset-bottom),1rem)] shadow-lift sm:max-h-[90svh] sm:max-w-lg sm:rounded-3xl sm:p-6">
      <AnimatePresence mode="wait"><motion.img key={card.id} src={card.image} alt={card.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: .35, ease: EASE }} className="mx-auto max-h-[48svh] w-full object-contain sm:max-h-[60svh]" /></AnimatePresence>
      <div className="mt-5 flex items-center justify-between gap-4"><button onClick={() => onMove(-1)} aria-label="Anterior" className="rounded-full border border-border px-4 py-2 text-wine">←</button><div className="text-center"><p className="font-script text-3xl text-wine">{card.name}</p><p className="text-[10px] uppercase tracking-[.2em] text-olive">{index+1} / {list.length}</p></div><button onClick={() => onMove(1)} aria-label="Siguiente" className="rounded-full border border-border px-4 py-2 text-wine">→</button></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => onToggleFavorite(card.id)} className="min-h-12 rounded-full border border-wine/25 px-4 text-sm font-semibold text-wine">{favoriteIds.includes(card.id) ? "Quitar favorito" : "Guardar favorito"}</button><button onClick={() => onQuantity(card.id, 1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-wine px-3 text-center text-xs font-semibold text-white sm:text-sm"><Plus aria-hidden size={16} />Añadir 1 al pedido</button></div>
      <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-ink">✕</button>
    </motion.div>
  </motion.div>;
}

export function Catalog({ filter, setFilter, favoriteIds, onToggleFavorite, quantities, onQuantity }: { filter: Filter; setFilter: (f: Filter) => void; favoriteIds: string[]; onToggleFavorite: (id: string) => void; quantities: Record<string, number>; onQuantity: (id: string, quantity: number) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const searched = useMemo(() => cards.filter((card) => !query.trim() || card.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [query]);
  const counts = useMemo(() => ({
    todas: searched.length,
    letras: searched.filter((card) => matchesFilter(card, "letras")).length,
    personajes: searched.filter((card) => matchesFilter(card, "personajes")).length,
    frases: searched.filter((card) => matchesFilter(card, "frases")).length,
    ilustraciones: searched.filter((card) => matchesFilter(card, "ilustraciones")).length,
  }), [searched]);
  const list = useMemo(() => searched.filter((card) => matchesFilter(card, filter)), [searched, filter]);
  const pageCount = Math.ceil(list.length / 12);
  const visible = list.slice((page-1)*12, page*12);
  const changePage = (next: number) => {
    setPage(next);
    requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  return <section id="catalogo" className="catalog-section">
    <div className="catalog-heading"><p className="eyebrow text-[10px] text-olive sm:text-xs">{cards.length} diseños para elegir</p><h2 className="mt-1 font-script text-5xl text-wine sm:text-6xl md:text-7xl">{CATALOG_COPY.catalogHeading}</h2></div>
    <div className="catalog-controls">
      <div className="category-scroll-hint"><CategoryFilter value={filter} counts={counts} onChange={(next) => { setFilter(next); setPage(1); setOpen(null); }} /></div>
      <div className="catalog-tools">
        <label className="search-field"><Search aria-hidden className="h-4 w-4 text-olive" /><span className="sr-only">Buscar tarjetas por nombre</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); setOpen(null); }} placeholder="Buscar un diseño" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" /></label>
        <p className="selection-status" aria-live="polite">{list.length} {list.length === 1 ? "diseño" : "diseños"}</p>
      </div>
    </div>
    <motion.div ref={gridRef} layout className="catalog-grid mx-auto mt-4 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:mt-6 md:grid-cols-4 md:gap-6">
      <AnimatePresence mode="popLayout">{visible.map((card, i) => <GiftCard key={card.id} card={card} onOpen={() => setOpen((page-1)*12+i)} favorite={favoriteIds.includes(card.id)} onToggleFavorite={() => onToggleFavorite(card.id)} quantity={quantities[card.id] ?? 0} onQuantity={(n) => onQuantity(card.id,n)} />)}</AnimatePresence>
    </motion.div>
    {pageCount > 1 && <nav aria-label="Páginas del catálogo" className="catalog-pagination">
      <button type="button" aria-label="Página anterior" disabled={page===1} onClick={() => changePage(Math.max(1,page-1))}>‹</button>
      {Array.from({length:pageCount},(_,i)=>i+1).map((n)=><button type="button" key={n} aria-label={`Página ${n}`} aria-current={page===n?"page":undefined} onClick={() => changePage(n)}>{n}</button>)}
      <button type="button" aria-label="Página siguiente" disabled={page===pageCount} onClick={() => changePage(Math.min(pageCount,page+1))}>›</button>
    </nav>}
    <AnimatePresence>{open !== null && list.length > 0 && <CardModal list={list} index={open} onClose={() => setOpen(null)} onMove={(d) => setOpen((i) => ((i ?? 0)+d+list.length)%list.length)} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} onQuantity={onQuantity} />}</AnimatePresence>
  </section>;
}
