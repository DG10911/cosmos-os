import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Download, Sparkles } from "lucide-react";
import { toPng } from "html-to-image";
import { computeCompat } from "../data/compat";
import { avatarUrl } from "../data/seed";
import { useToast } from "../components/Toast";
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
      toast("Card saved ✨");
    } catch {
      toast("Export failed — try again");
    }
  }

  async function share() {
    await download();
    try {
      await navigator.clipboard.writeText(
        "Check our cosmic compatibility ✨ cosmos-os.app"
      );
    } catch {
      /* clipboard may be blocked; ignore */
    }
    toast("Caption copied · share to your story!");
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
          <h1 className="serif text-2xl text-white">
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
                className="cosmic-card mt-1.5 h-13 w-full bg-bg-card px-4 py-3 text-base text-white outline-none placeholder:text-text-muted/50 focus:ring-2 focus:ring-gold/60"
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
                className="cosmic-card mt-1.5 h-13 w-full bg-bg-card px-4 py-3 text-base text-white outline-none [color-scheme:dark] focus:ring-2 focus:ring-gold/60"
              />
            </div>
          </div>
          <button
            disabled={!name || !dob}
            onClick={() => setStage("card")}
            className="btn-gold mt-8 w-full rounded-full disabled:opacity-40"
          >
            Generate Card ✨
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
                "linear-gradient(160deg,#0B0B14 0%,#4c1d95 55%,#0B0B14 100%)",
            }}
          >
            {/* floating stars */}
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: `${(i * 37) % 100}%`,
                  left: `${(i * 53) % 100}%`,
                  width: i % 5 === 0 ? 3 : 1.5,
                  height: i % 5 === 0 ? 3 : 1.5,
                  borderRadius: "50%",
                  background: i % 5 === 0 ? "#F4C430" : "#fff",
                  opacity: 0.7,
                }}
              />
            ))}

            <div className="relative flex h-full flex-col items-center px-6 py-10 text-center">
              {/* avatars */}
              <div className="flex items-center gap-3">
                <img
                  src={avatarUrl(99)}
                  className="h-14 w-14 rounded-full border-2 border-gold/60 bg-bg-elevated"
                  alt="Anya"
                />
                <div className="h-px w-8 bg-gold" />
                <img
                  src={avatarUrl(42)}
                  className="h-14 w-14 rounded-full border-2 border-gold/60 bg-bg-elevated"
                  alt={name}
                />
              </div>
              <p className="serif mt-4 text-[22px] text-white">
                Anya × {name}
              </p>
              <p className="text-xs text-white/60">
                {compat.signA} × {compat.signB}
              </p>

              {/* score */}
              <div className="mt-8 flex flex-col items-center">
                <CountUp
                  value={compat.score}
                  duration={1100}
                  format={(n) => `${Math.round(n)}`}
                  className="serif leading-none text-gold"
                  style={{ fontSize: "88px", textShadow: "0 0 30px rgba(244,196,48,0.5)" }}
                />
                <span className="text-xs text-white/50">/ 100</span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                  Cosmic Compatibility
                </span>
              </div>

              {/* insights */}
              <div className="mt-8 space-y-2 px-2">
                {compat.insights.map((line, i) => (
                  <p key={i} className="text-[13px] italic leading-snug text-white/85">
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-1 pt-6 text-[10px] text-white/40">
                <Sparkles size={10} /> cosmos-os.app
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="mt-5 flex w-full max-w-[340px] gap-2">
            <button
              onClick={share}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-btn py-3 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#8B7CFC,#c026d3)" }}
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
            Yours joins 12,483 cards shared today ✨
          </p>
        </div>
      )}
    </div>
  );
}
