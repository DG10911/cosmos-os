import { useMemo } from "react";

/**
 * Layered twinkling star field + drifting aurora + film grain + a slow shooting star.
 * Positions are generated once per mount (deterministic within a session).
 */
export function StarField({ count = 80 }: { count?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 2.2 + 0.4;
      const isGold = Math.random() < 0.16;
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        color: isGold ? "#F4C430" : "#ffffff",
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3.5}s`,
        gold: isGold,
      };
    });
  }, [count]);

  return (
    <>
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
              boxShadow: s.gold
                ? "0 0 8px rgba(244,196,48,0.7)"
                : "0 0 4px rgba(255,255,255,0.5)",
            }}
          />
        ))}
        {/* a single, rare shooting star for life */}
        <span className="shooting-star" style={{ top: "18%", left: "12%" }} />
      </div>
      <div className="grain" />
    </>
  );
}
