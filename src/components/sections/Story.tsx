import { Brush } from "lucide-react";
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
          <Reveal><h2 className="artist-greeting">{CATALOG_COPY.greeting}</h2></Reveal>
          <Reveal delay={100}><p className="artist-welcome">{CATALOG_COPY.welcome}</p></Reveal>
          <Reveal delay={180}><p className="artist-signature">{CATALOG_COPY.signature}</p></Reveal>
          <Reveal delay={240}><a className="artist-eyebrow" href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer">@{INSTAGRAM}</a></Reveal>
        </div>
      </div>
    </section>
  );
}

export function ThankYou() {
  return <footer id="gracias" className="site-footer"><p>Gracias por elegirnos y acompañar nuestro trabajo.</p></footer>;
}
