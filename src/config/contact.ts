/** Datos de contacto y textos editoriales del catálogo. */
export const WHATSAPP_NUMBER = "18097561978";
export const EMAIL = "[CORREO]";
export const INSTAGRAM = "yaritzamaderacreations";
export const INSTAGRAM_SECONDARY = "mamaandariega";

export const CATALOG_COPY = {
  title: "Catálogo",
  heroEyebrow: "Yaritza Madera Creations presenta",
  subtitle: "Tarjetas de regalo · Navidad 2026",
  greeting: "¡Hola!",
  welcome: "Qué alegría compartir esta Navidad contigo.",
  signature: "— Yaritza Madera",
  artistBadgeYears: "20 años creando",
  artistBadgeRole: "Artista e ilustradora",
  catalogHeading: "Nuestras tarjetas",
  selectionEmpty: "Aún no guardas tarjetas. Toca el corazón de tus favoritas y aparecerán aquí.",
  contactEyebrow: "Para tu tienda y tus regalos",
  contactHeading: "¿Lista para elegir?",
  contactBody: "Escríbenos y te ayudamos a elegir tus diseños.",
  whatsappButton: "WhatsApp",
  instagramButton: "Mensaje por Instagram",
  instagramCopied: "Mensaje copiado, pégalo en el chat",
  noSelection: "Hola, vi el catálogo navideño y quiero información",
  withSelection: "Hola Yaritza, me interesan estos diseños del catálogo Navidad 2026:",
  countLabel: "Cantidad de diseños",
  marquee: [
    "Feliz Navidad",
    "Hecho con cariño",
    "Ilustraciones para regalar y guardar",
    "Una tarjeta también cuenta una historia",
  ],
} as const;

const hasWhatsAppNumber = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

export type OrderMessageItem = { name: string; quantity: number };

export function createOrderCode() {
  const date = new Date();
  const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 4).toUpperCase().padEnd(2, "X");
  return `PED-${monthDay}-${suffix}`;
}

export function buildOrderMessage(items: OrderMessageItem[], code = createOrderCode()) {
  const lines = items.filter((item) => item.quantity > 0);
  if (!lines.length) return "";
  const total = lines.reduce((sum, item) => sum + item.quantity, 0);
  return `Hola Yaritza, quisiera hacer este pedido (${code}):\n\n${lines.map((item) => `• ${item.name} × ${item.quantity}`).join("\n")}\n\nTotal: ${total} tarjetas\nGracias.`;
}

export function whatsappUrl(message?: string) {
  const number = hasWhatsAppNumber ? WHATSAPP_NUMBER : "";
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
}
