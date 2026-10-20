import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cards } from "@/data/cards";
import { CATALOG_COPY, whatsappUrl } from "@/config/contact";
import { Cluster } from "../decor/Decor";
import { Reveal, SparkleLayer } from "../decor/BrandExperience";

const featured = [cards[19], cards[31], cards[81], cards[25]].filter(Boolean);

export function Hero() {
  const [showBack, setShowBack] = useState(false);
  useEffect(() => {
    const timer = window.setInterval(() => setShowBack((value) => !value), 4800);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-bough hero-bough-left" aria-hidden="true">
        <Cluster />
      </div>
      <div className="hero-bough hero-bough-right" aria-hidden="true">
        <Cluster flip="scale(-1,1)" />
      </div>
      <SparkleLayer />
      <div className="hero-content">
        <Reveal className="hero-copy">
          <p className="eyebrow hero-eyebrow">{CATALOG_COPY.heroEyebrow}</p>
          <h1 className="hero-title">{CATALOG_COPY.title}</h1>
          <p className="hero-subtitle">{CATALOG_COPY.subtitle}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="card-fan" aria-label="Muestra de tarjetas físicas, frente y reverso">
            {featured.map((card, index) => (
              <div
                className={`fan-card fan-card-${index + 1} ${showBack ? "fan-card-show-back" : ""}`}
                key={card!.id}
              >
                <div className="fan-card-inner">
                  <div className="fan-card-side fan-card-front">
                    <img
                      src={card!.front}
                      alt=""
                      width="640"
                      height="480"
                      fetchPriority={index === 1 ? "high" : "auto"}
                    />
                  </div>
                  <div className="fan-card-side fan-card-back">
                    <span>✦</span>
                    <strong>Yaritza Madera</strong>
                    <small>CREATIONS · 2026</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={240} className="hero-actions">
          <a href="#catalogo" className="button button-primary">
            Ver catálogo
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-outline"
          >
            <MessageCircle aria-hidden="true" size={18} /> Consultar
          </a>
        </Reveal>
        <a className="hero-scroll-cue" href="#bienvenida">
          Conoce a Yaritza <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}

