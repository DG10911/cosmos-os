import { useNavigate } from "react-router-dom";
import { Heart, Users2, Home } from "lucide-react";

export default function CirclePage() {
  const nav = useNavigate();
  return (
    <div className="px-4 pt-3">
      <h1 className="serif text-3xl text-white">Circle</h1>
      <p className="mt-1 text-sm text-text-muted">
        See how your stars connect with others
      </p>

      {/* Primary: Compatibility */}
      <button
        onClick={() => nav("/circle/compat")}
        className="aura-border mt-4 w-full rounded-card p-5 text-left"
        style={{
          background:
            "radial-gradient(120% 100% at 20% 0%, rgba(251,113,133,0.18), transparent 55%), linear-gradient(150deg,#331e57,#1a0b2e)",
          boxShadow: "0 12px 40px rgba(139,124,252,0.2)",
        }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
          <Heart size={22} className="text-gold" />
        </div>
        <h3 className="serif mt-3 text-xl text-white">Check with a friend</h3>
        <p className="mt-1 text-sm text-text-muted">
          Beautiful, shareable compatibility cards
        </p>
        <span className="btn-gold mt-4 inline-block rounded-full text-sm">
          Create Card ✨
        </span>
        <p className="mt-3 text-xs text-text-muted">
          12,483 cards created today
        </p>
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
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-text-muted">{sub}</p>
      </div>
      <span className="rounded-full bg-white/8 px-2 py-1 text-[10px] text-text-muted">
        Coming soon
      </span>
    </div>
  );
}
