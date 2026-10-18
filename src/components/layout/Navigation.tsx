import { motion } from "framer-motion";
import { ArrowUp, Instagram, Mail, MessageCircle, Sparkles } from "lucide-react";
import { EMAIL, INSTAGRAM, whatsappUrl } from "@/config/contact";

const requestMessage = "Hola Yaritza, quiero elegir tarjetas de regalo navideñas.";

export function ContactSection() {
  const emailReady = EMAIL.includes("@") && !EMAIL.startsWith("[");
  return (
    <section id="contacto" className="relative overflow-hidden bg-wine px-5 py-20 text-primary-foreground md:px-8 md:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-14 -top-16 h-56 w-56 rounded-full border border-white/10 md:h-72 md:w-72" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-14 h-64 w-64 rounded-full border border-white/10" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="eyebrow text-[10px] text-white/75">Para tu tienda y tus regalos</p>
        <h2 className="mt-3 font-script text-6xl md:text-7xl">¿Listo para elegir?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/85 md:text-base">
          Escríbenos y te ayudamos a elegir los diseños para tu tienda.
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          <a
            href={whatsappUrl(requestMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-wine transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <MessageCircle aria-hidden className="h-5 w-5" /> WhatsApp
          </a>
          <a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Instagram aria-hidden className="h-5 w-5" /> Instagram
          </a>
          {emailReady ? (
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Mail aria-hidden className="h-5 w-5" /> Correo
            </a>
          ) : (
            <span className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-4 text-sm text-white/70" aria-label="Correo pendiente de configurar">
              <Mail aria-hidden className="h-5 w-5" /> Correo por confirmar
            </span>
          )}
        </div>
        {/* [PENDIENTE] Confirmar precios, pedido mínimo y paquetes antes de publicar esa información. */}
      </motion.div>
    </section>
  );
}

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 hidden border-b border-wine/10 bg-cream/90 px-8 py-3 backdrop-blur-md md:block">
      <nav aria-label="Navegación principal" className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#inicio" className="font-script text-3xl text-wine">Yaritza Madera</a>
        <div className="flex items-center gap-8 text-xs font-medium uppercase tracking-[0.16em] text-ink">
          <a className="min-h-11 content-center transition-colors hover:text-wine" href="#inicio">Inicio</a>
          <a className="min-h-11 content-center transition-colors hover:text-wine" href="#catalogo">Catálogo</a>
          <a className="min-h-11 content-center transition-colors hover:text-wine" href="#contacto">Contacto</a>
        </div>
        <a href="#catalogo" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-wine px-5 text-xs font-semibold uppercase tracking-wider text-white">
          <Sparkles aria-hidden className="h-4 w-4" /> Ver diseños
        </a>
      </nav>
    </header>
  );
}

export function BottomBar() {
  return (
    <nav aria-label="Accesos rápidos" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-wine/10 bg-cream/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(59,59,59,0.08)] backdrop-blur-md md:hidden">
      <a href="#catalogo" className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink"><Sparkles aria-hidden className="h-4 w-4 text-olive" />Catálogo</a>
      <a href="#eleccion" className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink"><ArrowUp aria-hidden className="h-4 w-4 text-olive" />Explorar</a>
      <a href="#contacto" className="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink"><MessageCircle aria-hidden className="h-4 w-4 text-wine" />Contactar</a>
    </nav>
  );
}
