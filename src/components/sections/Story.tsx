import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cluster, EASE, Gift, Sparkle } from "../decor/Decor";

const line = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function LeafFrame({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ y: y1 }} className="absolute -left-24 top-10 opacity-70"><Cluster flip="rotate(-20deg)" /></motion.div>
      <motion.div style={{ y: y2 }} className="absolute -right-24 bottom-0 opacity-70"><Cluster flip="scale(-1,-1)" /></motion.div>
    </div>
  );
}

export function Welcome() {
  const ref = useRef<HTMLElement>(null);
  const paras = [
    "Gracias por escoger nuevamente nuestras tarjetas para acompañar los detalles de tu negocio, tienda, emprendimiento o de manera personal para tus regalitos.",
    "Nuestros clientes han sido nuestros grandes aliados desde el diseño, distribución hasta la gestión de nuestras tarjetas de regalos, las cuales se han convertido desde su primera colocación en 2006, en Farmacias Brasil (hoy Farmacias Carol) en un must para los regalos de las tantas tiendas que hemos acompañado en sus counters al día de hoy.",
    "Una tarjeta de regalo permite a tu cliente, acompañar su regalo, con una imagen, una frase o con un sentimiento en forma de ilustración, lo cual le permite ponerle su voz al detalle a regalar, generando un complemento entre ambos.",
    "Hoy te presentamos nuestro catálogo de tarjetas Navidad 2026, repleto de creatividad, variedad y lo más importante, frases poderosas, acompañadas de diseños chulísimos para esta Navidad.",
  ];
  return (
    <section ref={ref} id="bienvenida" className="relative overflow-hidden bg-[#fbf5ef] px-6 py-24 md:py-36">
      <LeafFrame target={ref} />
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="relative mx-auto max-w-2xl text-center">
        <motion.h2 variants={line} className="eyebrow text-3xl font-semibold text-wine md:text-4xl">¡Hola!</motion.h2>
        {paras.map((p) => (
          <motion.p key={p.slice(0, 12)} variants={line} className="mt-8 text-sm uppercase leading-8 tracking-[0.12em] text-ink md:text-[15px]">{p}</motion.p>
        ))}
        <motion.p variants={line} className="mt-12 font-script text-4xl text-wine">¡Esperamos sea de tu agrado!</motion.p>
      </motion.div>
    </section>
  );
}

export function AboutYaritza() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const paras = [
    "Te cuento que soy Lic. en Publicidad por la Universidad APEC; más adelante realizo una maestría en Comunicación Multimedia, después de haber completado mi bachillerato en el Colegio De La Salle Santiago.",
    "Desde muy pequeña era notorio que las artes y las manualidades eran lo mío: limpieza permanente de paredes en la casa, libros rayados y pintados, amante de la música y el baile; siempre lápiz, crayones o marcadores en mano nunca podían faltar.",
    "Dentro de mi formación profesional están el área de cuentas, relaciones públicas y comunicación en agencias publicitarias y de comunicación.",
    "En 2003 descubro el amplio mundo de las tarjetas y no es hasta 2006 cuando realizo mi primera colocación en tienda, ininterrumpida hasta el día de hoy.",
  ];
  return (
    <section ref={ref} id="yaritza" className="relative bg-[#f0f2e9] px-6 py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <motion.div style={{ y: imgY }} className="relative mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
            className="overflow-hidden rounded-[2rem] shadow-lift"
          >
            <img src="/yaritza.jpg" alt="Yaritza Madera en su estudio" loading="lazy" className="aspect-[3/4] w-full object-cover" />
          </motion.div>
          <Sparkle className="absolute -left-6 -top-6 w-8" />
          <Sparkle className="absolute -bottom-4 -right-4 w-6" delay={1.4} />
          <div className="absolute -bottom-8 -right-10 w-24"><Gift /></div>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <motion.p variants={line} className="eyebrow text-xs text-olive">Conoce a la artista</motion.p>
          <motion.h2 variants={line} className="mt-3 font-script text-5xl text-wine md:text-6xl">¿Quién es Yaritza Madera?</motion.h2>
          {paras.map((p) => (
            <motion.p key={p.slice(0, 12)} variants={line} className="mt-6 leading-8 text-ink">{p}</motion.p>
          ))}
          <motion.div variants={line} className="mt-10 inline-block rounded-full bg-peach px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-wine">
            ¡Este año es nuestro 20 aniversario en el mercado y lo celebramos en grande!
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function ThankYou() {
  return (
    <section id="gracias" className="relative overflow-hidden px-6 py-32 text-center md:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-10 opacity-70"><Cluster flip="rotate(180deg) scale(-1,1)" /></div>
        <div className="absolute -bottom-10 -right-20 opacity-70"><Cluster flip="scale(-1,1)" /></div>
      </div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="relative mx-auto max-w-xl">
        <motion.div variants={line} className="mx-auto w-40"><Gift /></motion.div>
        <motion.h2 variants={line} className="mt-6 font-script text-7xl text-wine md:text-8xl">Gracias</motion.h2>
        <motion.p variants={line} className="mt-6 text-lg leading-8 tracking-wide text-ink">
          Por seguir confiando en nuestros servicios y nuestros diseños para tus clientes
        </motion.p>
        <motion.span variants={line} className="mt-8 inline-block rounded-full bg-peach px-5 py-2 text-sm font-semibold text-wine">Colosenses 3: 23-24</motion.span>
        <motion.p variants={line} className="mt-16 text-xs tracking-[0.3em] text-olive">@yaritzamaderacreations</motion.p>
        <motion.a variants={line} href="#inicio" className="mt-8 inline-flex min-h-12 items-center rounded-full border border-wine/25 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-wine transition-colors hover:bg-wine hover:text-white">Volver al inicio</motion.a>
      </motion.div>
    </section>
  );
}
