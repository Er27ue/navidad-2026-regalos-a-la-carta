import jsPDF from "jspdf";
import type { OrderLine } from "@/components/layout/Navigation";

export async function generateOrderPdfBlob(order: {
  code: string;
  customerName: string;
  notes: string;
  items: OrderLine[];
}): Promise<{ blob: Blob; filename: string }> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const total = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const dateStr = new Intl.DateTimeFormat("es-DO", { dateStyle: "long" }).format(new Date());

  // Encabezado navideño
  doc.setFillColor(155, 58, 75); // Color vino
  doc.rect(0, 0, 210, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("YARITZA MADERA CREATIONS", 15, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Catálogo Tarjetas de Regalo · Navidad 2026", 15, 18);

  doc.setFont("helvetica", "bold");
  doc.text(`PEDIDO: ${order.code}`, 155, 15);

  // Datos del cliente
  doc.setTextColor(50, 40, 39);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Cliente:`, 15, 34);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.customerName.trim()}`, 35, 34);

  doc.setFont("helvetica", "bold");
  doc.text(`Fecha:`, 155, 34);
  doc.setFont("helvetica", "normal");
  doc.text(`${dateStr}`, 170, 34);

  // Cuadrícula / Tabla tipo lista de compras navideña
  let startY = 44;
  doc.setFillColor(245, 240, 232);
  doc.rect(15, startY, 180, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(120, 40, 55);
  doc.text("#", 18, startY + 5.5);
  doc.text("Tarjeta / Modelo", 32, startY + 5.5);
  doc.text("Categoría", 110, startY + 5.5);
  doc.text("Cantidad", 165, startY + 5.5);

  startY += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 40, 39);

  let pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i]!;

    // Salto de página si se acerca al final
    if (startY > pageHeight - 35) {
      doc.addPage();
      startY = 20;
    }

    // Fila cebra suave
    if (i % 2 === 1) {
      doc.setFillColor(252, 250, 246);
      doc.rect(15, startY, 180, 7.5, "F");
    }

    doc.setFontSize(9);
    doc.text(String(i + 1), 18, startY + 5);
    doc.text(item.card.name, 32, startY + 5);
    doc.text(item.card.category, 110, startY + 5);
    doc.setFont("helvetica", "bold");
    doc.text(`${item.quantity} ud(s)`, 165, startY + 5);
    doc.setFont("helvetica", "normal");

    // Línea separadora
    doc.setDrawColor(230, 225, 220);
    doc.line(15, startY + 7.5, 195, startY + 7.5);
    startY += 7.5;
  }

  // Resumen final
  startY += 5;
  if (startY > pageHeight - 35) {
    doc.addPage();
    startY = 20;
  }

  doc.setFillColor(155, 58, 75, 0.1);
  doc.rect(15, startY, 180, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(155, 58, 75);
  doc.text(`TOTAL DEL PEDIDO: ${total} tarjetas (${order.items.length} diseños)`, 18, startY + 6.5);

  if (order.notes.trim()) {
    startY += 15;
    doc.setFontSize(9);
    doc.setTextColor(80, 70, 65);
    doc.setFont("helvetica", "bold");
    doc.text("Notas adicionales:", 18, startY);
    doc.setFont("helvetica", "normal");
    doc.text(order.notes.trim(), 18, startY + 5);
  }

  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(150, 140, 135);
  doc.text(
    `@yaritzamaderacreations · Pedido oficial generado desde el catálogo web · Gracias por tu confianza`,
    15,
    pageHeight - 10
  );

  const filename = `Pedido_${order.code}_${order.customerName.trim().replace(/\s+/g, "_")}.pdf`;
  const blob = doc.output("blob");
  return { blob, filename };
}
