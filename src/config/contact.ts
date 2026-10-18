/** Datos de contacto y textos editoriales del catálogo. */
export const WHATSAPP_NUMBER = "18296491680";
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

export function buildWhatsAppMessage(names: string[]) {
  const uniqueNames = [...new Set(names)];
  if (!uniqueNames.length) return CATALOG_COPY.noSelection;
  return `${CATALOG_COPY.withSelection}\n${uniqueNames.map((name, index) => `${index + 1}. ${name}`).join("\n")}\n\n${CATALOG_COPY.countLabel}: ${uniqueNames.length}.`;
}

export function whatsappUrl(message: string) {
  const number = hasWhatsAppNumber ? WHATSAPP_NUMBER : "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

