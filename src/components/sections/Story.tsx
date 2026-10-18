import { motion } from "framer-motion";
import { EASE } from "../decor/Decor";

const reveal = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.45 },
  transition: { duration: 0.65, ease: EASE },
};

export function Welcome() {
  const paragraphs = [
    "Gracias por elegir nuestras tarjetas para acompañar los regalos de tu tienda, emprendimiento o familia.",
    "Cada diseño suma una ilustración y un mensaje que hace más especial el regalo.",
    "Descubre Navidad 2026: tarjetas variadas y frases para compartir.",
  ];

  return (
    <section id="bienvenida" className="bg-cream px-5 py-10 sm:py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <motion.h2 {...reveal} className="font-script text-5xl text-wine sm:text-6xl">¡Hola!</motion.h2>
        <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.08 }} className="mt-1 text-sm text-olive sm:text-base">
          Qué alegría compartir esta Navidad contigo.
        </motion.p>
        <div className="mt-5 space-y-2.5">
          {paragraphs.map((paragraph, index) => (
            <motion.p key={paragraph} {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className="text-sm leading-6 text-ink sm:text-base">
              {paragraph}
            </motion.p>
          ))}
        </div>
        <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="mt-5 text-sm font-semibold text-wine">
          — Yaritza Madera, artista e ilustradora
        </motion.p>
      </div>
    </section>
  );
}

export function AboutYaritza() {
  return (
    <section id="yaritza" className="bg-cream px-5 pb-3 pt-1 text-center md:px-8">
      <motion.p {...reveal} className="mx-auto max-w-xl rounded-2xl border border-[#bd9250]/30 bg-white/55 px-4 py-3 text-sm leading-6 text-ink sm:text-base">
        <span className="font-semibold text-wine">20 años creando tarjetas de regalo.</span>{" "}
        Gracias por ser parte de esta historia.
      </motion.p>
    </section>
  );
}

export function ThankYou() {
  return (
    <footer id="gracias" className="border-t border-white/15 bg-wine px-5 py-5 text-center text-white/85">
      <p className="text-sm">Gracias por elegirnos y acompañar nuestro trabajo.</p>
      <p className="mt-1 text-xs text-white/65">@yaritzamaderacreations</p>
    </footer>
  );
}

