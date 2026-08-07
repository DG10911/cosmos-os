import { useMemo, useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

/**
 * Voice-note bubble content: a play/pause control + animated waveform + duration.
 * The "playback" is simulated (fills the bars left→right) so it feels real in the demo.
 */
export function VoiceNote({
  seconds = 12,
  tint = "#F4C430",
  bg = "rgba(255,255,255,0.06)",
}: {
  seconds?: number;
  tint?: string;
  bg?: string;
}) {
  const bars = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => {
        // pseudo-random but deterministic bar heights
        const h = 6 + ((Math.sin(i * 1.7) + 1) / 2) * 20 + (i % 3) * 3;
        return Math.min(28, h);
      }),
    []
  );
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const from = progress;
    const tick = (now: number) => {
      const t = from + (now - start) / (seconds * 1000);
      if (t >= 1) {
        setProgress(0);
        setPlaying(false);
        return;
      }
      setProgress(t);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: tint, color: "#0B0B14" }}
      >
        {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
      </button>
      <div className="flex h-7 items-center gap-[2px]">
        {bars.map((h, i) => {
          const filled = i / bars.length <= progress;
          return (
            <span
              key={i}
              style={{
                width: 2.5,
                height: h,
                borderRadius: 2,
                background: filled ? tint : bg,
                opacity: filled ? 1 : 0.7,
                transition: "background 120ms",
              }}
            />
          );
        })}
      </div>
      <span className="mono text-[11px] text-text-muted">
        {mm}:{ss}
      </span>
    </div>
  );
}
