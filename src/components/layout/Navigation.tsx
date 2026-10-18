import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Instagram, Mail, MessageCircle, Sparkles, X } from "lucide-react";
import type { Card } from "@/data/cards";
import { buildWhatsAppMessage, CATALOG_COPY, EMAIL, INSTAGRAM, INSTAGRAM_SECONDARY, whatsappUrl } from "@/config/contact";
import { Reveal, SectionDivider } from "../decor/BrandExperience";

export function ContactSection({ cards, onRemove, onSelection }: { cards: Card[]; onRemove: (id: string) => void; onSelection: () => void }) {
  const [notice, setNotice] = useState("");
  const emailReady = EMAIL.includes("@") && !EMAIL.startsWith("[");
  const message = buildWhatsAppMessage(cards.map((card) => card.name));

  const copyForInstagram = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const field = document.createElement("textarea");
      field.value = message;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setNotice(CATALOG_COPY.instagramCopied);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <section id="contacto" className="contact-section">
      <div className="contact-holly contact-holly-left" aria-hidden="true">❧</div>
      <div className="contact-holly contact-holly-right" aria-hidden="true">❧</div>
      <div className="contact-inner">
        <Reveal className="selection-summary">
          <div className="selection-heading">
            <div><p className="eyebrow text-[10px] text-white/75">Tus favoritos</p><h2 className="font-script text-4xl text-white sm:text-5xl">Mi selección <span className="selection-count">{cards.length}</span></h2></div>
            <button onClick={onSelection} className="button button-light">Ver lista</button>
          </div>
          {cards.length ? <ul className="selection-chips">{cards.map((card) => <li key={card.id}><span>{card.name}</span><button type="button" onClick={() => onRemove(card.id)} aria-label={`Quitar ${card.name}`} title="Quitar">×</button></li>)}</ul> : <p className="selection-empty">{CATALOG_COPY.selectionEmpty}</p>}
        </Reveal>
        <SectionDivider />
        <Reveal className="contact-copy">
          <p className="eyebrow text-[10px] text-white/75">{CATALOG_COPY.contactEyebrow}</p>
          <h2 className="mt-2 font-script text-5xl text-white sm:text-6xl">{CATALOG_COPY.contactHeading}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85">{CATALOG_COPY.contactBody}</p>
          <div className="contact-actions">
            <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="button button-light"><MessageCircle aria-hidden="true" size={18} /> {CATALOG_COPY.whatsappButton}</a>
            <a href={`https://ig.me/m/${INSTAGRAM}`} onClick={() => void copyForInstagram()} target="_blank" rel="noopener noreferrer" className="button button-translucent"><Instagram aria-hidden="true" size={18} /> {CATALOG_COPY.instagramButton}</a>
          </div>
          <p className="contact-notice" aria-live="polite">{notice}</p>
          <div className="contact-links"><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a><a href={`https://instagram.com/${INSTAGRAM_SECONDARY}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_SECONDARY}</a>{emailReady && <a href={`mailto:${EMAIL}`}>Correo</a>}</div>
        </Reveal>
      </div>
    </section>
  );
}

export function TopBar({ count, onSelection }: { count: number; onSelection: () => void }) {
  return (
    <header className="top-bar">
      <nav aria-label="Navegación principal" className="top-nav">
        <a href="#inicio" className="font-script text-3xl text-wine">Yaritza Madera</a>
        <div className="top-links"><a href="#inicio">Inicio</a><a href="#catalogo">Catálogo</a><a href="#contacto">Contacto</a></div>
        <button onClick={onSelection} className="button button-primary top-selection">Mi selección <span>{count}</span></button>
      </nav>
    </header>
  );
}

export function BottomBar({ count, onSelection }: { count: number; onSelection: () => void }) {
  return (
    <nav aria-label="Accesos rápidos" className="bottom-bar">
      <a href="#catalogo"><Sparkles aria-hidden="true" size={17} />Catálogo</a>
      <button onClick={onSelection}><ArrowUp aria-hidden="true" size={17} />Mi selección{count > 0 && <span className="bottom-count">{count}</span>}</button>
      <a href="#contacto"><MessageCircle aria-hidden="true" size={17} />Contactar</a>
    </nav>
  );
}

export function SelectionPanel({ cards, onRemove, onClose }: { cards: Card[]; onRemove: (id: string) => void; onClose: () => void }) {
  const message = buildWhatsAppMessage(cards.map((card) => card.name));
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button aria-label="Cerrar mi selección" className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />
        <motion.section role="dialog" aria-modal="true" aria-labelledby="selection-title" initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="relative max-h-[85svh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-lift md:mr-6 md:max-h-[80svh] md:max-w-md md:rounded-3xl md:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[10px] text-olive">Tus favoritos</p><h2 id="selection-title" className="mt-1 font-script text-4xl text-wine">Mi selección ({cards.length})</h2></div><button onClick={onClose} aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"><X aria-hidden="true" className="h-5 w-5" /></button></div>
          {cards.length ? <><ul className="mt-5 max-h-64 space-y-2 overflow-y-auto">{cards.map((card) => <li key={card.id} className="flex items-center gap-3 rounded-2xl bg-white p-2.5"><img src={card.image} alt="" width="64" height="56" className="h-14 w-16 rounded-xl bg-cream object-contain" loading="lazy" /><span className="min-w-0 flex-1 truncate text-sm text-ink">{card.name}</span><button onClick={() => onRemove(card.id)} className="min-h-11 rounded-full px-3 text-xs text-wine underline underline-offset-2">Quitar</button></li>)}</ul><a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-wine px-5 text-sm font-semibold text-white"><MessageCircle aria-hidden="true" className="h-5 w-5" />Pedir por WhatsApp</a></> : <div className="py-10 text-center"><p className="text-sm text-ink">Aún no has guardado diseños.</p><button onClick={onClose} className="mt-4 min-h-12 rounded-full bg-wine px-6 text-sm font-semibold text-white">Explorar catálogo</button></div>}
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

