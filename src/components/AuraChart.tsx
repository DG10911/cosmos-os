/**
 * Radar / "aura" chart — 8 life axes plotted as a glowing gold polygon
 * over concentric guide rings. Used on the Destiny Replay growth slide
 * and the Life Progress dashboard.
 */
export function AuraChart({
  data,
  size = 260,
}: {
  data: { label: string; value: number }[]; // value 0..1
  size?: number;
}) {
  const c = size / 2;
  const r = c - 34;
  const n = data.length;

  const point = (i: number, radius: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: c + radius * Math.cos(a), y: c + radius * Math.sin(a) };
  };

  const poly = data
    .map((d, i) => {
      const p = point(i, r * Math.max(0.08, d.value));
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="aura-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4C430" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8B7CFC" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* guide rings */}
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <polygon
          key={i}
          points={data
            .map((_, j) => {
              const p = point(j, r * f);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* spokes + labels */}
      {data.map((d, i) => {
        const edge = point(i, r);
        const label = point(i, r + 18);
        return (
          <g key={i}>
            <line x1={c} y1={c} x2={edge.x} y2={edge.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text
              x={label.x}
              y={label.y}
              fontSize={size * 0.043}
              fill="#A1A1AA"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* the aura polygon */}
      <polygon
        points={poly}
        fill="url(#aura-fill)"
        stroke="#F4C430"
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 8px rgba(244,196,48,0.5))" }}
      />
      {data.map((d, i) => {
        const p = point(i, r * Math.max(0.08, d.value));
        return <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#F4C430" />;
      })}
    </svg>
  );
}
