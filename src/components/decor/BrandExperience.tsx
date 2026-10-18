import { useEffect, useRef, useState, type ReactNode } from "react";
import { CATALOG_COPY } from "@/config/contact";

export function Reveal({ children, className = "", delay = 0, variant = "lift" }: { children: ReactNode; className?: string; delay?: number; variant?: "lift" | "pop" }) {
  const element = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = element.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={element} data-revealed={visible} data-reveal={variant} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties} className={`reveal ${className}`}>{children}</div>;
}

export function Marquee() {
  return (
    <div className="marquee-band" aria-label={CATALOG_COPY.marquee.join(" · ")}>
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => <div className="marquee-group" key={copy}>{CATALOG_COPY.marquee.map((phrase) => <span className="marquee-phrase" key={phrase}>{phrase}<span className="marquee-star">✦</span></span>)}</div>)}
      </div>
    </div>
  );
}

export function SparkleLayer() {
  return <div className="sparkle-layer" aria-hidden="true">{[["12%", "24%"], ["86%", "35%"], ["76%", "78%"], ["18%", "74%"]].map(([left, top], index) => <svg key={left} className={`sparkle sparkle-${index + 1}`} style={{ left, top }} viewBox="0 0 24 24"><path d="M12 0 14.1 9.9 24 12l-9.9 2.1L12 24l-2.1-9.9L0 12l9.9-2.1L12 0Z" /></svg>)}</div>;
}

export function BrushBackdrop() {
  return <svg aria-hidden="true" className="artist-brush" viewBox="0 0 420 480" preserveAspectRatio="none"><path d="M73 25C155-3 295 8 355 57c55 45 54 133 34 216-19 82-88 174-173 190-87 16-183-49-205-130C-12 250 5 75 73 25Z" /><path className="brush-dry" d="m57 66 31-18m-65 81 27-12m330 17 25 17m-27 198 30 12M85 423l37 22" /></svg>;
}

export function FloatingBadge({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return <div className={`floating-badge ${className}`}><span className="floating-badge-icon" aria-hidden="true">{icon}</span><span>{children}</span></div>;
}

export function SectionDivider() {
  return <div className="section-bow" aria-hidden="true"><svg viewBox="0 0 36 28"><path d="M18 13C13 6 4 4 4 10c0 5 7 6 14 3 7 3 14 2 14-3 0-6-9-4-14 3Zm0 0-5 12m5-12 6 12" /></svg></div>;
}

export function HollyBranch({ className = "" }: { className?: string }) {
  return <svg aria-hidden="true" viewBox="0 0 128 86" className={`holly-branch ${className}`} fill="none"><path d="M5 77C37 54 72 34 121 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><path d="M32 59c-3-16-17-22-25-17 4 8 11 14 25 17Zm20-15c0-17 11-26 21-23-2 10-8 18-21 23Zm19-11c2 15 14 22 23 17-4-9-11-15-23-17Zm17-9c0-11 8-19 16-17-2 8-7 13-16 17Z" fill="currentColor" /><g fill="#9d3342"><circle cx="47" cy="31" r="4"/><circle cx="55" cy="27" r="3.5"/><circle cx="53" cy="36" r="3"/></g></svg>;
}

