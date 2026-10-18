import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Instagram, Mail, MessageCircle, Sparkles, X } from "lucide-react";
import type { Card } from "@/data/cards";
import { EMAIL, INSTAGRAM, INSTAGRAM_SECONDARY, whatsappUrl } from "@/config/contact";

const requestMessage = "Hola Yaritza, quiero elegir tarjetas de regalo navideñas.";

export function ContactSection() {
  const emailReady = EMAIL.includes("@") && !EMAIL.startsWith("[");
  return (
    <section id="contacto" className="relative overflow-hidden bg-wine px-5 py-20 text-primary-foreground md:px-8 md:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full border border-white/10 md:h-72 md:w-72" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-14 h-64 w-64 rounded-full border border-white/10" />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow text-[10px] text-white/75">Para tu tienda y tus regalos</p>
        <h2 className="mt-3 font-script text-6xl md:text-7xl">¿Listo para elegir?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/85 md:text-base">Escríbenos y te ayudamos a elegir los diseños para tu tienda.</p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a href={whatsappUrl(requestMessage)} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-wine transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <MessageCircle aria-hidden className="h-5 w-5" /> WhatsApp
          </a>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <Instagram aria-hidden className="h-5 w-5" /> @yaritzamaderacreations
          </a>
          <a href={`https://instagram.com/${INSTAGRAM_SECONDARY}`} target="_blank" rel="noreferrer" aria-label={`Instagram @${INSTAGRAM_SECONDARY}`} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <Instagram aria-hidden className="h-5 w-5" /> @mamaandariega
          </a>
          {emailReady ? (
            <a href={`mailto:${EMAIL}`} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <Mail aria-hidden className="h-5 w-5" /> Correo
            </a>
          ) : (
            <span className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-4 text-sm text-white/70" aria-label="Correo pendiente de configurar">
              <Mail aria-hidden className="h-5 w-5" /> Correo por confirmar
            </span>
          )}
        </div>
        {/* [PENDIENTE] Confirmar precios, pedido mínimo y paquetes antes de publicar esa información. */}
      </motion.div>
    </section>
  );
}

export function TopBar({ count, onSelection }: { count: number; onSelection: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 hidden border-b border-wine/10 bg-cream/90 px-8 py-3 backdrop-blur-md md:block">
      <nav aria-label="Navegación principal" className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#inicio" className="font-script text-3xl text-wine">Yaritza Madera</a>
        <div className="flex items-center gap-8 text-xs font-medium uppercase tracking-[0.16em] text-ink">
          <a className="min-h-11 content-center transition-colors hover:text-wine" href="#inicio">Inicio</a>
          <a className="min-h-11 content-center transition-colors hover:text-wine" href="#catalogo">Catálogo</a>
          <a className="min-h-11 content-center transition-colors hover:text-wine" href="#contacto">Contacto</a>
        </div>
        <button onClick={onSelection} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-wine px-5 text-xs font-semibold uppercase tracking-wider text-white">
          Mi selección <span aria-label={`${count} diseños seleccionados`} className="rounded-full bg-white/20 px-2 py-1">{count}</span>
        </button>
      </nav>
    </header>
  );
}

export function BottomBar({ count, onSelection }: { count: number; onSelection: () => void }) {
  return (
    <nav aria-label="Accesos rápidos" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-wine/10 bg-cream/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(59,59,59,0.08)] backdrop-blur-md md:hidden">
      <a href="#catalogo" className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink"><Sparkles aria-hidden className="h-4 w-4 text-olive" />Catálogo</a>
      <button onClick={onSelection} className="relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink"><ArrowUp aria-hidden className="h-4 w-4 text-olive" />Mi selección{count > 0 && <span className="absolute right-[22%] top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[9px] text-white">{count}</span>}</button>
      <a href="#contacto" className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink"><MessageCircle aria-hidden className="h-4 w-4 text-wine" />Contactar</a>
    </nav>
  );
}

export function SelectionPanel({ cards, onRemove, onClose }: { cards: Card[]; onRemove: (id: string) => void; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const names = cards.map((card) => card.name);
  const message = `Hola Yaritza, me interesan estas tarjetas: ${names.join(", ")}`;

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(names.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button aria-label="Cerrar mi selección" className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
        <motion.section role="dialog" aria-modal="true" aria-labelledby="selection-title" initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="relative max-h-[85svh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-lift md:mr-6 md:max-h-[80svh] md:max-w-md md:rounded-3xl md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="eyebrow text-[10px] text-olive">Tus favoritos</p><h2 id="selection-title" className="mt-1 font-script text-4xl text-wine">Mi selección ({cards.length})</h2></div>
            <button onClick={onClose} aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"><X aria-hidden className="h-5 w-5" /></button>
          </div>
          {cards.length ? (
            <>
              <ul className="mt-5 max-h-64 space-y-2 overflow-y-auto">
                {cards.map((card) => <li key={card.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5">
                  <img src={card.image} alt="" className="h-14 w-16 rounded-xl bg-cream object-contain" loading="lazy" />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{card.name}</span>
                  <button onClick={() => onRemove(card.id)} className="min-h-11 rounded-full px-3 text-xs text-wine underline underline-offset-2">Quitar</button>
                </li>)}
              </ul>
              <a href={whatsappUrl(message)} target="_blank" rel="noreferrer" className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-wine px-5 text-sm font-semibold text-white"><MessageCircle aria-hidden className="h-5 w-5" />Pedir por WhatsApp</a>
              <button onClick={copyList} className="mt-2 min-h-12 w-full rounded-full border border-wine/25 text-sm font-medium text-wine">{copied ? "Lista copiada" : "Copiar lista"}</button>
            </>
          ) : (
            <div className="py-10 text-center"><p className="text-sm text-ink">Aún no has guardado diseños.</p><button onClick={onClose} className="mt-4 min-h-12 rounded-full bg-wine px-6 text-sm font-semibold text-white">Explorar catálogo</button></div>
          )}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
