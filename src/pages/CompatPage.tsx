import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Download } from "lucide-react";
import { Spark } from "../components/Glyphs";
import { toPng } from "html-to-image";
import { computeCompat } from "../data/compat";
import { avatarUrl } from "../data/seed";
import { useToast } from "../components/Toast";
import { nativeShare } from "../lib/services";
import { CountUp } from "../components/CountUp";

export default function CompatPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [stage, setStage] = useState<"form" | "card">("form");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const compat = name ? computeCompat("Anya", name, dob) : null;

  async function download() {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `cosmos-compat-anya-${name.toLowerCase()}.png`;
      link.href = url;
      link.click();
      toast("Saved · some things are written in the stars ✦");
    } catch {
      toast("Export failed — try again");
    }
  }

  async function share() {
    await download();
    const caption = `✨ Anya × ${name} — ${compat?.score}/100 cosmic compatibility! Check yours → https://dg10911.github.io/cosmos-os/`;
    await nativeShare("Our cosmic compatibility", caption);
    toast("Card saved · sharing now ✦");
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <button
        onClick={() => (stage === "card" ? setStage("form") : nav(-1))}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {stage === "form" && (
        <div>
          <h1 className="serif text-2xl text-text-primary">
            Whose chart do you want to check?
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            We'll generate a beautiful, shareable card.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-text-muted">Their name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Riya"
                className="cosmic-card mt-1.5 h-13 w-full bg-bg-card px-4 py-3 text-base text-text-primary outline-none placeholder:text-text-muted/50 focus:ring-2 focus:ring-gold/60"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted">
                Their date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="cosmic-card mt-1.5 h-13 w-full bg-bg-card px-4 py-3 text-base text-text-primary outline-none [color-scheme:light] focus:ring-2 focus:ring-gold/60"
              />
            </div>
          </div>
          <button
            disabled={!name || !dob}
            onClick={() => setStage("card")}
            className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-full disabled:opacity-40"
          >
            <Spark size={16} /> Generate Card
          </button>
        </div>
      )}

      {stage === "card" && compat && (
        <div className="flex flex-col items-center">
          {/* Shareable 9:16 card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            ref={cardRef}
            className="relative w-full max-w-[340px] overflow-hidden rounded-3xl"
            style={{
              aspectRatio: "9 / 16",
              background:
                "linear-gradient(155deg,#FF6B2C 0%,#E11D74 52%,#FF9A1F 100%)",
            }}
          >
            {/* constellation lines */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 340 604"
              preserveAspectRatio="none"
              fill="none"
            >
              <g stroke="rgba(255,255,255,0.35)" strokeWidth="1">
                <path d="M30 90 L78 60 L128 96 L96 150 Z" />
                <path d="M250 430 L292 400 L312 458 L266 480 Z" />
              </g>
              {[
                [30, 90], [78, 60], [128, 96], [96, 150],
                [250, 430], [292, 400], [312, 458], [266, 480],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill="#FFE08A" />
              ))}
            </svg>

            {/* floating sparkles */}
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: `${(i * 37) % 100}%`,
                  left: `${(i * 53) % 100}%`,
                  width: i % 5 === 0 ? 4 : 2,
                  height: i % 5 === 0 ? 4 : 2,
                  borderRadius: "50%",
                  background: i % 5 === 0 ? "#FFE08A" : "#fff",
                  opacity: 0.8,
                }}
              />
            ))}

            <div className="relative flex h-full flex-col items-center px-6 py-10 text-center">
              {/* avatars */}
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl(99)}
                  className="h-14 w-14 rounded-full border-2 border-white/80 bg-white"
                  alt="Anya"
                />
                <div className="h-0.5 w-8 bg-white/80" />
                <img
                  src={avatarUrl(42)}
                  className="h-14 w-14 rounded-full border-2 border-white/80 bg-white"
                  alt={name}
                />
              </div>
              <p className="serif mt-4 text-[22px] text-white">Anya × {name}</p>
              <p className="text-xs text-white/85">
                {compat.signA} × {compat.signB}
              </p>

              {/* score */}
              <div className="mt-8 flex flex-col items-center">
                <CountUp
                  value={compat.score}
                  duration={1100}
                  format={(n) => `${Math.round(n)}`}
                  className="serif leading-none text-white"
                  style={{ fontSize: "92px", textShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                />
                <span className="text-xs text-white/70">/ 100</span>
                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">
                  Cosmic Compatibility
                </span>
              </div>

              {/* insights */}
              <div className="mt-8 space-y-2 px-2">
                {compat.insights.map((line, i) => (
                  <p key={i} className="text-[13px] italic leading-snug text-white/95">
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-auto flex w-full items-end justify-between pt-6">
                <div className="flex items-center gap-1 text-[10px] text-white/70">
                  <Spark size={10} /> cosmos-os.app
                </div>
                {/* mini QR (decorative, deterministic) */}
                <div className="rounded-md bg-white/95 p-1">
                  <div
                    className="grid gap-[1px]"
                    style={{ gridTemplateColumns: "repeat(7, 4px)" }}
                  >
                    {Array.from({ length: 49 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          width: 4,
                          height: 4,
                          background:
                            (i * 7 + 3) % 5 < 2 || i < 3 || i % 7 === 0
                              ? "#2A1B10"
                              : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="mt-5 flex w-full max-w-[340px] gap-2">
            <button
              onClick={share}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-btn py-3 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#E11D74,#7C3AED)" }}
            >
              <Share2 size={16} /> Share to Story
            </button>
            <button
              onClick={download}
              className="btn-outline flex items-center justify-center gap-1.5 rounded-btn px-4 text-sm"
            >
              <Download size={16} /> Save
            </button>
          </div>
          <button
            onClick={() => setStage("form")}
            className="mt-3 text-xs text-text-muted underline"
          >
            New Reading
          </button>
          <p className="mt-4 text-center text-[11px] text-text-muted">
            Built to be shared — post it to your Story or family group
          </p>
        </div>
      )}
    </div>
  );
}
