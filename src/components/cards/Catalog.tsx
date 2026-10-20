import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_NAMES, CATEGORY_ORDER } from "@/config/contact";
import { cards, categories, type Card, type CategoryId } from "@/data/cards";
import { Reveal } from "../decor/BrandExperience";

export type Filter = "todas" | "letras" | "personajes" | "frases" | "ilustraciones";
const options: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "letras", label: "Letras" },
  { id: "personajes", label: "Personajes" },
  { id: "frases", label: "Frases" },
  { id: "ilustraciones", label: "Ilustraciones" },
];
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
const isPerson = (card: Card) => ["santa", "gnomos", "animales"].includes(card.category);
const isIllustration = (card: Card) =>
  ["nacimiento", "florales", "puertas", "detalles"].includes(card.category);
const matches = (card: Card, filter: Filter) =>
  filter === "todas" ||
  (filter === "letras" && card.category === "iniciales") ||
  (filter === "frases" && card.category === "frases") ||
  (filter === "personajes" && isPerson(card)) ||
  (filter === "ilustraciones" && isIllustration(card));
const countsFor = (list: Card[]) =>
  Object.fromEntries(
    options.map(({ id }) => [
      id,
      id === "todas" ? list.length : list.filter((card) => matches(card, id)).length,
    ]),
  ) as Record<Filter, number>;
const categoryLabel = (category: CategoryId) => CATEGORY_NAMES[category];

function orderAll(list: Card[]) {
  const groups = new Map<CategoryId, Card[]>();
  for (const card of [...list].sort((a, b) => a.order - b.order))
    groups.set(card.category, [...(groups.get(card.category) ?? []), card]);
  const result: Card[] = [];
  let round = 0;
  while (result.length < list.length) {
    for (const category of [...CATEGORY_ORDER.slice(1), CATEGORY_ORDER[0]!]) {
      const card = groups.get(category)?.[round];
      if (card) result.push(card);
    }
    round++;
  }
  return result;
}

function QtyControl({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (value: number) => void;
}) {
  const commit = (raw: string) =>
    onChange(raw.trim() === "" ? 0 : Math.max(0, Math.min(999, Number.parseInt(raw, 10) || 0)));
  return (
    <div
      className="card-qty"
      aria-label={`Cantidad de ${label}`}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label={`Restar ${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <Minus size={15} />
      </button>
      {value === 0 ? (
        <button
          type="button"
          className="qty-add"
          aria-label={`Añadir ${label} al pedido`}
          onClick={() => onChange(1)}
        >
          <Plus size={16} /> Añadir
        </button>
      ) : (
        <input
          type="number"
          inputMode="numeric"
          min="0"
          max="999"
          aria-label={`Unidades de ${label}`}
          value={value}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => commit(event.target.value)}
        />
      )}
      <button
        type="button"
        aria-label={`Sumar ${label}`}
        onClick={() => onChange(Math.min(999, value + 1))}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function ProductBack() {
  return (
    <div className="product-back" aria-label="Reverso de marca">
      <span className="reverse-branch">✦</span>
      <p>Con cariño,</p>
      <strong>Yaritza Madera</strong>
      <small>CREATIONS · NAVIDAD 2026</small>
      <span className="reverse-flower">❧</span>
    </div>
  );
}

function ProductCard({
  card,
  quantity,
  onQuantity,
  onOpen,
}: {
  card: Card;
  quantity: number;
  onQuantity: (n: number) => void;
  onOpen: () => void;
}) {
  return (
    <Reveal className={`product-card ${quantity ? "is-selected" : ""}`}>
      <button
        type="button"
        className="product-preview"
        onClick={onOpen}
        aria-label={`Ver frente y reverso de ${card.name}`}
      >
        <span className="product-paper" style={{ aspectRatio: `${card.ratio}` }}>
          <img
            src={card.thumb}
            alt={`Frente de la tarjeta ${card.name}`}
            width="640"
            height="480"
            loading="lazy"
            decoding="async"
          />
          <span className="product-glint" aria-hidden="true" />
          {quantity > 0 && <span className="qty-seal">×{quantity}</span>}
        </span>
      </button>
      <div className="product-meta">
        <span className="product-category">{categoryLabel(card.category)}</span>
        <h3>{card.name}</h3>
      </div>
      <QtyControl value={quantity} label={card.name} onChange={onQuantity} />
    </Reveal>
  );
}

function CategoryMosaics({
  onChoose,
  counts,
}: {
  onChoose: (filter: Filter) => void;
  counts: Record<Filter, number>;
}) {
  return (
    <div className="category-mosaics" aria-label="Explorar tipos de tarjetas">
      {options.slice(1).map(({ id, label }, index) => {
        const card = [
          cards.find((item) => item.category === "iniciales"),
          cards.find((item) => isPerson(item)),
          cards.find((item) => item.category === "frases"),
          cards.find((item) => isIllustration(item)),
        ][index]!;
        return (
          <button className="category-mosaic" type="button" key={id} onClick={() => onChoose(id)}>
            <img src={card.thumb} alt="" loading="lazy" />
            <span>{label}</span>
            <small>{counts[id]} diseños</small>
          </button>
        );
      })}
    </div>
  );
}

export function CategoryOverview({ onChoose }: { onChoose: (filter: Filter) => void }) {
  return (
    <section className="category-overview" aria-label="Explora las categorías del catálogo">
      <p className="category-overview-title">Un detalle para cada estilo</p>
      <CategoryMosaics onChoose={onChoose} counts={countsFor(cards)} />
    </section>
  );
}

function CardModal({
  list,
  index,
  onClose,
  onMove,
  quantity,
  onQuantity,
}: {
  list: Card[];
  index: number;
  onClose: () => void;
  onMove: (n: number) => void;
  quantity: number;
  onQuantity: (n: number) => void;
}) {
  const [back, setBack] = useState(false);
  const card = list[index];
  useEffect(() => {
    setBack(false);
  }, [card?.id]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onMove(1);
      if (event.key === "ArrowLeft") onMove(-1);
      if (event.key === " " || event.key.toLowerCase() === "f") {
        event.preventDefault();
        setBack((value) => !value);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onMove]);
  if (!card) return null;
  let startX = 0;
  return (
    <motion.div
      className="card-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onTouchStart={(event) => {
        startX = event.touches[0]?.clientX ?? 0;
      }}
      onTouchEnd={(event) => {
        const delta = (event.changedTouches[0]?.clientX ?? 0) - startX;
        if (Math.abs(delta) > 50) onMove(delta < 0 ? 1 : -1);
      }}
    >
      <button className="modal-scrim" onClick={onClose} aria-label="Cerrar vista" />
      <section
        className="card-modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-card-title"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X />
        </button>
        <div className="modal-card-stage">
          <div className={`modal-card-flipper ${back ? "is-back" : ""}`}>
            <div className="modal-face modal-front">
              <img
                src={card.front}
                alt={`Frente de la tarjeta ${card.name}`}
                fetchPriority="high"
              />
            </div>
            <div className="modal-face modal-reverse" aria-hidden={!back}>
              <ProductBack />
            </div>
          </div>
        </div>
        <button
          className="flip-toggle"
          type="button"
          aria-pressed={back}
          onClick={() => setBack((value) => !value)}
        >
          {back ? "Ver frente" : "Ver reverso"} <span>● {back ? "○" : "●"}</span>
        </button>
        <div className="modal-caption">
          <button type="button" onClick={() => onMove(-1)} aria-label="Tarjeta anterior">
            <ChevronLeft />
          </button>
          <div>
            <h2 id="modal-card-title">{card.name}</h2>
            <p>
              {categoryLabel(card.category)} · {index + 1} / {list.length}
            </p>
          </div>
          <button type="button" onClick={() => onMove(1)} aria-label="Tarjeta siguiente">
            <ChevronRight />
          </button>
        </div>
        <div className="modal-packages" aria-label="Cantidades sugeridas">
          {[5, 10, 15, 20, 50].map((n) => (
            <button type="button" key={n} onClick={() => onQuantity(n)}>
              {n}
            </button>
          ))}
        </div>
        <QtyControl value={quantity} label={card.name} onChange={onQuantity} />
        <p className="swipe-hint">
          Desliza para ver otra tarjeta · toca “Ver reverso” para girarla
        </p>
      </section>
    </motion.div>
  );
}

export function Catalog({
  filter,
  setFilter,
  quantities,
  onQuantity,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  quantities: Record<string, number>;
  onQuantity: (id: string, quantity: number) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (new URLSearchParams(window.location.search).get("q") ?? ""),
  );
  const [letter, setLetter] = useState("");
  const [page, setPage] = useState(() =>
    Math.max(
      1,
      Number(
        new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("p"),
      ) || 1,
    ),
  );
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedFilter = params.get("cat");
      if (
        ["todas", "letras", "personajes", "frases", "ilustraciones"].includes(requestedFilter ?? "")
      ) {
        setFilter(requestedFilter as Filter);
      } else {
        setFilter("todas");
      }
      setQuery(params.get("q") ?? "");
      setPage(Math.max(1, Number(params.get("p")) || 1));
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [setFilter]);
  const filteredSearch = useMemo(
    () => cards.filter((card) => !query.trim() || normalize(card.name).includes(normalize(query))),
    [query],
  );
  const counts = useMemo(() => countsFor(filteredSearch), [filteredSearch]);
  const list = useMemo(() => {
    let result = filteredSearch.filter((card) => matches(card, filter));
    if (filter === "letras") {
      result.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
      if (letter)
        result = result.filter((card) =>
          normalize(card.name.replace("Inicial ", "")).startsWith(normalize(letter)),
        );
    } else if (filter === "todas") result = orderAll(result);
    return result;
  }, [filteredSearch, filter, letter]);
  const pageCount = Math.ceil(list.length / 12);
  const safePage = Math.min(page, Math.max(1, pageCount));
  const visible = list.slice((safePage - 1) * 12, safePage * 12);
  const movePage = (next: number) => {
    setPage(next);
    const url = new URL(window.location.href);
    url.searchParams.set("cat", filter);
    url.searchParams.set("p", String(next));
    if (query) url.searchParams.set("q", query);
    history.pushState({}, "", url);
    requestAnimationFrame(() =>
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  const chooseFilter = (next: Filter) => {
    setFilter(next);
    setLetter("");
    setPage(1);
    const url = new URL(window.location.href);
    if (next === "todas") url.searchParams.delete("cat");
    else url.searchParams.set("cat", next);
    url.searchParams.delete("p");
    history.pushState({}, "", url);
    document
      .querySelector("#catalogo-grid-anchor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const modalIndex = open ? list.findIndex((card) => card.id === open) : -1;
  return (
    <section id="catalogo" className="catalog-section">
      <Reveal>
        <div className="catalog-heading">
          <p className="eyebrow text-[10px] text-olive sm:text-xs">104 diseños para elegir</p>
          <h2 className="mt-1 font-script text-5xl text-wine sm:text-6xl md:text-7xl">{`Nuestras tarjetas`}</h2>
          <p>Pequeños detalles para acompañar grandes regalos.</p>
        </div>
      </Reveal>
      <div className="catalog-controls">
        <div className="category-scroll-hint">
          <div role="group" aria-label="Filtrar por categoría" className="category-filter">
            {options.map(({ id, label }) => (
              <button
                type="button"
                key={id}
                aria-pressed={filter === id}
                onClick={() => chooseFilter(id)}
                className="category-chip"
              >
                {label} <span>({counts[id]})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="catalog-tools">
          <label className="search-field">
            <Search aria-hidden className="h-4 w-4 text-olive" />
            <span className="sr-only">Buscar tarjetas por nombre</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
                const url = new URL(window.location.href);
                if (event.target.value.trim()) url.searchParams.set("q", event.target.value.trim());
                else url.searchParams.delete("q");
                url.searchParams.delete("p");
                history.replaceState({}, "", url);
              }}
              placeholder="Buscar un diseño"
            />
          </label>
          <p className="selection-status" aria-live="polite">
            {list.length} diseños
          </p>
        </div>
        {filter === "letras" && (
          <div className="letter-picker" role="group" aria-label="Filtrar por inicial">
            {[
              ...new Set(
                cards
                  .filter((card) => card.category === "iniciales")
                  .map((card) => card.name.replace("Inicial ", "")),
              ),
            ]
              .sort((a, b) => a.localeCompare(b))
              .map((initial) => (
                <button
                  key={initial}
                  type="button"
                  aria-pressed={letter === initial}
                  onClick={() => {
                    setLetter(letter === initial ? "" : initial);
                    setPage(1);
                  }}
                >
                  {initial}
                </button>
              ))}
          </div>
        )}
        {pageCount > 1 && (
          <nav aria-label="Páginas del catálogo" className="catalog-pagination">
            <button
              type="button"
              disabled={safePage === 1}
              aria-label="Página anterior"
              onClick={() => movePage(Math.max(1, safePage - 1))}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) =>
              Math.min(Math.max(1, safePage - 2) + i, pageCount),
            )
              .filter((n, i, all) => all.indexOf(n) === i)
              .map((n) => (
                <button
                  type="button"
                  key={n}
                  aria-label={`Página ${n}`}
                  aria-current={safePage === n ? "page" : undefined}
                  onClick={() => movePage(n)}
                >
                  {n}
                </button>
              ))}
            <button
              type="button"
              disabled={safePage === pageCount}
              aria-label="Página siguiente"
              onClick={() => movePage(Math.min(pageCount, safePage + 1))}
            >
              ›
            </button>
          </nav>
        )}
      </div>
      <div id="catalogo-grid-anchor" ref={gridRef} />
      <div className="catalog-grid">
        {visible.map((card) => (
          <ProductCard
            key={card.id}
            card={card}
            quantity={quantities[card.id] ?? 0}
            onQuantity={(n) => onQuantity(card.id, n)}
            onOpen={() => setOpen(card.id)}
          />
        ))}
      </div>
      {pageCount > 1 && safePage < pageCount && (
        <button type="button" className="catalog-next" onClick={() => movePage(safePage + 1)}>
          Siguiente →
        </button>
      )}
      <AnimatePresence>
        {modalIndex >= 0 && (
          <CardModal
            key={list[modalIndex]!.id}
            list={list}
            index={modalIndex}
            onClose={() => setOpen(null)}
            onMove={(delta) => setOpen(list[(modalIndex + delta + list.length) % list.length]!.id)}
            quantity={quantities[list[modalIndex]!.id] ?? 0}
            onQuantity={(n) => onQuantity(list[modalIndex]!.id, n)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

