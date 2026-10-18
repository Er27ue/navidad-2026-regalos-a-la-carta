import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { CSSProperties } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

const draw = (delay = 0, duration = 1.6): { initial: object; animate: object; transition: Transition } => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { delay, duration, ease: EASE }, opacity: { delay, duration: 0.3 } },
});

interface DecorProps {
  className?: string;
  style?: CSSProperties;
  delay?: number;
  sway?: number; // seconds for sway cycle
}

/** Wrapper that sways infinitely from its base. */
export function Sway({ children, duration = 7, deg = 3, origin = "50% 100%", className, style }: {
  children: React.ReactNode; duration?: number; deg?: number; origin?: string; className?: string; style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: origin, ...style }}
      animate={reduce ? undefined : { rotate: [-deg, deg, -deg] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Pine branch: central stem with thin needles. */
export function Pine({ className, style, delay = 0 }: DecorProps) {
  const needles = Array.from({ length: 14 }, (_, i) => i);
  return (
    <svg viewBox="0 0 120 220" className={className} style={style} fill="none" stroke="var(--olive)" strokeWidth={1.4} strokeLinecap="round">
      <motion.path d="M60 215 C 58 150, 62 80, 60 8" {...draw(delay)} />
      {needles.map((i) => {
        const y = 200 - i * 13.5;
        const len = 40 - i * 2;
        return (
          <g key={i}>
            <motion.path d={`M60 ${y} Q ${60 - len * 0.6} ${y - 6}, ${60 - len} ${y - 18}`} {...draw(delay + 0.15 + i * 0.05, 0.9)} />
            <motion.path d={`M60 ${y} Q ${60 + len * 0.6} ${y - 6}, ${60 + len} ${y - 18}`} {...draw(delay + 0.18 + i * 0.05, 0.9)} />
          </g>
        );
      })}
    </svg>
  );
}

/** Branch with berries in circles and oval leaves. */
export function BerryBranch({ className, style, delay = 0 }: DecorProps) {
  const berries = [
    [70, 40], [82, 30], [90, 46], [40, 88], [30, 78], [52, 132], [64, 140], [58, 120],
  ];
  return (
    <svg viewBox="0 0 120 220" className={className} style={style} fill="none" strokeWidth={1.4} strokeLinecap="round">
      <motion.path stroke="var(--berry)" d="M60 215 C 62 170, 55 120, 60 80 S 75 40, 80 30" {...draw(delay)} />
      <motion.path stroke="var(--berry)" d="M58 110 C 48 100, 40 92, 34 82" {...draw(delay + 0.3, 1)} />
      <motion.path stroke="var(--berry)" d="M60 150 C 56 140, 54 135, 54 130" {...draw(delay + 0.4, 1)} />
      <motion.path stroke="var(--olive)" d="M60 180 C 80 170, 95 172, 100 160 C 85 155, 70 165, 60 180Z" {...draw(delay + 0.5, 1)} />
      <motion.path stroke="var(--olive)" d="M61 95 C 40 105, 25 120, 20 115 C 25 100, 45 95, 61 95Z" {...draw(delay + 0.6, 1)} />
      {berries.map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={5.5} stroke="var(--berry)" {...draw(delay + 0.7 + i * 0.06, 0.6)} />
      ))}
    </svg>
  );
}

/** Line-art poinsettia. */
export function Poinsettia({ className, style, delay = 0 }: DecorProps) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="-60 -60 120 120" className={className} style={style} fill="none" stroke="var(--berry)" strokeWidth={1.3} strokeLinejoin="round">
      {petals.map((a, i) => (
        <motion.path key={a} transform={`rotate(${a})`} d="M0 -6 C 10 -20, 8 -40, 0 -55 C -8 -40, -10 -20, 0 -6 M0 -10 L0 -45" {...draw(delay + i * 0.08, 1.1)} />
      ))}
      {[0, 72, 144, 216, 288].map((a, i) => (
        <motion.circle key={a} cx={Math.cos((a * Math.PI) / 180) * 4} cy={Math.sin((a * Math.PI) / 180) * 4} r={2} stroke="var(--olive)" {...draw(delay + 0.8 + i * 0.05, 0.4)} />
      ))}
    </svg>
  );
}

/** Small circle with asterisk, twinkles. */
export function Sparkle({ className, style, delay = 0 }: DecorProps) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="-12 -12 24 24"
      className={className}
      style={style}
      fill="none"
      stroke="var(--berry)"
      strokeWidth={1.2}
      strokeLinecap="round"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={reduce ? { opacity: 0.8 } : { opacity: [0.25, 1, 0.25], scale: [0.85, 1.05, 0.85], y: [0, -6, 0] }}
      transition={{ duration: 4 + (delay % 3), delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle r={10} />
      <path d="M0 -5 V5 M-4.3 -2.5 L4.3 2.5 M-4.3 2.5 L4.3 -2.5" />
    </motion.svg>
  );
}

/** Line gift with bow. */
export function Gift({ className, style, delay = 0 }: DecorProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="none" stroke="var(--wine)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <motion.rect x={14} y={48} width={92} height={62} rx={3} {...draw(delay, 1.2)} />
      <motion.rect x={8} y={34} width={104} height={16} rx={3} {...draw(delay + 0.2, 1.1)} />
      <motion.path d="M60 34 V110 M50 34 V110 M70 34 V110" {...draw(delay + 0.4, 1)} />
      <motion.path d="M60 34 C 40 10, 22 22, 36 32 C 44 36, 54 35, 60 34 C 80 10, 98 22, 84 32 C 76 36, 66 35, 60 34" {...draw(delay + 0.6, 1.2)} />
      <motion.path d="M20 60 L32 72 M24 86 L40 100 M86 62 L98 74 M80 88 L96 102" {...draw(delay + 0.9, 0.8)} />
    </svg>
  );
}

/** Very light falling snow. */
export function FallingSnow({ count = 18 }: { count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 53) % 100;
        const size = 3 + (i % 3) * 2;
        const dur = 12 + (i % 5) * 3;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full border border-olive/40"
            style={{ left: `${left}%`, top: -20, width: size, height: size }}
            animate={{ y: ["0vh", "110vh"], x: [0, i % 2 ? 30 : -30, 0] }}
            transition={{ duration: dur, delay: (i * 0.9) % 10, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}

/** A cluster used in corners: pine + berries + poinsettia. */
export function Cluster({ delay = 0, flip = "", className }: { delay?: number; flip?: string; className?: string }) {
  return (
    <div className={`relative h-64 w-64 md:h-80 md:w-80 ${className ?? ""}`} style={{ transform: flip }}>
      <Sway duration={8.3} deg={3} className="absolute left-4 top-0 w-24 md:w-28" style={{ rotate: "-35deg" }}>
        <Pine delay={delay} />
      </Sway>
      <Sway duration={6.7} deg={4} className="absolute left-24 top-0 w-20 md:w-24" style={{ rotate: "-10deg" }}>
        <BerryBranch delay={delay + 0.3} />
      </Sway>
      <Sway duration={9.4} deg={2} origin="50% 50%" className="absolute left-0 top-28 w-24 md:w-28">
        <Poinsettia delay={delay + 0.6} />
      </Sway>
      <Sway duration={7.6} deg={3} className="absolute left-40 top-0 w-16 md:w-20" style={{ rotate: "20deg" }}>
        <Pine delay={delay + 0.5} />
      </Sway>
    </div>
  );
}
