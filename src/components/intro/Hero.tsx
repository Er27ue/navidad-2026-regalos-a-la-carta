import { MessageCircle } from "lucide-react";
import { CATALOG_COPY, whatsappUrl } from "@/config/contact";
import { Cluster, Gift } from "../decor/Decor";
import { Reveal, SparkleLayer } from "../decor/BrandExperience";

export function Hero() {
  return (
    <section id="inicio" className="hero-section overflow-hidden">
      <div className="hero-bough hero-bough-left pointer-events-none -z-10 opacity-75" aria-hidden="true">
        <Cluster />
      </div>
      <div className="hero-bough hero-bough-right pointer-events-none -z-10 opacity-75" aria-hidden="true">
        <Cluster flip="scale(-1,1)" />
      </div>
      <SparkleLayer />
      <div className="hero-content">
        <Reveal className="hero-copy">
          <p className="eyebrow hero-eyebrow">{CATALOG_COPY.heroEyebrow}</p>
          <h1 className="hero-title">{CATALOG_COPY.title}</h1>
          <p className="hero-subtitle">{CATALOG_COPY.subtitle}</p>
        </Reveal>

        <Reveal delay={120} className="my-5 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-peach/20 sm:h-28 sm:w-28">
            <Gift className="h-20 w-20 sm:h-24 sm:w-24" />
          </div>
        </Reveal>

        <Reveal delay={200} className="hero-actions">
          <a href="#catalogo" className="button button-primary">
            Ver catálogo
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-outline"
          >
            <MessageCircle aria-hidden="true" size={18} /> Contactar
          </a>
        </Reveal>
        <a className="hero-scroll-cue" href="#bienvenida">
          Conoce a Yaritza <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
