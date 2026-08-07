import { useEffect, useState } from "react";

/** Lightweight CSS confetti burst — no dependency. Renders for ~2.4s then unmounts itself. */
export function Confetti({ fire }: { fire: number }) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; delay: number; color: string; rot: number }[]
  >([]);

  useEffect(() => {
    if (fire === 0) return;
    const colors = ["#F4C430", "#8B7CFC", "#4ADE80", "#ffffff", "#F87171"];
    const next = Array.from({ length: 60 }).map((_, i) => ({
      id: fire * 1000 + i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      color: colors[i % colors.length],
      rot: Math.random() * 360,
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 2600);
    return () => clearTimeout(t);
  }, [fire]);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-10px",
            left: `${p.left}%`,
            width: "8px",
            height: "12px",
            background: p.color,
            transform: `rotate(${p.rot}deg)`,
            animation: `confetti-fall 2.4s cubic-bezier(0.3,0.6,0.4,1) ${p.delay}s forwards`,
            borderRadius: "2px",
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
