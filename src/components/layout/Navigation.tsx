import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Instagram, MessageCircle, Sparkles, X, Minus, Plus, Trash2 } from "lucide-react";
import type { Card } from "@/data/cards";
import { buildOrderMessage, createOrderCode, CATALOG_COPY, EMAIL, INSTAGRAM, INSTAGRAM_SECONDARY, whatsappUrl } from "@/config/contact";
import { HollyBranch, Reveal, SectionDivider } from "../decor/BrandExperience";

export type OrderLine = { card: Card; quantity: number };

function useOrderMessage(items: OrderLine[]) {
  const key = items.map(({card,quantity})=>`${card.id}:${quantity}`).join("|");
  return useMemo(() => buildOrderMessage(items.map(({card,quantity})=>({name:card.name,quantity})), createOrderCode()), [key]);
}

function QuantityControl({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return <div className="order-quantity" aria-label={`Cantidad de ${label}`}>
    <button type="button" aria-label={`Restar ${label}`} onClick={()=>onChange(Math.max(1,value-1))}><Minus size={15}/></button>
    <output aria-live="polite">{value}</output>
    <button type="button" aria-label={`Sumar ${label}`} onClick={()=>onChange(value+1)}><Plus size={15}/></button>
  </div>;
}

export function ContactSection({ items, onRemove, onQuantity, onSelection }: { items: OrderLine[]; onRemove: (id: string) => void; onQuantity: (id: string, n: number) => void; onSelection: () => void }) {
  const [notice, setNotice] = useState("");
  const emailReady = EMAIL.includes("@") && !EMAIL.startsWith("[");
  const orderMessage = useOrderMessage(items);
  const instagramMessage = orderMessage || "Hola Yaritza, vi el catálogo de Navidad 2026 y quisiera información.";
  const total = items.reduce((sum,item)=>sum+item.quantity,0);

  const copyForInstagram = async () => {
    try { await navigator.clipboard.writeText(instagramMessage); }
    catch {
      const field = document.createElement("textarea");
      field.value = instagramMessage; field.setAttribute("readonly",""); field.style.position="fixed"; field.style.opacity="0";
      document.body.append(field); field.select(); document.execCommand("copy"); field.remove();
    }
    setNotice(CATALOG_COPY.instagramCopied);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return <section id="contacto" className="contact-section">
    <HollyBranch className="contact-holly contact-holly-left" /><HollyBranch className="contact-holly contact-holly-right" />
    <div className="contact-inner">
      <Reveal className="selection-summary">
        <div className="selection-heading">
          <div><p className="eyebrow text-[10px] text-white/75">Resumen del pedido</p><h2 className="font-script text-4xl text-white sm:text-5xl">Mi pedido <span className="selection-count">{total}</span></h2></div>
          <button onClick={onSelection} className="button button-light">Ver pedido</button>
        </div>
        {items.length ? <ul className="order-lines">{items.map(({card,quantity})=><li key={card.id} className="order-line">
          <img src={card.image} alt="" width="72" height="60" loading="lazy"/>
          <span className="order-line-name">{card.name}</span>
          <QuantityControl value={quantity} label={card.name} onChange={(n)=>onQuantity(card.id,n)}/>
          <button type="button" onClick={()=>onRemove(card.id)} aria-label={`Quitar ${card.name} del pedido`} className="order-remove"><Trash2 size={17}/></button>
        </li>)}</ul> : <p className="selection-empty">Aún no has añadido tarjetas al pedido. Elige cantidades desde el catálogo.</p>}
        <p className="order-total">Total: {total} {total === 1 ? "tarjeta" : "tarjetas"}</p>
      </Reveal>
      <SectionDivider />
      <Reveal className="contact-copy">
        <p className="eyebrow text-[10px] text-white/75">{CATALOG_COPY.contactEyebrow}</p>
        <h2 className="mt-2 font-script text-5xl text-white sm:text-6xl">{CATALOG_COPY.contactHeading}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85">{CATALOG_COPY.contactBody}</p>
        <div className="contact-actions">
          <a href={whatsappUrl(orderMessage || undefined)} target="_blank" rel="noopener noreferrer" className="button button-light"><MessageCircle aria-hidden="true" size={18} /> Enviar pedido por WhatsApp</a>
          <a href={`https://ig.me/m/${INSTAGRAM}`} onClick={()=>void copyForInstagram()} target="_blank" rel="noopener noreferrer" className="button button-translucent"><Instagram aria-hidden="true" size={18} /> {CATALOG_COPY.instagramButton}</a>
        </div>
        <p className="contact-notice" aria-live="polite">{notice}</p>
        <div className="contact-links"><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a><a href={`https://instagram.com/${INSTAGRAM_SECONDARY}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM_SECONDARY}</a>{emailReady && <a href={`mailto:${EMAIL}`}>Correo</a>}</div>
      </Reveal>
    </div>
  </section>;
}

export function TopBar({ count, onSelection }: { count: number; onSelection: () => void }) {
  return <header className="top-bar"><nav aria-label="Navegación principal" className="top-nav">
    <a href="#inicio" className="font-script text-3xl text-wine">Yaritza Madera</a>
    <div className="top-links"><a href="#inicio">Inicio</a><a href="#catalogo">Catálogo</a><a href="#contacto">Contacto</a></div>
    <button onClick={onSelection} className="button button-primary top-selection">Mi pedido <span>{count}</span></button>
  </nav></header>;
}

export function BottomBar({ count, onSelection }: { count: number; onSelection: () => void }) {
  return <nav aria-label="Accesos rápidos" className="bottom-bar">
    <a href="#catalogo"><Sparkles aria-hidden="true" size={17}/>Catálogo</a>
    <button onClick={onSelection}><ArrowUp aria-hidden="true" size={17}/>Mi pedido{count>0&&<span className="bottom-count">{count}</span>}</button>
    <a href="#contacto"><MessageCircle aria-hidden="true" size={17}/>Contactar</a>
  </nav>;
}

export function SelectionPanel({ items, onQuantity, onRemove, onClose }: { items: OrderLine[]; onQuantity: (id:string,n:number)=>void; onRemove:(id:string)=>void; onClose:()=>void }) {
  const message = useOrderMessage(items);
  const total = items.reduce((sum,item)=>sum+item.quantity,0);
  useEffect(() => {
    const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose();};
    window.addEventListener("keydown",closeOnEscape); return ()=>window.removeEventListener("keydown",closeOnEscape);
  },[onClose]);
  return <AnimatePresence>
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <button aria-label="Cerrar pedido" className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose}/>
      <motion.section role="dialog" aria-modal="true" aria-labelledby="selection-title" initial={{y:32,opacity:0}} animate={{y:0,opacity:1}} exit={{y:32,opacity:0}} transition={{type:"spring",stiffness:120,damping:20}} className="relative max-h-[85svh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-lift md:mr-6 md:max-h-[80svh] md:max-w-md md:rounded-3xl md:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[10px] text-olive">Resumen del pedido</p><h2 id="selection-title" className="mt-1 font-script text-4xl text-wine">Mi pedido ({total})</h2></div><button onClick={onClose} aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink"><X className="h-5 w-5"/></button></div>
        {items.length ? <ul className="mt-5 space-y-2">{items.map(({card,quantity})=><li key={card.id} className="order-line order-line-light"><img src={card.image} alt="" width="72" height="60"/><span className="order-line-name">{card.name}</span><QuantityControl value={quantity} label={card.name} onChange={(n)=>onQuantity(card.id,n)}/><button type="button" onClick={()=>onRemove(card.id)} aria-label={`Quitar ${card.name} del pedido`} className="order-remove"><Trash2 size={17}/></button></li>)}</ul> : <p className="py-10 text-center text-sm text-ink">Aún no has añadido diseños al pedido.</p>}
        <p className="order-total order-total-light">Total: {total} {total===1?"tarjeta":"tarjetas"}</p>
        <a href={whatsappUrl(message || undefined)} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-wine px-5 text-center text-sm font-semibold text-white"><MessageCircle className="h-5 w-5"/>Enviar pedido por WhatsApp</a>
      </motion.section>
    </motion.div>
  </AnimatePresence>;
}
