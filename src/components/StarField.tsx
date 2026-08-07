import { useMemo } from "react";

type Daypart = "morning" | "afternoon" | "evening" | "night";

function daypart(): Daypart {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

/** Living sky per time of day — sunrise, warm sun, sunset, galaxy. */
const SKY: Record<Daypart, { bg: string; dotColors: string[]; dotOpacity: number }> = {
  morning: {
    bg: [
      "radial-gradient(900px 600px at 50% -10%, rgba(255,183,77,0.28), transparent 60%)",
      "radial-gradient(800px 500px at 12% 0%, rgba(244,114,182,0.14), transparent 55%)",
      "radial-gradient(700px 700px at 50% 118%, rgba(124,58,237,0.05), transparent 60%)",
      "#FFF6EC",
    ].join(","),
    dotColors: ["#FF9A1F", "#FFC53D", "#F472B6"],
    dotOpacity: 0.35,
  },
  afternoon: {
    bg: [
      "radial-gradient(900px 600px at 8% -8%, rgba(255,154,31,0.16), transparent 55%)",
      "radial-gradient(800px 600px at 100% 4%, rgba(255,107,44,0.10), transparent 52%)",
      "radial-gradient(700px 700px at 50% 118%, rgba(124,58,237,0.06), transparent 60%)",
      "#FFF6EC",
    ].join(","),
    dotColors: ["#FF6B2C", "#FF9A1F", "#FFC53D"],
    dotOpacity: 0.35,
  },
  evening: {
    bg: [
      "radial-gradient(900px 620px at 50% -12%, rgba(244,63,110,0.20), transparent 58%)",
      "radial-gradient(800px 560px at 90% 0%, rgba(255,107,44,0.18), transparent 55%)",
      "radial-gradient(760px 700px at 50% 120%, rgba(124,58,237,0.10), transparent 60%)",
      "#FFF1E6",
    ].join(","),
    dotColors: ["#F43F6E", "#FF9A1F", "#FFC53D"],
    dotOpacity: 0.4,
  },
  night: {
    bg: [
      "radial-gradient(900px 620px at 50% -10%, rgba(124,58,237,0.16), transparent 60%)",
      "radial-gradient(760px 560px at 88% 8%, rgba(244,63,110,0.08), transparent 55%)",
      "radial-gradient(760px 700px at 50% 120%, rgba(255,154,31,0.08), transparent 60%)",
      "#F6F0FA",
    ].join(","),
    dotColors: ["#7C3AED", "#FFC53D", "#C4B5FD"],
    dotOpacity: 0.5,
  },
};

/**
 * Living ambient sky — changes with the time of day. Warm festive dots by
 * day; real twinkling stars over deep-space purple at night.
 * (Component name kept for compatibility across screens.)
 */
export function StarField({ count = 26 }: { count?: number }) {
  const part = daypart();
  const sky = SKY[part];

  const dots = useMemo(() => {
    return Array.from({ length: part === "night" ? Math.max(count, 40) : count }).map(
      (_, i) => {
        const size = Math.random() * (part === "night" ? 3 : 4) + (part === "night" ? 1 : 2);
        return {
          id: i,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: `${size}px`,
          color: sky.dotColors[i % sky.dotColors.length],
          delay: `${Math.random() * 3}s`,
          duration: `${3 + Math.random() * 3}s`,
        };
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, part]);

  return (
    <div className="star-bg" style={{ background: sky.bg }}>
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
            opacity: sky.dotOpacity,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
