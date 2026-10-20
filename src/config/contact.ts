import type { Card, CategoryId } from "@/data/cards";

/** Datos de contacto, textos editoriales y reglas de pedido del catálogo. */
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
  selectionEmpty: "Aún no has elegido tarjetas.",
  contactEyebrow: "Para tu tienda y tus regalos",
  contactHeading: "¿Lista para elegir?",
  contactBody: "Elige tus tarjetas y envía el pedido a Yaritza.",
  whatsappButton: "Enviar pedido por WhatsApp",
  instagramButton: "Instagram",
  instagramCopied: "Lista copiada, pégala en el chat",
  noSelection: "Hola Yaritza, vi el catálogo de Navidad 2026 y quisiera información.",
  countLabel: "Cantidad de diseños",
  marquee: [
    "Feliz Navidad",
    "Hecho con cariño",
    "Ilustraciones para regalar y guardar",
    "Una tarjeta también cuenta una historia",
  ],
} as const;

export const STORY_COPY = {
  welcome:
    "Gracias por escoger nuevamente nuestras tarjetas para acompañar los detalles de tu negocio, emprendimiento o tus regalos personales.",
  clients:
    "Nuestros clientes han sido grandes aliados desde el diseño y la distribución. Desde su primera colocación en 2006, en Farmacias Brasil —hoy Farmacias Carol—, nuestras tarjetas acompañan a las tiendas en sus counters.",
  meaning:
    "Una tarjeta de regalo acompaña un detalle con una imagen, una frase o un sentimiento ilustrado: le permite a quien regala ponerle su voz al regalo.",
  collection:
    "Te presentamos el catálogo de tarjetas de regalo Navidad 2026: creatividad, variedad y frases poderosas junto a diseños para compartir.",
  biography:
    "Soy Licenciada en Publicidad por la Universidad APEC y realicé una maestría en Comunicación Multimedia, después de estudiar en el Colegio De La Salle de Santiago.",
  childhood:
    "Desde pequeña, las artes y las manualidades eran lo mío: paredes limpias por poco tiempo, libros rayados y pintados, música y baile; siempre tenía un lápiz, crayones o marcadores en la mano.",
  career:
    "En mi formación profesional trabajé en cuentas, relaciones públicas y comunicación en agencias publicitarias y de comunicación.",
  milestone:
    "En 2003 descubrí el mundo de las tarjetas. En 2006 hice mi primera colocación en tienda, y desde entonces el trabajo ha continuado sin interrupción.",
  anniversary: "¡Celebramos 20 años en el mercado!",
} as const;

export const CATEGORY_ORDER: CategoryId[] = [
  "iniciales",
  "frases",
  "santa",
  "gnomos",
  "animales",
  "nacimiento",
  "florales",
  "puertas",
  "detalles",
];
export const CATEGORY_NAMES: Record<CategoryId, string> = {
  iniciales: "Letras",
  frases: "Frases",
  santa: "Santa Claus",
  nacimiento: "Natividad",
  florales: "Florales",
  animales: "Animalitos",
  gnomos: "Gnomos y duendes",
  puertas: "Puertas y casas",
  detalles: "Detalles navideños",
};

export type OrderMessage = {
  items: Array<{ card: Card; quantity: number }>;
  customerName: string;
  notes: string;
  code: string;
};
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function hash(text: string) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
  return value >>> 0;
}
export function createOrderCode(
  items: Array<{ card: Card; quantity: number }>,
  customerName: string,
  notes: string,
) {
  const date = new Date();
  const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const seed = hash(
    `${customerName.trim().toLocaleLowerCase()}|${notes.trim()}|${items
      .map(({ card, quantity }) => `${card.id}:${quantity}`)
      .sort()
      .join("|")}`,
  );
  let value = seed;
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix = ALPHABET[value % ALPHABET.length] + suffix;
    value = Math.floor(value / ALPHABET.length);
  }
  return `PED-${monthDay}-${suffix}`;
}

export function buildOrderMessage(order: OrderMessage) {
  if (!order.items.length) return "";
  const groups = new Map<CategoryId, Array<{ card: Card; quantity: number }>>();
  for (const item of order.items)
    groups.set(item.card.category, [...(groups.get(item.card.category) ?? []), item]);
  const rows = CATEGORY_ORDER.flatMap((category) => {
    const group = groups.get(category);
    if (!group?.length) return [];
    return [
      `*${CATEGORY_NAMES[category]}*`,
      ...group
        .sort((a, b) => a.card.name.localeCompare(b.card.name, "es"))
        .map(({ card, quantity }) => `• ${card.name} × ${quantity}`),
      "",
    ];
  });
  const total = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return [
    `Hola Yaritza 👋, quisiera hacer este pedido:`,
    "",
    `🎄 *Pedido ${order.code}*`,
    `*A nombre de:* ${order.customerName.trim()}`,
    "",
    ...rows,
    `*Total: ${total} ${total === 1 ? "tarjeta" : "tarjetas"} (${order.items.length} ${order.items.length === 1 ? "diseño" : "diseños"})*`,
    ...(order.notes.trim() ? ["", `*Notas:* ${order.notes.trim()}`] : []),
    "",
    "¡Gracias!",
  ].join("\n");
}

export function whatsappUrl(message?: string) {
  return message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;
}

