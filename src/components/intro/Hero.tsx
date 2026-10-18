import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cluster, EASE, Gift } from "../decor/Decor";
import { whatsappUrl } from "@/config/contact";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0.12]);

  return (
    <section id="inicio" ref={ref} className="relative flex min-h-[78svh] items-center justify-center overflow-hidden bg-cream px-4 pb-12 pt-20 md:min-h-[82svh] md:px-8">
      <motion.div style={{ opacity: fade }} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44 overflow-hidden sm:h-56 md:h-64">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute -left-8 -top-12 w-44 origin-top-left sm:w-56 md:-left-4 md:w-64"
        >
          <Cluster />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
          className="absolute -right-8 -top-12 w-44 origin-top-right sm:w-56 md:-right-4 md:w-64"
        >
          <Cluster flip="scale(-1,1)" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative z-10 w-full max-w-4xl text-center"
      >
        <p className="eyebrow text-[10px] text-olive sm:text-xs">Yaritza Madera Creations presenta</p>
        <h1 className="mt-4 whitespace-nowrap px-1 pb-[0.12em] font-script text-[clamp(3.65rem,17vw,8rem)] leading-[1.12] text-wine md:mt-2 md:text-[10rem]">
          Catálogo
        </h1>
        <p className="eyebrow mt-2 text-xs text-olive sm:text-sm md:text-lg">Tarjetas de regalo</p>
        <p className="mt-1 text-lg font-medium tracking-wide text-pine sm:text-xl md:text-2xl">Navidad 2026</p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mx-auto mt-5 flex w-28 items-center justify-center sm:w-32"
        >
          <Gift />
        </motion.div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#catalogo" className="inline-flex min-h-12 items-center justify-center rounded-full bg-wine px-8 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
            Ver catálogo
          </a>
          <a href={whatsappUrl("Hola Yaritza, quiero elegir tarjetas de regalo navideñas.")} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-wine/35 bg-cream px-8 text-sm font-semibold text-wine transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
            Contactar
          </a>
        </div>
      </motion.div>
    </section>
  );
}

