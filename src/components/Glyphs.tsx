/**
 * Hand-crafted SVG glyphs — real, intentional symbols (no emoji).
 * Astrology + Indian spiritual iconography, drawn as clean vector paths.
 */

type G = { size?: number; className?: string; style?: React.CSSProperties };

/** Streak flame — layered gradient flame with an inner core. */
export function Flame({ size = 20, className, style }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="fl-out" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD86B" />
          <stop offset="0.55" stopColor="#F4C430" />
          <stop offset="1" stopColor="#E8631A" />
        </linearGradient>
        <linearGradient id="fl-in" x1="12" y1="9" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF6D6" />
          <stop offset="1" stopColor="#FF9A3D" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c1.2 3.2-1.8 4.6-1.8 7.2 0 1 .5 1.8 1.2 2.3-.2-1.6.6-2.9 1.6-3.6.1 1.7 1.1 2.3 2.2 3.9 1.6 2.4.9 6.2-1.9 7.7-3.2 1.7-7.5.2-8.4-3.3-.8-3 1-5.2 2.3-7C8.7 6.9 11.4 5.6 12 2Z"
        fill="url(#fl-out)"
      />
      <path
        d="M12.2 11.4c.9.6 1.6 1.7 1.6 3 0 1.6-1.3 2.9-2.9 2.7-1.3-.2-2.2-1.3-2-2.7.2-1.3 1.3-1.8 1.7-3 .5.8 1 1.1 1.6 0Z"
        fill="url(#fl-in)"
      />
    </svg>
  );
}

/** Karma coin — a gold coin with an embossed lotus. */
export function KarmaCoin({ size = 20, className, style }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <defs>
        <radialGradient id="coin" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFE9A6" />
          <stop offset="0.6" stopColor="#F4C430" />
          <stop offset="1" stopColor="#C79312" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#coin)" />
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="#B98410" strokeWidth="0.8" opacity="0.7" />
      {/* lotus petals */}
      <g stroke="#8A5E08" strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M12 8.4c-1 1.2-1 2.8 0 4 1-1.2 1-2.8 0-4Z" />
        <path d="M9.4 9.6c-.3 1.5.4 2.9 1.7 3.6-.1-1.5-.7-2.7-1.7-3.6Z" />
        <path d="M14.6 9.6c.3 1.5-.4 2.9-1.7 3.6.1-1.5.7-2.7 1.7-3.6Z" />
      </g>
      <path d="M8.6 13.4c1.8 1.6 5 1.6 6.8 0" stroke="#8A5E08" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Faceted gemstone (Neelam / ritual product). */
export function Gem({ size = 20, className, style }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <defs>
        <linearGradient id="gem" x1="4" y1="4" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A9C7FF" />
          <stop offset="0.5" stopColor="#5B8BF0" />
          <stop offset="1" stopColor="#2E4EA8" />
        </linearGradient>
      </defs>
      <path d="M7 3h10l4 6-9 12L3 9l4-6Z" fill="url(#gem)" />
      <path d="M3 9h18M7 3l5 6 5-6M12 9v12" stroke="#DCE9FF" strokeWidth="0.7" opacity="0.7" fill="none" />
      <path d="M12 9L7 3M12 9l5-6" stroke="#1E337A" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

/** Diya (oil lamp) — for rituals. */
export function Diya({ size = 20, className, style }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M11.7 4c1 2.2-1.2 3-1.2 4.6 0 .8.6 1.4 1.3 1.4.8 0 1.3-.6 1.2-1.5C15 9.4 15 7 11.7 4Z" fill="#F4C430" />
      <path d="M3 13c1.4 3 5 4.6 9 4.6s7.6-1.6 9-4.6c-2 .8-5 1.2-9 1.2S5 13.8 3 13Z" fill="#C98A3A" />
      <path d="M3 13c2 .8 5 1.2 9 1.2s7-.4 9-1.2" stroke="#F4C430" strokeWidth="0.8" opacity="0.6" fill="none" />
    </svg>
  );
}

/** Lotus — spiritual growth. */
export function Lotus({ size = 20, className, style }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5c-1.6 2-1.6 5 0 7 1.6-2 1.6-5 0-7Z" />
        <path d="M8 8c-.6 2.6.7 5 3 6-.2-2.6-1.2-4.8-3-6Z" />
        <path d="M16 8c.6 2.6-.7 5-3 6 .2-2.6 1.2-4.8 3-6Z" />
        <path d="M4.5 11c.2 2.8 3 5 7.5 5s7.3-2.2 7.5-5c-2 1.4-4.6 2.2-7.5 2.2S6.5 12.4 4.5 11Z" />
      </g>
    </svg>
  );
}

/** Mandala — decorative concentric motif for backgrounds. */
export function Mandala({ size = 200, className, style }: G) {
  const rings = [92, 74, 56, 38, 20];
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className} style={style}>
      {rings.map((r, i) => (
        <circle key={i} cx="100" cy="100" r={r} stroke="currentColor" strokeWidth="0.8" opacity={0.5 - i * 0.06} />
      ))}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={100 + 20 * Math.cos(a)}
            y1={100 + 20 * Math.sin(a)}
            x2={100 + 92 * Math.cos(a)}
            y2={100 + 92 * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.25"
          />
        );
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 100 + 74 * Math.cos(a);
        const y = 100 + 74 * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="4" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />;
      })}
    </svg>
  );
}

/** A small four-point sparkle (replaces the ✨ emoji). */
export function Spark({ size = 16, className, style }: G) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        d="M12 2c.5 4.7 2.3 6.5 7 7-4.7.5-6.5 2.3-7 7-.5-4.7-2.3-6.5-7-7 4.7-.5 6.5-2.3 7-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Om — real Devanagari symbol, rendered as text for authenticity. */
export function Om({ size = 20, className, style }: G) {
  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1, ...style }}
      aria-label="Om"
    >
      ॐ
    </span>
  );
}
