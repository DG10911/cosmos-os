import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Share2, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useToast } from "../components/Toast";
import { Diya, Spark } from "../components/Glyphs";

const FESTIVALS = [
  { key: "diwali", name: "Diwali", wish: "May your path be lit with prosperity", grad: "linear-gradient(160deg,#3B0A45 0%,#7C1D5A 45%,#FF6B2C 100%)" },
  { key: "navratri", name: "Navratri", wish: "Nine nights of light and strength", grad: "linear-gradient(160deg,#7C1D5A 0%,#E11D74 50%,#FF9A1F 100%)" },
  { key: "holi", name: "Holi", wish: "May every colour bring you joy", grad: "linear-gradient(160deg,#E11D74 0%,#7C3AED 45%,#0EA5E9 100%)" },
];

export default function FestivalPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [fest, setFest] = useState(FESTIVALS[0]);
  const [made, setMade] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  async function download() {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = `cosmos-${fest.key}-${name.toLowerCase() || "greeting"}.png`;
      link.href = url;
      link.click();
      toast("Festival card saved · light up their feed ✦");
    } catch {
      toast("Export failed — try again");
    }
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <button onClick={() => nav(-1)} className="mb-2 flex items-center gap-1 text-sm text-text-muted">
        <ChevronLeft size={16} /> Back
      </button>

      {!made ? (
        <div>
          <h1 className="serif text-2xl text-text-primary">Festival greetings</h1>
          <p className="mt-1 text-sm text-text-muted">Send a blessing your friends will screenshot.</p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {FESTIVALS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFest(f)}
                className={`rounded-2xl py-3 text-sm font-bold text-white ${fest.key === f.key ? "ring-2 ring-gold ring-offset-2" : ""}`}
                style={{ background: f.grad }}
              >
                {f.name}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-xs text-text-muted">Your name (or theirs)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anya"
              className="cosmic-card mt-1.5 h-13 w-full bg-bg-card px-4 py-3 text-base text-text-primary outline-none focus:ring-2 focus:ring-gold/60"
            />
          </div>
          <button
            disabled={!name}
            onClick={() => setMade(true)}
            className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-full disabled:opacity-40"
          >
            <Spark size={16} /> Create Card
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-[340px] overflow-hidden rounded-3xl text-center text-white"
            style={{ aspectRatio: "9 / 16", background: fest.grad }}
          >
            {/* sparkles */}
            {Array.from({ length: 26 }).map((_, i) => (
              <span key={i} style={{
                position: "absolute", top: `${(i * 41) % 100}%`, left: `${(i * 57) % 100}%`,
                width: i % 4 === 0 ? 4 : 2, height: i % 4 === 0 ? 4 : 2, borderRadius: "50%",
                background: i % 4 === 0 ? "#FFE08A" : "#fff", opacity: 0.85,
              }} />
            ))}
            <div className="relative flex h-full flex-col items-center justify-center px-8">
              <Diya size={64} />
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-white/85">
                Happy
              </p>
              <h2 className="serif text-5xl leading-none">{fest.name}</h2>
              <p className="mt-6 text-[15px] italic leading-snug text-white/95">
                {fest.wish}, {name}.
              </p>
              <p className="mt-2 text-[13px] text-white/80">— from your stars ✦</p>
              <div className="absolute bottom-6 flex items-center gap-1 text-[10px] text-white/70">
                <Spark size={10} /> cosmos-os.app
              </div>
            </div>
          </motion.div>

          <div className="mt-5 flex w-full max-w-[340px] gap-2">
            <button
              onClick={download}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-btn py-3 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#E11D74,#FF6B2C)" }}
            >
              <Share2 size={16} /> Share
            </button>
            <button onClick={download} className="btn-outline flex items-center justify-center gap-1.5 rounded-btn px-4 text-sm">
              <Download size={16} /> Save
            </button>
          </div>
          <button onClick={() => setMade(false)} className="mt-3 text-xs text-text-muted underline">
            New card
          </button>
        </div>
      )}
    </div>
  );
}
