import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MessageCircle, Phone, Check, Video } from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { TrustSigil } from "./TodayPage";
import { CountUp } from "../components/CountUp";

export default function AstrologerPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const a = ASTROLOGERS.find((x) => x.id === Number(id)) ?? ASTROLOGERS[0];

  const stats: { label: string; node: React.ReactNode }[] = [
    {
      label: "Prediction Accuracy",
      node: <CountUp value={a.accuracy} format={(n) => `${Math.round(n)}%`} />,
    },
    {
      label: "Total Sessions",
      node: (
        <CountUp value={a.sessions} format={(n) => `${(n / 1000).toFixed(1)}k`} />
      ),
    },
    {
      label: "Repeat Rate",
      node: <CountUp value={a.repeat} format={(n) => `${Math.round(n)}%`} />,
    },
    { label: "Response Time", node: a.online ? "< 1 min" : "~ 2 hrs" },
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
        <h1 className="serif mt-3 text-2xl text-text-primary">{a.name}</h1>
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
          <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] text-text-muted">
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
            <div className="serif text-2xl text-gold">{s.node}</div>
            <div className="mt-1 text-[11px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent predictions */}
      <h3 className="serif mt-6 text-lg text-text-primary">Recent Predictions</h3>
      <div className="mt-2 space-y-2">
        {recentPredictions.map((p, i) => (
          <div key={i} className="cosmic-card flex items-start gap-2 p-3">
            <Check size={16} className="mt-0.5 shrink-0 text-success" />
            <span className="text-sm text-text-primary">{p}</span>
          </div>
        ))}
      </div>

      {/* Sticky CTA — chat / call / video */}
      <div className="fixed bottom-16 left-1/2 z-20 flex w-full max-w-[420px] -translate-x-1/2 gap-2 border-t border-gold/15 bg-bg/90 p-3 backdrop-blur-xl">
        <button
          onClick={() => nav(`/session/${a.id}`)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-btn bg-gold py-2.5 text-white active:scale-95"
        >
          <MessageCircle size={17} />
          <span className="text-[11px] font-bold">Chat ₹{a.price}</span>
        </button>
        <button
          onClick={() => nav(`/call/${a.id}?type=audio`)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-btn border border-gold/30 py-2.5 text-gold active:scale-95"
        >
          <Phone size={17} />
          <span className="text-[11px] font-bold">Call ₹{Math.round(a.price * 2.3)}</span>
        </button>
        <button
          onClick={() => nav(`/call/${a.id}`)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-btn border border-cosmic/30 py-2.5 text-cosmic active:scale-95"
        >
          <Video size={17} />
          <span className="text-[11px] font-bold">Video ₹{Math.round(a.price * 3.2)}</span>
        </button>
      </div>
    </div>
  );
}
