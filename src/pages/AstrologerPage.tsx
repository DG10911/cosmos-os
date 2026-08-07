import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Phone, Check } from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { TrustSigil } from "./TodayPage";

export default function AstrologerPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const a = ASTROLOGERS.find((x) => x.id === Number(id)) ?? ASTROLOGERS[0];

  const stats = [
    { label: "Prediction Accuracy", value: `${a.accuracy}%` },
    { label: "Total Sessions", value: `${(a.sessions / 1000).toFixed(1)}k` },
    { label: "Repeat Rate", value: `${a.repeat}%` },
    { label: "Response Time", value: a.online ? "< 1 min" : "~ 2 hrs" },
  ];

  const recentPredictions = [
    "Career breakthrough within 3 months — confirmed by client",
    "Favorable marriage window in spring — confirmed",
    "Property decision to delay by 6 weeks — confirmed",
  ];

  return (
    <div className="px-4 pt-3 pb-28">
      <button
        onClick={() => nav(-1)}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <img
          src={avatarUrl(a.id)}
          alt={a.name}
          className="h-24 w-24 rounded-full bg-bg-elevated"
        />
        <h1 className="serif mt-3 text-2xl text-white">{a.name}</h1>
        <div className="mt-1 flex items-center gap-2">
          <TrustSigil score={a.trust} />
          <span className="text-xs text-text-muted">{a.origin}</span>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {a.systems.map((s) => (
            <span
              key={s}
              className="rounded-full bg-cosmic/15 px-2 py-0.5 text-[11px] text-cosmic"
            >
              {s}
            </span>
          ))}
          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-text-muted">
            {a.languages}
          </span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm leading-relaxed text-text-muted">
        {a.bio}
      </p>

      {/* Stat grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="cosmic-card p-4 text-center">
            <div className="serif text-2xl text-gold">{s.value}</div>
            <div className="mt-1 text-[11px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent predictions */}
      <h3 className="serif mt-6 text-lg text-white">Recent Predictions</h3>
      <div className="mt-2 space-y-2">
        {recentPredictions.map((p, i) => (
          <div key={i} className="cosmic-card flex items-start gap-2 p-3">
            <Check size={16} className="mt-0.5 shrink-0 text-success" />
            <span className="text-sm text-white/90">{p}</span>
          </div>
        ))}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 left-1/2 z-20 flex w-full max-w-[420px] -translate-x-1/2 gap-2 border-t border-white/[0.06] bg-bg/90 p-3 backdrop-blur-xl">
        <button
          onClick={() => nav(`/session/${a.id}`)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-gold py-3 text-sm font-semibold text-bg"
        >
          <MessageCircle size={16} /> Start Chat ₹{a.price}/min
        </button>
        <button
          onClick={() => nav(`/session/${a.id}`)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-white/15 py-3 text-sm font-medium text-white"
        >
          <Phone size={16} /> Call ₹{Math.round(a.price * 2.3)}/min
        </button>
      </div>
    </div>
  );
}
