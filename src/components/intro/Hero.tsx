import { MessageCircle } from "lucide-react";
import { cards } from "@/data/cards";
import { buildWhatsAppMessage, CATALOG_COPY, whatsappUrl } from "@/config/contact";
import { Cluster } from "../decor/Decor";
import { Reveal, SparkleLayer } from "../decor/BrandExperience";

const featured = [cards[19], cards[31], cards[81], cards[25]].filter(Boolean);

export function Hero() {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-bough hero-bough-left" aria-hidden="true"><Cluster /></div>
      <div className="hero-bough hero-bough-right" aria-hidden="true"><Cluster flip="scale(-1,1)" /></div>
      <SparkleLayer />
      <div className="hero-content">
        <Reveal className="hero-copy">
          <p className="eyebrow hero-eyebrow">{CATALOG_COPY.heroEyebrow}</p>
          <h1 className="hero-title"><span className="sr-only">{CATALOG_COPY.title}</span><span aria-hidden="true">{[...CATALOG_COPY.title].map((letter, index) => <span className="hero-letter" style={{ animationDelay: `${index * 85}ms` }} key={`${letter}-${index}`}>{letter}</span>)}</span></h1>
          <p className="hero-subtitle">{CATALOG_COPY.subtitle}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="card-fan" aria-label="Una muestra de tarjetas del catálogo">
            {featured.map((card, index) => <div className={`fan-card fan-card-${index + 1}`} key={card!.id}><img src={card!.image} alt="" width="640" height="480" fetchPriority={index === 1 ? "high" : "auto"} /></div>)}
          </div>
        </Reveal>
        <Reveal delay={240} className="hero-actions">
          <a href="#catalogo" className="button button-primary">Ver catálogo</a>
          <a href={whatsappUrl(buildWhatsAppMessage([]))} target="_blank" rel="noopener noreferrer" className="button button-outline"><MessageCircle aria-hidden="true" size={18} /> Consultar</a>
        </Reveal>
      </div>
    </section>
  );
}

