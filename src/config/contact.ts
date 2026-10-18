/**
 * Datos de contacto confirmados por Yaritza. El correo queda pendiente de confirmar.
 * No se definen precios, mínimos de compra ni paquetes.
 */
export const WHATSAPP_NUMBER = "18296491680";
export const EMAIL = "[CORREO]";
export const INSTAGRAM = "yaritzamaderacreations";
export const INSTAGRAM_SECONDARY = "mamaandariega";

const hasWhatsAppNumber = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

export function whatsappUrl(message: string) {
  if (!hasWhatsAppNumber) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
