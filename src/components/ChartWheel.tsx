import { useMemo } from "react";

/**
 * Signature natal chart wheel — the defining visual of a premium astrology app.
 * Pure SVG: an outer zodiac ring with the 12 sign glyphs, 12 house spokes,
 * an inner aspect web, and a few planet glyphs placed around the ring.
 * `spin` slowly rotates the outer ring; `size` controls diameter.
 */
const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PLANETS = [
  { glyph: "☉", angle: 18, color: "#F4C430" }, // Sun
  { glyph: "☽", angle: 74, color: "#E8E8F0" }, // Moon
  { glyph: "☿", angle: 132, color: "#8B7CFC" }, // Mercury
  { glyph: "♀", angle: 205, color: "#FB7185" }, // Venus
  { glyph: "♂", angle: 262, color: "#F87171" }, // Mars
  { glyph: "♄", angle: 318, color: "#22D3EE" }, // Saturn
];

export function ChartWheel({
  size = 260,
  spin = true,
}: {
  size?: number;
  spin?: boolean;
}) {
  const c = size / 2;
  const rOuter = c - 4;
  const rSign = c - 20;
  const rZodiacInner = c - 36;
  const rHouseInner = c * 0.34;
  const rPlanet = c * 0.62;

  // pre-compute the aspect web (lines between a few points on the inner circle)
  const web = useMemo(() => {
    const pts = Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      return { x: c + rHouseInner * Math.cos(a), y: c + rHouseInner * Math.sin(a) };
    });
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 2; j < pts.length; j++) {
        if ((i === 0 && j === pts.length - 1)) continue;
        lines.push({ x1: pts[i].x, y1: pts[i].y, x2: pts[j].x, y2: pts[j].y });
      }
    }
    return lines;
  }, [c, rHouseInner]);

  function polar(r: number, deg: number) {
    const a = (deg - 90) * (Math.PI / 180);
    return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="cw-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B7CFC" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#4C1D95" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0B0B14" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cw-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4C430" />
          <stop offset="55%" stopColor="#8B7CFC" />
          <stop offset="100%" stopColor="#F4C430" />
        </linearGradient>
      </defs>

      {/* soft core glow */}
      <circle cx={c} cy={c} r={rZodiacInner} fill="url(#cw-core)" />

      {/* rotating outer assembly */}
      <g
        style={
          spin
            ? { transformOrigin: "center", animation: "cw-spin 90s linear infinite" }
            : undefined
        }
      >
        {/* zodiac ring */}
        <circle cx={c} cy={c} r={rOuter} fill="none" stroke="url(#cw-ring)" strokeWidth="1.5" opacity="0.9" />
        <circle cx={c} cy={c} r={rZodiacInner} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        {/* 12 sign sectors + glyphs */}
        {SIGNS.map((glyph, i) => {
          const deg = i * 30;
          const tick = polar(rOuter, deg);
          const tickIn = polar(rZodiacInner, deg);
          const label = polar(rSign, deg + 15);
          return (
            <g key={i}>
              <line
                x1={tick.x}
                y1={tick.y}
                x2={tickIn.x}
                y2={tickIn.y}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
              />
              <text
                x={label.x}
                y={label.y}
                fontSize={size * 0.05}
                fill="#C7C7D1"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {glyph}
              </text>
            </g>
          );
        })}
      </g>

      {/* house spokes (static) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const deg = i * 30 + 15;
        const a = polar(rZodiacInner, deg);
        const b = polar(rHouseInner, deg);
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(139,124,252,0.16)"
            strokeWidth="1"
          />
        );
      })}

      {/* inner aspect web */}
      <circle cx={c} cy={c} r={rHouseInner} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {web.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(139,124,252,0.22)"
          strokeWidth="0.75"
        />
      ))}

      {/* planets */}
      {PLANETS.map((p, i) => {
        const pt = polar(rPlanet, p.angle);
        return (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r={size * 0.032} fill="#161629" stroke={p.color} strokeWidth="1" />
            <text
              x={pt.x}
              y={pt.y}
              fontSize={size * 0.042}
              fill={p.color}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ filter: `drop-shadow(0 0 4px ${p.color}88)` }}
            >
              {p.glyph}
            </text>
          </g>
        );
      })}

      {/* center */}
      <circle cx={c} cy={c} r={size * 0.02} fill="#F4C430" style={{ filter: "drop-shadow(0 0 6px #F4C430)" }} />

      <style>{`@keyframes cw-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
