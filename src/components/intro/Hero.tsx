import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cards } from "@/data/cards";
import { CATALOG_COPY, whatsappUrl } from "@/config/contact";
import { Cluster } from "../decor/Decor";
import { Reveal, SparkleLayer } from "../decor/BrandExperience";

const featured = [cards[19], cards[31], cards[81], cards[25]].filter(Boolean);

export function Hero() {
  const [activePress, setActivePress] = useState<number | null>(null);

  return (
    <section id="inicio" className="hero-section">
      <div className="hero-bough hero-bough-left pointer-events-none -z-10 opacity-70" aria-hidden="true">
        <Cluster />
      </div>
      <div className="hero-bough hero-bough-right pointer-events-none -z-10 opacity-70" aria-hidden="true">
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
          <div className="card-fan" aria-label="Muestra de tarjetas físicas">
            {featured.map((card, index) => {
              const isPressed = activePress === index;
              return (
                <div
                  className={`fan-card fan-card-${index + 1} ${isPressed ? "fan-card-show-back" : ""} cursor-pointer select-none transition-transform duration-300 active:scale-105`}
                  key={card!.id}
                  onPointerDown={() => setActivePress(index)}
                  onPointerUp={() => setActivePress(null)}
                  onPointerLeave={() => setActivePress(null)}
                  title="Mantén presionado para ver el reverso"
                >
                  <div className="fan-card-inner">
                    <div className="fan-card-side fan-card-front">
                      <img
                        src={card!.front}
                        alt=""
                        width="640"
                        height="480"
                        fetchPriority={index === 1 ? "high" : "auto"}
                        draggable={false}
                      />
                    </div>
                    <div className="fan-card-side fan-card-back">
                      <img
                        src="/cards/back.jpg"
                        alt="Reverso oficial Yaritza Madera Creations"
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-olive/80 mt-2 tracking-wide font-medium">
            ✦ Mantén presionado una tarjeta para ver su reverso ✦
          </p>
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

