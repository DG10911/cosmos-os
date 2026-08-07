/**
 * Hand-crafted celestial line-art illustrations for onboarding steps.
 * Co-Star-style: thin gold/cosmic strokes on transparent, gently animated.
 */

const stroke = "#F4C430";
const cosmic = "#8B7CFC";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {children}
    </svg>
  );
}

/** Step 1 — a crescent moon with orbiting spark (phone/identity). */
export function ArtMoon() {
  return (
    <Frame>
      <circle cx="80" cy="80" r="52" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <path
        d="M96 44a40 40 0 1 0 0 72 32 32 0 1 1 0-72Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <g style={{ transformOrigin: "80px 80px", animation: "spin-slow 14s linear infinite" }}>
        <circle cx="80" cy="18" r="2.5" fill={cosmic} />
      </g>
      <circle cx="52" cy="60" r="1.5" fill="#fff" opacity="0.7" />
      <circle cx="112" cy="104" r="1.5" fill={stroke} opacity="0.8" />
      <SpinKeyframes />
    </Frame>
  );
}

/** Step 2 — a shield of stars forming a constellation (OTP/trust). */
export function ArtConstellation() {
  const pts = [
    [50, 44], [78, 34], [104, 52], [116, 84], [92, 112], [58, 108], [44, 76],
  ];
  return (
    <Frame>
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={cosmic}
        strokeWidth="1.25"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={i % 2 === 0 ? 2.6 : 1.8}
          fill={i % 2 === 0 ? stroke : "#fff"}
          style={{ animation: `twk 2.4s ${i * 0.2}s ease-in-out infinite` }}
        />
      ))}
      <style>{`@keyframes twk{0%,100%{opacity:.35}50%{opacity:1}}`}</style>
    </Frame>
  );
}

/** Step 3 — a small natal chart wheel (birth details). */
export function ArtWheel() {
  return (
    <Frame>
      <circle cx="80" cy="80" r="54" stroke={stroke} strokeWidth="1.25" fill="none" opacity="0.85" />
      <circle cx="80" cy="80" r="40" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" />
      <circle cx="80" cy="80" r="20" stroke={cosmic} strokeWidth="1" fill="none" opacity="0.7" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={80 + 20 * Math.cos(a)}
            y1={80 + 20 * Math.sin(a)}
            x2={80 + 54 * Math.cos(a)}
            y2={80 + 54 * Math.sin(a)}
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
          />
        );
      })}
      <circle cx="80" cy="80" r="2.5" fill={stroke} />
      <g style={{ transformOrigin: "80px 80px", animation: "spin-slow 20s linear infinite" }}>
        <circle cx="80" cy="26" r="3" fill={cosmic} />
      </g>
      <SpinKeyframes />
    </Frame>
  );
}

/** Step 4 — concentric target of orbits (goals). */
export function ArtOrbits() {
  return (
    <Frame>
      {[54, 40, 26].map((r, i) => (
        <ellipse
          key={i}
          cx="80"
          cy="80"
          rx={r}
          ry={r * 0.6}
          stroke={i === 1 ? stroke : "rgba(139,124,252,0.5)"}
          strokeWidth="1.25"
          fill="none"
          transform={`rotate(${i * 60} 80 80)`}
        />
      ))}
      <circle cx="80" cy="80" r="5" fill={stroke} style={{ filter: `drop-shadow(0 0 6px ${stroke})` }} />
      <circle cx="134" cy="80" r="2.5" fill="#fff" style={{ transformOrigin: "80px 80px", animation: "spin-slow 8s linear infinite" }} />
      <SpinKeyframes />
    </Frame>
  );
}

/** Step 5 — a sunrise over a horizon (daily notification). */
export function ArtSunrise() {
  return (
    <Frame>
      <defs>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} />
          <stop offset="100%" stopColor="#D4A520" />
        </linearGradient>
      </defs>
      <line x1="30" y1="104" x2="130" y2="104" stroke="rgba(255,255,255,0.25)" strokeWidth="1.25" />
      <circle cx="80" cy="104" r="24" fill="url(#sun)" opacity="0.9" style={{ animation: "rise 3s ease-in-out infinite alternate" }} />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 6) * Math.PI;
        return (
          <line
            key={i}
            x1={80 + 30 * Math.cos(Math.PI + a)}
            y1={104 + 30 * Math.sin(Math.PI + a)}
            x2={80 + 40 * Math.cos(Math.PI + a)}
            y2={104 + 40 * Math.sin(Math.PI + a)}
            stroke={stroke}
            strokeWidth="1.25"
            opacity="0.7"
          />
        );
      })}
      <style>{`@keyframes rise{from{transform:translateY(6px)}to{transform:translateY(0)}}`}</style>
    </Frame>
  );
}

function SpinKeyframes() {
  return <style>{`@keyframes spin-slow{to{transform:rotate(360deg)}}`}</style>;
}

export const ONBOARDING_ART = [ArtMoon, ArtConstellation, ArtWheel, ArtOrbits, ArtSunrise];
