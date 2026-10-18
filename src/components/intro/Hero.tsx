import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Cluster, EASE, FallingSnow, Gift, Sparkle } from "../decor/Decor";
import { whatsappUrl } from "@/config/contact";

function Loader() {
  return (
    <motion.div
      key="loader"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE } }}
    >
      <div className="w-28"><Gift /></div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="eyebrow mt-6 text-[10px] text-olive">
        Preparando la magia
      </motion.p>
    </motion.div>
  );
}

export function Hero() {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const spread = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const neg = useTransform(spread, (v) => -v);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>{!ready && <Loader />}</AnimatePresence>
      <section id="inicio" ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-20">
        <FallingSnow />
        {ready && (
          <motion.div style={{ opacity: fade }} aria-hidden className="pointer-events-none absolute inset-0">
            <motion.div style={{ x: neg, y: neg }} className="absolute -left-16 -top-16"><Cluster flip="rotate(180deg) scale(-1,1)" /></motion.div>
            <motion.div style={{ x: spread, y: neg }} className="absolute -right-16 -top-16"><Cluster flip="rotate(180deg)" delay={0.2} /></motion.div>
            <motion.div style={{ x: neg, y: spread }} className="absolute -bottom-16 -left-16"><Cluster delay={0.4} /></motion.div>
            <motion.div style={{ x: spread, y: spread }} className="absolute -bottom-16 -right-16"><Cluster flip="scale(-1,1)" delay={0.6} /></motion.div>
            <Sparkle className="absolute left-[22%] top-[28%] w-6" delay={0.5} />
            <Sparkle className="absolute right-[24%] top-[22%] w-5" delay={1.8} />
            <Sparkle className="absolute bottom-[26%] left-[30%] w-4" delay={2.6} />
            <Sparkle className="absolute bottom-[30%] right-[28%] w-6" delay={1.1} />
          </motion.div>
        )}

        {ready && (
          <motion.div style={{ y: titleY, opacity: fade }} className="relative z-10 text-center">
            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
              className="px-4 font-script text-7xl leading-none text-wine sm:text-8xl md:text-[10rem]"
            >
              Catálogo
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 1.5 }} className="eyebrow mt-6 text-sm text-olive md:text-lg">
              Tarjetas de regalo
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 1.75 }} className="mt-2 text-xl font-medium tracking-wide text-pine md:text-2xl">
              Navidad 2026
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="mt-10 flex items-end justify-center gap-2">
              {[{ w: "w-28 md:w-36", d: 0 }, { w: "w-20 md:w-24", d: 0.8 }].map((g, i) => (
                <motion.div
                  key={i}
                  className={g.w}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: g.d }}
                  whileHover={{ rotate: i ? 8 : -8, transition: { type: "spring", stiffness: 120, damping: 20 } }}
                >
                  <Gift delay={2 + i * 0.3} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#catalogo" className="inline-flex min-h-12 items-center justify-center rounded-full bg-wine px-8 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
                Ver catálogo
              </a>
              <a href={whatsappUrl("Hola Yaritza, quiero elegir tarjetas de regalo navideñas.")} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-wine/35 bg-cream/70 px-8 text-sm font-semibold text-wine transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine">
                Contactar
              </a>
            </div>
          </motion.div>
        )}

        {ready && (
          <motion.a
            href="#catalogo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
            className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-olive"
          >
            <span className="eyebrow text-[10px]">Desliza</span>
            <motion.svg animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M8 1 V20 M2 14 L8 20 L14 14" />
            </motion.svg>
            <span className="mt-3 text-[10px] tracking-[0.25em] text-muted-foreground">@yaritzamaderacreations</span>
          </motion.a>
        )}
      </section>
    </>
  );
}
