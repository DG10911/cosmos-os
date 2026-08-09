import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Share2, BadgeCheck, Info } from "lucide-react";
import { CountUp } from "../components/CountUp";
import { nativeShare } from "../lib/services";
import { useToast } from "../components/Toast";

/** The 8 kootas of Ashtakoota gun-milan with max points. */
const KOOTAS = [
  { name: "Varna", max: 1, aspect: "Spiritual compatibility" },
  { name: "Vashya", max: 2, aspect: "Mutual attraction & influence" },
  { name: "Tara", max: 3, aspect: "Health & well-being together" },
  { name: "Yoni", max: 4, aspect: "Intimacy & instincts" },
  { name: "Graha Maitri", max: 5, aspect: "Mental connection & friendship" },
  { name: "Gana", max: 6, aspect: "Temperament match" },
  { name: "Bhakoot", max: 7, aspect: "Emotional & family harmony" },
  { name: "Nadi", max: 8, aspect: "Health of progeny & vitality" },
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic demo scoring — replaced by Prokerala gun-milan API in production. */
function computeMatch(a: string, b: string, dobA: string, dobB: string) {
  const seed = hashStr(`${a}|${b}|${dobA}|${dobB}`);
  const scores = KOOTAS.map((k, i) => {
    const r = (seed >> (i * 4)) % 100;
    // bias toward decent scores, allow occasional 0 for realism
    const frac = r < 12 ? 0 : 0.45 + (r % 55) / 100;
    return Math.min(k.max, Math.round(k.max * frac));
  });
  const total = scores.reduce((x, y) => x + y, 0);
  const manglik = seed % 5 === 0; // one partner manglik
  const manglikCancelled = manglik && seed % 2 === 0;
  return { scores, total, manglik, manglikCancelled };
}

export default function KundliMatchPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [stage, setStage] = useState<"form" | "report">("form");
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [dobA, setDobA] = useState("");
  const [dobB, setDobB] = useState("");

  const m =
    stage === "report" ? computeMatch(nameA, nameB, dobA, dobB) : null;

  function verdict(total: number) {
    if (total >= 28) return { t: "Excellent match", c: "#16A34A" };
    if (total >= 24) return { t: "Very good match", c: "#16A34A" };
    if (total >= 18) return { t: "Good match — proceed", c: "#F59E0B" };
    return { t: "Consult before deciding", c: "#E5484D" };
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <button
        onClick={() => (stage === "report" ? setStage("form") : nav(-1))}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {stage === "form" && (
        <div>
          <h1 className="serif text-2xl text-text-primary">Kundli Match</h1>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            The full 36-guna report — <b>with the cancellation rules most
            pandits skip</b>. Built to be shown to parents.
          </p>

          {[
            { label: "First person", name: nameA, dob: dobA, sn: setNameA, sd: setDobA },
            { label: "Second person", name: nameB, dob: dobB, sn: setNameB, sd: setDobB },
          ].map((p) => (
            <div key={p.label} className="cosmic-card mt-3 p-4">
              <p className="text-xs font-bold text-text-muted">{p.label}</p>
              <input
                value={p.name}
                onChange={(e) => p.sn(e.target.value)}
                placeholder="Name"
                className="mt-2 h-12 w-full rounded-btn border border-gold/25 bg-white px-3 text-sm text-text-primary outline-none focus:border-gold"
              />
              <input
                type="date"
                value={p.dob}
                onChange={(e) => p.sd(e.target.value)}
                className="mt-2 h-12 w-full rounded-btn border border-gold/25 bg-white px-3 text-sm text-text-primary outline-none [color-scheme:light] focus:border-gold"
              />
            </div>
          ))}

          <button
            disabled={!nameA || !nameB || !dobA || !dobB}
            onClick={() => setStage("report")}
            className="btn-gold mt-5 w-full rounded-full disabled:opacity-40"
          >
            Generate 36-Guna Report
          </button>
          <p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-text-muted">
            <ShieldCheck size={12} className="text-success" /> Transparent scoring ·
            classical rules cited · no fear-selling
          </p>
        </div>
      )}

      {stage === "report" && m && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="serif text-2xl text-text-primary">
            {nameA} × {nameB}
          </h1>

          {/* Score hero */}
          <div
            className="aura-border mt-3 flex items-center gap-4 rounded-card p-5"
            style={{ background: "linear-gradient(150deg,#FFF0DC,#FFEAD2)" }}
          >
            <div className="text-center">
              <CountUp
                value={m.total}
                format={(n) => `${Math.round(n)}`}
                className="serif grad-text text-5xl"
              />
              <p className="text-[11px] text-text-muted">of 36 gunas</p>
            </div>
            <div className="h-12 w-px bg-black/[0.06]" />
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: verdict(m.total).c }}
              >
                {verdict(m.total).t}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                18+ is traditionally acceptable · 24+ is strong
              </p>
            </div>
          </div>

          {/* Manglik transparency — the anti-fear-selling feature */}
          <div
            className={`mt-3 flex items-start gap-2.5 rounded-card p-4 ${
              m.manglik && !m.manglikCancelled ? "bg-amber/15" : "bg-success/10"
            }`}
          >
            <BadgeCheck
              size={18}
              className={m.manglik && !m.manglikCancelled ? "mt-0.5 text-[#B45309]" : "mt-0.5 text-success"}
            />
            <div>
              <p className="text-sm font-bold text-text-primary">
                {!m.manglik
                  ? "No Manglik dosha found"
                  : m.manglikCancelled
                    ? "Manglik dosha present — but CANCELLED"
                    : "Mild Manglik dosha noted"}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">
                {!m.manglik
                  ? "Neither chart has Mars in houses 1, 4, 7, 8 or 12 from Lagna."
                  : m.manglikCancelled
                    ? "Per BPHS rules, the dosha nullifies when both charts carry it or Mars sits in own sign. Most pandits skip this check — we show it."
                    : "Classical texts list 12+ cancellation conditions. Get a free second opinion before any paid remedy."}
              </p>
            </div>
          </div>

          {/* Koota table */}
          <h3 className="mt-5 px-1 text-sm font-semibold text-text-primary">
            Guna-by-guna breakdown
          </h3>
          <div className="mt-2 space-y-1.5">
            {KOOTAS.map((k, i) => (
              <div key={k.name} className="cosmic-card flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-text-primary">
                    {k.name}
                  </p>
                  <p className="text-[10px] text-text-muted">{k.aspect}</p>
                </div>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(m.scores[i] / k.max) * 100}%`,
                      background: m.scores[i] === 0 ? "#E5484D" : "#FF6B2C",
                    }}
                  />
                </div>
                <span className="mono w-10 text-right text-sm font-bold text-gold">
                  {m.scores[i]}/{k.max}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 flex items-start gap-1.5 rounded-card bg-cosmic/5 p-3 text-[11px] leading-relaxed text-text-muted">
            <Info size={13} className="mt-0.5 shrink-0 text-cosmic" />
            A low single koota rarely breaks a match — classical texts weigh
            Graha Maitri and Bhakoot over Nadi when cancellations apply. Demo
            scores; production uses the Prokerala gun-milan engine.
          </p>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                nativeShare(
                  "Kundli Match Report",
                  `🪔 ${nameA} × ${nameB} — ${m.total}/36 gunas (${verdict(m.total).t}). Full transparent report with dosha-cancellation rules: https://dg10911.github.io/cosmos-os/`
                )
              }
              className="btn-gold flex flex-1 items-center justify-center gap-1.5 rounded-btn text-sm"
            >
              <Share2 size={15} /> Share with family
            </button>
            <button
              onClick={() => {
                toast("3 astrologers will review within 24h ✦");
              }}
              className="btn-outline flex items-center justify-center rounded-btn px-4 text-xs"
            >
              2nd opinion
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
