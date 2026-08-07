import { useNavigate } from "react-router-dom";
import { Heart, Users2, Home } from "lucide-react";
import { Spark } from "../components/Glyphs";

export default function CirclePage() {
  const nav = useNavigate();
  return (
    <div className="px-4 pt-3">
      <h1 className="serif text-3xl text-text-primary">Circle</h1>
      <p className="mt-1 text-sm text-text-muted">
        See how your stars connect with others
      </p>

      {/* Primary: Compatibility — bold vibrant viral card */}
      <button
        onClick={() => nav("/circle/compat")}
        className="relative mt-4 w-full overflow-hidden rounded-card p-5 text-left text-white"
        style={{
          background: "linear-gradient(140deg,#FF6B2C 0%,#E11D74 60%,#FF9A1F 100%)",
          boxShadow: "0 14px 36px rgba(225,29,116,0.32)",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Heart size={24} className="fill-white text-white" />
        </div>
        <h3 className="serif mt-3 text-2xl">Check with a friend</h3>
        <p className="mt-1 text-sm text-white/90">
          Beautiful, shareable compatibility cards
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#E11D74]">
          <Spark size={14} /> Create Card
        </span>
        <p className="mt-3 text-xs text-white/85">🔥 12,483 cards created today</p>
        <Heart className="absolute -bottom-4 -right-3 fill-white/10 text-white/10" size={96} />
      </button>

      {/* Coming soon */}
      <ComingCard
        icon={<Users2 size={20} className="text-cosmic" />}
        title="Couple Space"
        sub="Sync goals & compatibility with your partner"
      />
      <ComingCard
        icon={<Home size={20} className="text-cosmic" />}
        title="Family Universe"
        sub="Your family's shared ritual calendar"
      />
    </div>
  );
}

function ComingCard({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="cosmic-card mt-3 flex items-center gap-3 p-4 opacity-70">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04]">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <p className="text-xs text-text-muted">{sub}</p>
      </div>
      <span className="rounded-full bg-black/[0.04] px-2 py-1 text-[10px] text-text-muted">
        Coming soon
      </span>
    </div>
  );
}
