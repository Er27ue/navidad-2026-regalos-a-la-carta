/**
 * Actualiza estos tres valores cuando Yaritza confirme los datos de contacto.
 * No se definen precios, mínimos de compra ni paquetes.
 */
export const WHATSAPP_NUMBER = "[NUMERO_CON_CODIGO_DE_PAIS_SIN_SIGNOS]";
export const EMAIL = "[CORREO]";
export const INSTAGRAM = "yaritzamaderacreations";

const hasWhatsAppNumber = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

export function whatsappUrl(message: string) {
  if (!hasWhatsAppNumber) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
