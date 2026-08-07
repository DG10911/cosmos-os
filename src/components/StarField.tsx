import { useMemo } from "react";

/** Randomized twinkling star field. Generated once on mount, positions are deterministic per session. */
export function StarField({ count = 80 }: { count?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 2 + 0.5;
      const isGold = Math.random() < 0.15;
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        color: isGold ? "#F4C430" : "#ffffff",
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
      };
    });
  }, [count]);

  return (
    <div className="star-bg">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: s.color,
            animationDelay: s.delay,
            animationDuration: s.duration,
            boxShadow:
              s.color === "#F4C430" ? "0 0 6px rgba(244,196,48,0.6)" : "0 0 4px rgba(255,255,255,0.4)",
          }}
        />
      ))}
    </div>
  );
}
