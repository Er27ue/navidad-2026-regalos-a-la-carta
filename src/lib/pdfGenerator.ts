import jsPDF from "jspdf";
import { CATEGORY_NAMES } from "@/config/contact";
import type { Card } from "@/data/cards";
import type { OrderLine } from "@/components/layout/Navigation";

export interface CompressedImage {
  dataUrl: string;
  width: number;
  height: number;
}

export type CardImageLoader = (card: Card) => Promise<CompressedImage | null>;

// Paleta real del sitio (src/styles.css) en RGB puro (3 enteros)
const PALETTE = {
  cream: [246, 243, 236] as const, // --cream: #f6f3ec
  cardBg: [255, 253, 248] as const, // #fffdf8
  white: [255, 255, 255] as const, // #ffffff
  wine: [143, 48, 66] as const, // --wine: #8f3042
  pine: [44, 89, 61] as const, // --pine: #2c593d
  olive: [108, 120, 80] as const, // --olive: #6c7850
  gold: [189, 146, 80] as const, // --gold: #bd9250
  ink: [56, 56, 56] as const, // --ink: #383838
  border: [226, 217, 205] as const, // #e2d9cd
};

/**
 * Carga la miniatura de una tarjeta en el navegador, aplica su rotación (0, 90, 180, 270)
 * sin tocar el archivo original y la comprime a JPEG (~240px) para que el PDF sea ligero en WhatsApp.
 */
async function browserLoadCardImage(card: Card): Promise<CompressedImage | null> {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const rotation = card.rotation ?? 0;
        const swapDims = rotation === 90 || rotation === 270;
        const srcW = img.naturalWidth || 400;
        const srcH = img.naturalHeight || 500;
        const rotW = swapDims ? srcH : srcW;
        const rotH = swapDims ? srcW : srcH;

        const maxDim = 260;
        const scale = Math.min(1, maxDim / Math.max(rotW, rotH));
        const outW = Math.max(1, Math.round(rotW * scale));
        const outH = Math.max(1, Math.round(rotH * scale));

        const canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);
        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        if (rotation) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        const drawW = swapDims ? outH : outW;
        const drawH = swapDims ? outW : outH;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();

        const dataUrl = canvas.toDataURL("image/jpeg", 0.78);
        resolve({ dataUrl, width: outW, height: outH });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = card.thumb;
  });
}

function drawPageBackgroundAndFrame(doc: jsPDF) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Fondo crema cálido en toda la hoja
  doc.setFillColor(...PALETTE.cream);
  doc.rect(0, 0, pageW, pageH, "F");

  // Marco editorial fino en dorado suave
  doc.setDrawColor(...PALETTE.gold);
  doc.setLineWidth(0.35);
  doc.roundedRect(8, 8, pageW - 16, pageH - 16, 3, 3, "S");
}

function drawHeader(
  doc: jsPDF,
  order: { code: string; customerName: string; notes: string; totalUnits: number; totalDesigns: number },
  dateStr: string,
  isContinuation: boolean,
): number {
  const marginX = 14;
  const contentW = 182;

  // Bloque principal vino
  const bannerH = isContinuation ? 16 : 24;
  doc.setFillColor(...PALETTE.wine);
  doc.roundedRect(marginX, 12, contentW, bannerH, 3, 3, "F");

  // Línea decorativa dorada interna
  doc.setDrawColor(...PALETTE.gold);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX + 1.5, 13.5, contentW - 3, bannerH - 3, 2, 2, "S");

  doc.setTextColor(...PALETTE.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isContinuation ? 11.5 : 14.5);
  doc.text("YARITZA MADERA CREATIONS", marginX + 6, isContinuation ? 21.8 : 21.5);

  if (!isContinuation) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(250, 235, 215);
    doc.text("Catálogo de Tarjetas de Regalo · Navidad 2026", marginX + 6, 28.5);
  }

  // Etiqueta de ID de pedido a la derecha
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isContinuation ? 9.5 : 10.5);
  doc.setTextColor(...PALETTE.white);
  doc.text(`PEDIDO #${order.code}`, marginX + contentW - 6, isContinuation ? 21.8 : 21, {
    align: "right",
  });

  if (!isContinuation) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(250, 235, 215);
    doc.text(dateStr, marginX + contentW - 6, 28.5, { align: "right" });
  }

  if (isContinuation) {
    return 33;
  }

  // Tarjeta de datos del cliente y notas
  let infoY = 39;
  const cleanNotes = order.notes.trim();
  const noteLines: string[] = cleanNotes
    ? (doc.splitTextToSize(`Notas: ${cleanNotes}`, contentW - 12) as string[])
    : [];
  const infoH = 13 + (noteLines.length > 0 ? noteLines.length * 4.2 + 3 : 0);

  doc.setFillColor(...PALETTE.cardBg);
  doc.setDrawColor(...PALETTE.border);
  doc.setLineWidth(0.35);
  doc.roundedRect(marginX, infoY, contentW, infoH, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...PALETTE.wine);
  doc.text("Cliente:", marginX + 5, infoY + 8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...PALETTE.ink);
  doc.text(order.customerName.trim() || "Cliente", marginX + 20, infoY + 8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PALETTE.pine);
  doc.text(
    `Resumen: ${order.totalUnits} ${order.totalUnits === 1 ? "tarjeta" : "tarjetas"} (${order.totalDesigns} ${order.totalDesigns === 1 ? "diseño" : "diseños"})`,
    marginX + contentW - 5,
    infoY + 8,
    { align: "right" },
  );

  if (noteLines.length > 0) {
    doc.setDrawColor(...PALETTE.border);
    doc.line(marginX + 5, infoY + 11.5, marginX + contentW - 5, infoY + 11.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...PALETTE.olive);
    doc.text(noteLines, marginX + 5, infoY + 16);
  }

  return infoY + infoH + 5;
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...PALETTE.olive);
  doc.text(
    "@yaritzamaderacreations · Hoja de pedido generada desde el catálogo web · Navidad 2026",
    14,
    pageH - 11,
  );
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PALETTE.wine);
  doc.text(`Página ${pageNum} de ${totalPages}`, pageW - 14, pageH - 11, { align: "right" });
}

export async function generateOrderPdfBlob(
  order: {
    code: string;
    customerName: string;
    notes: string;
    items: OrderLine[];
  },
  customImageLoader?: CardImageLoader,
): Promise<{ blob: Blob; filename: string }> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const loader = customImageLoader ?? browserLoadCardImage;
  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalDesigns = order.items.length;
  const dateStr = new Intl.DateTimeFormat("es-DO", { dateStyle: "medium" }).format(new Date());

  // Pre-cargar y comprimir las miniaturas en paralelo
  const imageEntries = await Promise.all(
    order.items.map(async (item) => {
      const img = await loader(item.card);
      return [item.card.id, img] as const;
    }),
  );
  const imageMap = new Map<string, CompressedImage | null>(imageEntries);

  const marginX = 14;
  const contentW = 182;
  const pageH = doc.internal.pageSize.getHeight();
  const bottomLimit = pageH - 20;

  // Configuración de cuadrícula tipo "Mi pedido" (3 columnas de celdas visuales)
  const cols = 3;
  const gapX = 4.5;
  const gapY = 4.5;
  const cellW = (contentW - gapX * (cols - 1)) / cols; // ~57.66 mm
  const cellH = 48; // Altura compacta y generosa para que quepan hasta 12 tarjetas por hoja

  drawPageBackgroundAndFrame(doc);
  let cursorY = drawHeader(
    doc,
    {
      code: order.code,
      customerName: order.customerName,
      notes: order.notes,
      totalUnits,
      totalDesigns,
    },
    dateStr,
    false,
  );

  // Título de sección de cuadrícula
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PALETTE.wine);
  doc.text("DETALLE VISUAL DE TARJETAS SELECCIONADAS", marginX, cursorY + 3.5);
  doc.setDrawColor(...PALETTE.gold);
  doc.setLineWidth(0.3);
  doc.line(marginX, cursorY + 5, marginX + contentW, cursorY + 5);
  cursorY += 8;

  for (let i = 0; i < order.items.length; i++) {
    const col = i % cols;
    const isRowStart = col === 0;

    if (isRowStart && cursorY + cellH > bottomLimit - 16) {
      doc.addPage();
      drawPageBackgroundAndFrame(doc);
      cursorY = drawHeader(
        doc,
        {
          code: order.code,
          customerName: order.customerName,
          notes: order.notes,
          totalUnits,
          totalDesigns,
        },
        dateStr,
        true,
      );
    }

    const item = order.items[i]!;
    const cellX = marginX + col * (cellW + gapX);
    const cellY = cursorY;

    // Fondo de la celda
    doc.setFillColor(...PALETTE.cardBg);
    doc.setDrawColor(...PALETTE.border);
    doc.setLineWidth(0.35);
    doc.roundedRect(cellX, cellY, cellW, cellH, 2.5, 2.5, "FD");

    // Marco interior cálido (#f1e8d8) para presentar la tarjeta con su distinción de fondo
    const thumbBoxX = cellX + 3;
    const thumbBoxY = cellY + 3;
    const thumbBoxW = cellW - 6;
    const thumbBoxH = 29;
    doc.setFillColor(241, 232, 216);
    doc.setDrawColor(217, 195, 160);
    doc.setLineWidth(0.25);
    doc.roundedRect(thumbBoxX, thumbBoxY, thumbBoxW, thumbBoxH, 1.8, 1.8, "FD");

    const imgData = imageMap.get(item.card.id);
    if (imgData) {
      const pad = 1.8;
      const maxW = thumbBoxW - pad * 2;
      const maxH = thumbBoxH - pad * 2;
      const ratio = imgData.width / imgData.height;
      let drawW = maxW;
      let drawH = drawW / ratio;
      if (drawH > maxH) {
        drawH = maxH;
        drawW = drawH * ratio;
      }
      const imgX = thumbBoxX + (thumbBoxW - drawW) / 2;
      const imgY = thumbBoxY + (thumbBoxH - drawH) / 2;
      doc.setFillColor(...PALETTE.white);
      doc.setDrawColor(224, 212, 194);
      doc.setLineWidth(0.18);
      doc.roundedRect(imgX - 0.35, imgY - 0.35, drawW + 0.7, drawH + 0.7, 0.8, 0.8, "FD");
      doc.addImage(imgData.dataUrl, "JPEG", imgX, imgY, drawW, drawH, undefined, "FAST");
    }

    // Etiqueta de número de tarjeta (#001) en la esquina superior izquierda
    const cardNumber = `#${String(item.card.order).padStart(3, "0")}`;
    doc.setFillColor(...PALETTE.cream);
    doc.setDrawColor(...PALETTE.border);
    doc.roundedRect(thumbBoxX + 1.2, thumbBoxY + 1.2, 11.5, 5, 1.2, 1.2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(...PALETTE.olive);
    doc.text(cardNumber, thumbBoxX + 6.95, thumbBoxY + 4.6, { align: "center" });

    // Sello de cantidad en alto contraste (vino con texto blanco) en la esquina superior derecha
    const qtyLabel = `x${item.quantity}`;
    const badgeW = Math.max(12, qtyLabel.length * 3.2 + 4);
    const badgeX = thumbBoxX + thumbBoxW - badgeW - 1.2;
    const badgeY = thumbBoxY + 1.2;
    doc.setFillColor(...PALETTE.wine);
    doc.roundedRect(badgeX, badgeY, badgeW, 6, 1.8, 1.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.2);
    doc.setTextColor(...PALETTE.white);
    doc.text(qtyLabel, badgeX + badgeW / 2, badgeY + 4.3, { align: "center" });

    // Categoría secundaria y nombre de la tarjeta debajo de la miniatura
    const metaY = cellY + thumbBoxH + 6.2;
    const categoryText = (CATEGORY_NAMES[item.card.category] ?? item.card.category).toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.3);
    doc.setTextColor(...PALETTE.olive);
    doc.text(categoryText, cellX + 3.5, metaY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...PALETTE.pine);
    doc.text(
      `${item.quantity} ${item.quantity === 1 ? "unidad" : "unidades"}`,
      cellX + cellW - 3.5,
      metaY,
      { align: "right" },
    );

    // Nombre del diseño (truncado suave a 2 líneas si es muy largo)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...PALETTE.ink);
    const titleLines = (doc.splitTextToSize(item.card.name, cellW - 7) as string[]).slice(0, 2);
    doc.text(titleLines, cellX + 3.5, metaY + 4.4);

    // Avanzar cursor al terminar la fila o el último elemento
    if (col === cols - 1 || i === order.items.length - 1) {
      cursorY += cellH + gapY;
    }
  }

  // Barra de TOTAL DEL PEDIDO con alto contraste (Fondo Vino #8f3042 + Texto Blanco/Crema)
  if (cursorY + 20 > bottomLimit) {
    doc.addPage();
    drawPageBackgroundAndFrame(doc);
    cursorY = drawHeader(
      doc,
      {
        code: order.code,
        customerName: order.customerName,
        notes: order.notes,
        totalUnits,
        totalDesigns,
      },
      dateStr,
      true,
    );
  }

  cursorY += 2;
  const totalBarH = 13;
  doc.setFillColor(...PALETTE.wine);
  doc.roundedRect(marginX, cursorY, contentW, totalBarH, 2.5, 2.5, "F");
  doc.setDrawColor(...PALETTE.gold);
  doc.setLineWidth(0.35);
  doc.roundedRect(marginX + 1, cursorY + 1, contentW - 2, totalBarH - 2, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...PALETTE.white);
  doc.text("TOTAL DEL PEDIDO", marginX + 6, cursorY + 8.3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 244, 214);
  doc.text(
    `${totalUnits} ${totalUnits === 1 ? "tarjeta" : "tarjetas"} · ${totalDesigns} ${totalDesigns === 1 ? "diseño seleccionado" : "diseños seleccionados"}`,
    marginX + contentW - 6,
    cursorY + 8.3,
    { align: "right" },
  );

  // Numerar todas las páginas en el pie de página
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    drawFooter(doc, p, pageCount);
  }

  const safeCustomer =
    order.customerName
      .trim()
      .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+/g, "_")
      .replace(/^_+|_+$/g, "") || "Cliente";
  const filename = `Pedido_${order.code}_${safeCustomer}.pdf`;
  const blob = doc.output("blob");
  return { blob, filename };
}
