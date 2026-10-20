import { useMemo, useState } from "react";
import { ArrowUp, Instagram, MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import type { Card } from "@/data/cards";
import {
  buildOrderMessage,
  CATEGORY_NAMES,
  CATEGORY_ORDER,
  CATALOG_COPY,
  createOrderCode,
  INSTAGRAM,
  INSTAGRAM_SECONDARY,
  whatsappUrl,
} from "@/config/contact";
import { HollyBranch, Reveal, SectionDivider } from "../decor/BrandExperience";

export type OrderLine = { card: Card; quantity: number };

function QuantityControl({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="order-quantity" aria-label={`Cantidad de ${label}`}>
      <button
        type="button"
        aria-label={`Restar ${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <Minus size={15} />
      </button>
      <input
        aria-label={`Cantidad de ${label}`}
        type="number"
        inputMode="numeric"
        min="0"
        max="999"
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) =>
          onChange(Math.max(0, Math.min(999, Number.parseInt(e.target.value, 10) || 0)))
        }
      />
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
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

export function ContactSection({
  items,
  onRemove,
  onQuantity,
  customerName,
  setCustomerName,
  notes,
  setNotes,
}: {
  items: OrderLine[];
  onRemove: (id: string) => void;
  onQuantity: (id: string, n: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}) {
  const [notice, setNotice] = useState("");
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  const code = useMemo(
    () => (items.length ? createOrderCode(items, customerName, notes) : ""),
    [items, customerName, notes],
  );
  const message = useMemo(
    () => (customerName.trim() ? buildOrderMessage({ items, customerName, notes, code }) : ""),
    [items, customerName, notes, code],
  );
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    lines: items
      .filter(({ card }) => card.category === category)
      .sort((a, b) => a.card.name.localeCompare(b.card.name, "es")),
  })).filter(({ lines }) => lines.length > 0);
  const sendHref = whatsappUrl(message || undefined);
  const tellCopied = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const sendOrder = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!items.length) return;
    if (!customerName.trim()) {
      event.preventDefault();
      setNotice("Escribe el nombre para preparar el pedido.");
      document.querySelector<HTMLInputElement>("#customer-name")?.focus();
      return;
    }
    if (encodeURIComponent(message).length <= 3000) return;
    event.preventDefault();
    window.open(
      whatsappUrl(
        `Hola Yaritza 👋, quisiera hacer el pedido ${code} a nombre de ${customerName.trim()}. Son ${total} tarjetas; te paso el detalle.`,
      ),
      "_blank",
      "noopener,noreferrer",
    );
    try {
      await navigator.clipboard.writeText(message);
      tellCopied("Lista copiada, pégala en el chat.");
    } catch {
      tellCopied("El pedido es extenso. Descarga el PDF y envíalo por separado.");
    }
  };

  const copyAndInstagram = async () => {
    if (!items.length) {
      window.open(`https://ig.me/m/${INSTAGRAM}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (!customerName.trim()) {
      setNotice("Escribe el nombre para preparar el pedido.");
      document.querySelector<HTMLInputElement>("#customer-name")?.focus();
      return;
    }
    try {
      await navigator.clipboard.writeText(message);
      tellCopied("Lista copiada, pégala en el chat de Instagram.");
    } catch {
      tellCopied("No se pudo copiar automáticamente. Prueba enviar por WhatsApp.");
    }
    window.open(`https://ig.me/m/${INSTAGRAM}`, "_blank", "noopener,noreferrer");
  };

  const downloadOrder = () => {
    if (!items.length) {
      setNotice("Añade al menos una tarjeta para preparar la hoja del pedido.");
      return;
    }
    if (!customerName.trim()) {
      setNotice("Escribe el nombre para preparar la hoja del pedido.");
      document.querySelector<HTMLInputElement>("#customer-name")?.focus();
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setNotice("Permite la ventana de impresión para guardar el PDF.");
      return;
    }
    const date = new Intl.DateTimeFormat("es-DO", { dateStyle: "long" }).format(new Date());
    const rows = grouped
      .map(
        ({ category, lines }) =>
          `<tr class="group"><th colspan="5">${escapeHtml(CATEGORY_NAMES[category])}</th></tr>${lines.map(({ card, quantity }) => `<tr><td><img src="${card.thumb}" alt=""><span>${escapeHtml(card.name)}</span></td><td>${escapeHtml(CATEGORY_NAMES[card.category])}</td><td>${quantity}</td><td>□</td><td>□</td></tr>`).join("")}`,
      )
      .join("");
    const totalDesigns = items.length;
    printWindow.document.write(
      `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Pedido ${code} · Yaritza Madera Creations</title><style>@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{font:12px Arial,sans-serif;color:#342a27}header{border-bottom:2px solid #9b3a4b;padding-bottom:12px;margin-bottom:18px}h1{font:32px Georgia,serif;color:#9b3a4b;margin:0 0 8px}header p{margin:4px 0}table{width:100%;border-collapse:collapse}th,td{padding:7px;border:1px solid #ded6cf;text-align:left}th{background:#f5f0e8}.group th{background:#e9ded4;color:#7a3040}td:first-child{display:flex;align-items:center;gap:8px}td img{width:42px;height:48px;object-fit:contain}td:nth-child(3),td:nth-child(4),td:nth-child(5){text-align:center;width:55px}.total{font-weight:bold;text-align:right;padding:12px 0}.notes{border-top:1px solid #ddd;padding-top:10px}.footer{margin-top:24px;color:#777;text-align:center;font-size:10px}.check{font-size:22px}</style></head><body><header><h1>Pedido de tarjetas · Navidad 2026</h1><p><b>${escapeHtml(code)}</b> · ${escapeHtml(date)}</p><p>A nombre de: <b>${escapeHtml(customerName.trim())}</b></p><p>Yaritza Madera Creations</p></header><table><thead><tr><th>Tarjeta</th><th>Categoría</th><th>Cantidad</th><th>Preparada</th><th>Empaquetada</th></tr></thead><tbody>${rows}</tbody></table><p class="total">Total: ${total} tarjetas (${totalDesigns} diseños)</p>${notes.trim() ? `<p class="notes"><b>Notas:</b> ${escapeHtml(notes.trim())}</p>` : ""}<p class="footer">@${INSTAGRAM} · Hoja de trabajo opcional. El mensaje de WhatsApp contiene el pedido para Yaritza.</p><script>window.onload=()=>window.print()</script></body></html>`,
    );
    printWindow.document.close();
  };

  return (
    <section id="contacto" className="contact-section">
      <HollyBranch className="contact-holly contact-holly-left" />
      <HollyBranch className="contact-holly contact-holly-right" />
      <div className="contact-inner">
        <Reveal className="selection-summary">
          <div className="selection-heading">
            <div>
              <p className="eyebrow text-[10px] text-white/75">Resumen del pedido</p>
              <h2 className="font-script text-4xl text-white sm:text-5xl">
                Mi pedido <span className="selection-count">{total}</span>
              </h2>
            </div>
          </div>
          {items.length ? (
            <div className="order-grid-wrap">
              <table className="order-grid">
                <thead>
                  <tr>
                    <th>
                      <i />
                      Tarjeta
                    </th>
                    <th>
                      <i />
                      Categoría
                    </th>
                    <th>
                      <i />
                      Cantidad
                    </th>
                    <th>
                      <i />
                      Quitar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.map(({ category, lines }) => (
                    <>
                      <tr className="order-category-row" key={`group-${category}`}>
                        <th colSpan={4}>✦ {CATEGORY_NAMES[category]}</th>
                      </tr>
                      {lines.map(({ card, quantity }) => (
                        <tr key={card.id}>
                          <td className="order-card-cell">
                            <img src={card.thumb} alt="" width="56" height="52" loading="lazy" />
                            <span>{card.name}</span>
                            <small>{CATEGORY_NAMES[card.category]}</small>
                          </td>
                          <td className="order-category-cell">{CATEGORY_NAMES[category]}</td>
                          <td>
                            <QuantityControl
                              label={card.name}
                              value={quantity}
                              onChange={(n) => onQuantity(card.id, n)}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => onRemove(card.id)}
                              aria-label={`Quitar ${card.name} del pedido`}
                              className="order-remove"
                            >
                              <Trash2 size={17} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="selection-empty-card">
              <span aria-hidden>🎄</span>
              <p>Aún no has elegido tarjetas.</p>
              <a href="#catalogo" className="button button-light">
                Volver al catálogo
              </a>
            </div>
          )}
          <p className="order-total">
            Total: {total} tarjetas ({items.length} diseños)
          </p>
          <div className="order-details">
            <label htmlFor="customer-name">
              ¿A nombre de quién va el pedido? <span>*</span>
            </label>
            <input
              id="customer-name"
              autoComplete="name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Tu nombre"
              maxLength={80}
            />
            <label htmlFor="order-notes">
              Notas <small>(opcional)</small>
            </label>
            <textarea
              id="order-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Detalles para Yaritza"
            />
          </div>
        </Reveal>
        <SectionDivider />
        <Reveal className="contact-copy">
          <p className="eyebrow text-[10px] text-white/75">{CATALOG_COPY.contactEyebrow}</p>
          <h2 className="mt-2 font-script text-5xl text-white sm:text-6xl">
            {CATALOG_COPY.contactHeading}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85">
            {CATALOG_COPY.contactBody}
          </p>
          <div className="contact-actions">
            <a
              href={sendHref}
              onClick={(event) => void sendOrder(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-light"
            >
              <MessageCircle aria-hidden="true" size={18} /> {CATALOG_COPY.whatsappButton}
            </a>
            <button type="button" onClick={downloadOrder} className="button button-translucent">
              Descargar PDF del pedido
            </button>
            <button
              type="button"
              onClick={() => void copyAndInstagram()}
              className="button button-translucent"
            >
              <Instagram aria-hidden="true" size={18} />
              {items.length ? "Copiar pedido y abrir Instagram" : "Instagram"}
            </button>
          </div>
          <p className="order-note">
            El WhatsApp con la lista es lo que recibe Yaritza. El PDF es una hoja de trabajo
            opcional para guardar o imprimir.
          </p>
          <p className="contact-notice" role="status" aria-live="polite">
            {notice}
          </p>
          <div className="contact-links">
            <a
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{INSTAGRAM}
            </a>
            <a
              href={`https://instagram.com/${INSTAGRAM_SECONDARY}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{INSTAGRAM_SECONDARY}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TopBar({ count }: { count: number }) {
  return (
    <header className="top-bar">
      <nav aria-label="Navegación principal" className="top-nav">
        <a href="#inicio" className="font-script text-3xl text-wine">
          Yaritza Madera
        </a>
        <div className="top-links">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a
            href="#bienvenida"
            onClick={() => window.dispatchEvent(new Event("open-catalog-story"))}
          >
            Historia
          </a>
          <a href="#contacto">Contacto</a>
        </div>
        <a href="#contacto" className="button button-primary top-selection">
          Mi pedido <span>{count}</span>
        </a>
      </nav>
    </header>
  );
}
export function BottomBar({ count }: { count: number }) {
  return (
    <nav aria-label="Accesos rápidos" className="bottom-bar">
      <a href="#catalogo">
        <ArrowUp aria-hidden="true" size={17} />
        Catálogo
      </a>
      <a href="#contacto">
        <span className="bottom-order-icon">✦</span>Mi pedido
        {count > 0 && <span className="bottom-count">{count}</span>}
      </a>
      <a href={`https://wa.me/18097561978`} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" size={17} />
        Contactar
      </a>
    </nav>
  );
}

