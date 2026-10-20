import { Brush, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATALOG_COPY, INSTAGRAM, STORY_COPY } from "@/config/contact";
import { BrushBackdrop, FloatingBadge, Reveal } from "../decor/BrandExperience";

export function Welcome() {
  const [expanded, setExpanded] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeStory = () => {
    setExpanded(false);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  };
  useEffect(() => {
    const openStory = () => {
      setExpanded(true);
      document.querySelector("#bienvenida")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("open-catalog-story", openStory);
    return () => window.removeEventListener("open-catalog-story", openStory);
  }, []);
  return (
    <section id="bienvenida" className="artist-section">
      <div className="artist-layout">
        <Reveal className="artist-portrait-wrap" variant="pop">
          <BrushBackdrop />
          <img
            className="artist-portrait"
            src="/yaritza-madera.webp"
            alt="Yaritza Madera, artista e ilustradora de las tarjetas navideñas"
            width="640"
            height="1138"
            fetchPriority="high"
          />
          <FloatingBadge icon={<span className="badge-medal">20</span>} className="badge-years">
            {CATALOG_COPY.artistBadgeYears}
          </FloatingBadge>
          <FloatingBadge icon={<Brush size={16} />} className="badge-artist">
            {CATALOG_COPY.artistBadgeRole}
          </FloatingBadge>
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
          <Reveal delay={360} className="story-accordion">
            <button
              ref={trigger}
              type="button"
              className="story-trigger"
              aria-expanded={expanded}
              aria-controls="historia-contenido"
              onClick={() => setExpanded((value) => !value)}
            >
              <span>
                <small>Detrás de cada tarjeta</small>
                <strong>Mira mi historia</strong>
              </span>
              {expanded ? <ChevronUp aria-hidden /> : <ChevronDown aria-hidden />}
            </button>
            <div
              id="historia-contenido"
              className="story-content"
              data-open={expanded}
              aria-hidden={!expanded}
              inert={!expanded}
            >
              <div className="story-content-inner">
                <div className="story-content-head">
                  <p>Una vida entre ideas, ilustraciones y tarjetas.</p>
                  <button type="button" onClick={closeStory}>
                    Cerrar historia <ChevronUp size={16} />
                  </button>
                </div>
                <div className="story-prose">
                  <p>{STORY_COPY.welcome}</p>
                  <p>{STORY_COPY.clients}</p>
                  <p>{STORY_COPY.meaning}</p>
                  <p>{STORY_COPY.collection}</p>
                  <h3>¿Quién es Yaritza Madera?</h3>
                  <p>{STORY_COPY.biography}</p>
                  <p>{STORY_COPY.childhood}</p>
                  <p>{STORY_COPY.career}</p>
                  <p>{STORY_COPY.milestone}</p>
                  <p className="story-anniversary">{STORY_COPY.anniversary}</p>
                </div>
                <button type="button" className="story-close-bottom" onClick={closeStory}>
                  Cerrar historia
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
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

