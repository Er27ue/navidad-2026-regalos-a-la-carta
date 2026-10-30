import { useMemo, useState } from "react";
import { ArrowUp, Download, Instagram, MessageCircle, Minus, Plus, Share2, Trash2 } from "lucide-react";
import type { Card } from "@/data/cards";
import { generateOrderPdfBlob } from "@/lib/pdfGenerator";
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

  const [isSending, setIsSending] = useState(false);

  const sendOrder = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!items.length) {
      setNotice("Añade al menos una tarjeta a tu pedido.");
      return;
    }
    if (!customerName.trim()) {
      setNotice("Por favor escribe tu nombre para preparar el pedido.");
      document.querySelector<HTMLInputElement>("#customer-name")?.focus();
      return;
    }

    setIsSending(true);
    setNotice("Generando PDF navideño del pedido...");

    try {
      const { blob, filename } = await generateOrderPdfBlob({
        code,
        customerName,
        notes,
        items,
      });

      const file = new File([blob], filename, { type: "application/pdf" });

      // Verificamos si el navegador soporta compartir archivos nativamente (especialmente celulares)
      if (
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] }) &&
        typeof navigator.share === "function"
      ) {
        setNotice("Abriendo menú de compartir... Elige WhatsApp y el chat de Yaritza");
        await navigator.share({
          files: [file],
          title: `Pedido ${code} - ${customerName.trim()}`,
          text: `Hola Yaritza, te adjunto mi pedido ${code} a nombre de ${customerName.trim()}.`,
        });
        setNotice("¡Pedido compartido con éxito!");
      } else {
        // Fallback para computadoras o navegadores sin soporte de compartir archivos (descarga automática + abre chat)
        setNotice("Descargando PDF... Se abrirá WhatsApp para que lo adjuntes en el chat");
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        // Abrir WhatsApp limpio de mamá
        window.setTimeout(() => {
          window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
        }, 1200);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setNotice("Hubo un detalle al compartir. Descargando PDF como respaldo...");
        downloadOrder();
      } else {
        setNotice("");
      }
    } finally {
      setIsSending(false);
    }
  };

  const downloadOrder = async () => {
    if (!items.length) {
      setNotice("Añade al menos una tarjeta para preparar la hoja del pedido.");
      return;
    }
    if (!customerName.trim()) {
      setNotice("Escribe tu nombre para preparar la hoja del pedido.");
      document.querySelector<HTMLInputElement>("#customer-name")?.focus();
      return;
    }

    try {
      setNotice("Preparando descarga del PDF...");
      const { blob, filename } = await generateOrderPdfBlob({
        code,
        customerName,
        notes,
        items,
      });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      setNotice("¡PDF descargado con éxito!");
    } catch {
      setNotice("Error al generar el PDF.");
    }
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
                            <img
                              src={card.thumb}
                              alt=""
                              width="42"
                              height="59"
                              loading="lazy"
                              style={
                                card.rotation
                                  ? { transform: `rotate(${card.rotation}deg)` }
                                  : undefined
                              }
                            />
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
            <button
              type="button"
              onClick={(event) => void sendOrder(event)}
              disabled={isSending}
              className="button button-light flex items-center justify-center gap-2 font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle aria-hidden="true" size={18} />
              {isSending ? "Preparando pedido..." : "Enviar pedido (con PDF adjunto)"}
            </button>
            <button
              type="button"
              onClick={downloadOrder}
              className="button button-translucent flex items-center justify-center gap-2"
            >
              <Download aria-hidden="true" size={16} /> Descargar PDF del pedido
            </button>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-translucent flex items-center justify-center gap-2"
            >
              <MessageCircle aria-hidden="true" size={16} /> Contactar a Yaritza
            </a>
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
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden="true" size={17} />
        Contactar
      </a>
    </nav>
  );
}

