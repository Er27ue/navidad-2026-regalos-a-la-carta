import { Brush, Sparkles } from "lucide-react";
import { CATALOG_COPY, INSTAGRAM } from "@/config/contact";
import { BrushBackdrop, FloatingBadge, Reveal } from "../decor/BrandExperience";

export function Welcome() {
  return (
    <section id="bienvenida" className="artist-section">
      <div className="artist-layout">
        <Reveal className="artist-portrait-wrap" variant="pop">
          <BrushBackdrop />
          <img className="artist-portrait" src="/yaritza-madera.svg" alt="Yaritza Madera, artista e ilustradora de las tarjetas navideñas" width="640" height="1138" fetchPriority="high" />
          <FloatingBadge icon={<span className="badge-medal">20</span>} className="badge-years">{CATALOG_COPY.artistBadgeYears}</FloatingBadge>
          <FloatingBadge icon={<Brush size={16} />} className="badge-artist">{CATALOG_COPY.artistBadgeRole}</FloatingBadge>
        </Reveal>
        <div className="artist-copy">
          <Reveal><p className="eyebrow artist-eyebrow">@{INSTAGRAM}</p></Reveal>
          <Reveal delay={120}><h2 className="artist-greeting">{CATALOG_COPY.greeting}</h2></Reveal>
          <Reveal delay={240}><p className="artist-welcome">{CATALOG_COPY.welcome}</p></Reveal>
          <Reveal delay={360}><p className="artist-signature">{CATALOG_COPY.signature}</p></Reveal>
          <Reveal delay={480}><span className="artist-sparkle" aria-hidden="true"><Sparkles size={20} /></span></Reveal>
        </div>
      </div>
    </section>
  );
}

export function ThankYou() {
  return (
    <footer id="gracias" className="site-footer">
      <p>Gracias por elegirnos y acompañar nuestro trabajo.</p>
      <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a>
    </footer>
  );
}

