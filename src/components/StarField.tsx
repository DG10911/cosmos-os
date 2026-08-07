import { useMemo } from "react";

/**
 * Warm ambient background — a soft cream wash with a few floating festive
 * sparkle dots (saffron / marigold / gold). Light, cheerful, uncluttered.
 * (Component name kept for compatibility across screens.)
 */
export function StarField({ count = 26 }: { count?: number }) {
  const dots = useMemo(() => {
    const colors = ["#FF6B2C", "#FF9A1F", "#FFC53D"];
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 4 + 2;
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${size}px`,
        color: colors[i % colors.length],
        delay: `${Math.random() * 3}s`,
        duration: `${3 + Math.random() * 3}s`,
      };
    });
  }, [count]);

  return (
    <div className="star-bg">
      {dots.map((d) => (
        <span
          key={d.id}
          className="star"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            opacity: 0.35,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
