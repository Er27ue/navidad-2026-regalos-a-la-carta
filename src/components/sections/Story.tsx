import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CATALOG_COPY, INSTAGRAM } from "@/config/contact";
import { BrushBackdrop, Reveal } from "../decor/BrandExperience";

// Contenido fiel de la historia tomado directamente del PDF de Yaritza Madera
const STORY_PAGES = [
  {
    title: "¡Hola!",
    subtitle: "20 Años Creando",
    content: (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-relaxed sm:text-base text-ink/90">
          Gracias por escoger nuevamente nuestras tarjetas para acompañar los detalles de tu negocio, tienda, emprendimiento o de manera personal para tus regalitos.
        </p>
        <p className="text-sm leading-relaxed sm:text-base text-ink/80">
          Nuestros clientes han sido nuestros grandes aliados desde el diseño, distribución hasta la gestión de nuestras tarjetas de regalos, las cuales se han convertido desde su primera colocación en 2006 en Farmacias Carol en un must para los regalos en sus counters.
        </p>
      </div>
    ),
  },
  {
    title: "¿Quién es Yaritza Madera?",
    subtitle: "Pasión por el arte y el diseño",
    content: (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-relaxed sm:text-base text-ink/90">
          Soy Lic. en Publicidad por la Universidad APEC y realicé una Maestría en Comunicación Multimedia, tras completar el bachillerato en el Colegio De La Salle Santiago.
        </p>
        <p className="text-sm leading-relaxed sm:text-base text-ink/80">
          Desde muy pequeña las artes y manualidades eran lo mío: paredes limpias por poco tiempo, libros rayados y pintados, música y baile... siempre un lápiz, crayones o marcadores en mano.
        </p>
      </div>
    ),
  },
  {
    title: "Una Trayectoria de Amor",
    subtitle: "Celebración y Gratitud",
    content: (
      <div className="space-y-4 text-center">
        <p className="text-sm leading-relaxed sm:text-base text-ink/90">
          En 2003 descubro el amplio mundo de las tarjetas y en 2006 realizo mi primera colocación en tienda, ininterrumpida hasta el día de hoy.
        </p>
        <div className="py-2">
          <span className="inline-block rounded-full bg-wine/10 px-4 py-2 font-semibold text-wine text-sm">
            ✨ ¡Este año es nuestro 20 aniversario en el mercado!
          </span>
        </div>
        <p className="text-xs text-olive italic">
          "Una tarjeta le permite a quien regala ponerle su voz al detalle a regalar."
        </p>
      </div>
    ),
  },
];

export function Welcome() {
  const [openStory, setOpenStory] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Bloquear el scroll de la página cuando el overlay esté abierto sin perder posición
  useEffect(() => {
    if (openStory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openStory]);

  // Soporte para tecla Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenStory(false);
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(STORY_PAGES.length - 1, p + 1));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(0, p - 1));
    };
    if (openStory) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openStory]);

  return (
    <section id="bienvenida" className="artist-section relative">
      <div className="artist-layout">
        <Reveal className="artist-portrait-wrap" variant="pop">
          <BrushBackdrop />
          <img
            className="artist-portrait rounded-2xl shadow-sm"
            src={`${import.meta.env.BASE_URL || "/"}yaritza.jpg`}
            alt="Yaritza Madera, artista e ilustradora"
            width="360"
            height="480"
            fetchPriority="high"
          />
        </Reveal>

        <div className="artist-copy">
          <Reveal>
            <h2 className="artist-greeting">{CATALOG_COPY.greeting}</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="artist-welcome">{CATALOG_COPY.welcome}</p>
          </Reveal>
          <Reveal delay={240}>
            <p className="artist-signature">{CATALOG_COPY.signature}</p>
            <a
              className="artist-eyebrow"
              href={`https://instagram.com/${INSTAGRAM}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{INSTAGRAM}
            </a>
          </Reveal>

          {/* Botón viñeta para abrir la historia emergente */}
          <Reveal delay={360} className="mt-6">
            <button
              type="button"
              onClick={() => {
                setCurrentPage(0);
                setOpenStory(true);
              }}
              className="group flex w-full max-w-sm items-center justify-between rounded-2xl border border-wine/20 bg-white/80 p-4 text-left shadow-sm backdrop-blur-sm transition-all hover:border-wine/40 hover:bg-white hover:shadow-md"
            >
              <div>
                <small className="block text-xs uppercase tracking-wider text-olive font-semibold">
                  Detrás de cada tarjeta
                </small>
                <strong className="text-lg text-wine group-hover:underline">
                  Mira mi historia ✨
                </strong>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach/40 text-wine transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </Reveal>
        </div>
      </div>

      {/* OVERLAY TIPO LIBRO (EMERGENTE FIXED) */}
      <AnimatePresence>
        {openStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscurecido con cierre al tocar fuera */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenStory(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Ventana flotante estilo libro */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-[#FAF7F2] p-6 shadow-2xl sm:p-8 border border-wine/10"
              role="dialog"
              aria-modal="true"
              aria-label="Historia de Yaritza Madera"
            >
              {/* Botón cerrar X */}
              <button
                type="button"
                onClick={() => setOpenStory(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-wine/10 text-wine hover:bg-wine/20 transition-colors"
                aria-label="Cerrar historia"
              >
                <X size={18} />
              </button>

              {/* Encabezado del libro */}
              <div className="text-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-olive">
                  {STORY_PAGES[currentPage]!.subtitle}
                </span>
                <h3 className="font-script text-3xl sm:text-4xl text-wine mt-1">
                  {STORY_PAGES[currentPage]!.title}
                </h3>
              </div>

              {/* Contenido deslizable de la página con altura fija estable para evitar saltos */}
              <div className="h-[180px] sm:h-[160px] flex items-center justify-center px-2 overflow-y-auto">
                {STORY_PAGES[currentPage]!.content}
              </div>

              {/* Controles de página e indicador de libro */}
              <div className="mt-8 flex items-center justify-between border-t border-wine/10 pt-4">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-wine disabled:opacity-30 disabled:pointer-events-none hover:bg-wine/10 transition-colors"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>

                {/* Indicador de página (Puntos) */}
                <div className="flex gap-2">
                  {STORY_PAGES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPage(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentPage === i ? "w-6 bg-wine" : "w-2.5 bg-wine/25"
                      }`}
                      aria-label={`Página ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === STORY_PAGES.length - 1}
                  onClick={() => setCurrentPage((p) => Math.min(STORY_PAGES.length - 1, p + 1))}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-wine disabled:opacity-30 disabled:pointer-events-none hover:bg-wine/10 transition-colors"
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function ThankYou() {
  return (
    <footer id="gracias" className="site-footer">
      <p>Gracias por elegirnos y acompañar nuestro trabajo.</p>
      <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">
        @{INSTAGRAM}
      </a>
    </footer>
  );
}
