import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Sunrise,
  Film,
  Target,
  MessageCircle,
  Sparkles,
  Phone,
  ShieldCheck,
  Calculator,
  HeartHandshake,
  Gauge,
  CalendarRange,
  CalendarClock,
  ShoppingBag,
  PartyPopper,
  Users,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { store } from "../lib/utils";

type Item = { icon: typeof Sun; name: string; desc: string; to: string };
type Group = { title: string; color: string; tint: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "Your daily ritual",
    color: "#FF6B2C",
    tint: "#FFE7D6",
    items: [
      { icon: Sun, name: "Cosmic Weather", desc: "Your personalized day, at a glance", to: "/today" },
      { icon: Sunrise, name: "Morning Brief", desc: "A 60-second cosmic wake-up — now in Hindi", to: "/brief" },
      { icon: Film, name: "Cosmic Scroll", desc: "Bite-size reels, mantras & insights", to: "/scroll" },
      { icon: Target, name: "Missions & Karma", desc: "Daily rituals, streaks & rewards", to: "/missions" },
    ],
  },
  {
    title: "Talk to an expert",
    color: "#7C3AED",
    tint: "#EDE9FE",
    items: [
      { icon: MessageCircle, name: "Consult Astrologers", desc: "Chat, call or video with verified experts", to: "/consult" },
      { icon: Sparkles, name: "Cosmos Twin (AI)", desc: "Your 24/7 AI astrologer — knows your chart", to: "/twin" },
      { icon: Phone, name: "Call Cosmo", desc: "Talk to our AI voice agent, Hindi or English", to: "/twin" },
      { icon: ShieldCheck, name: "Prediction Tracker", desc: "Every prediction, held accountable", to: "/predictions" },
    ],
  },
  {
    title: "Explore your chart",
    color: "#0EA5E9",
    tint: "#E0F2FE",
    items: [
      { icon: Calculator, name: "Astro Calculators", desc: "Moon sign, Sade Sati, gemstone & more", to: "/calculators" },
      { icon: HeartHandshake, name: "Kundli Matching", desc: "36-point Vedic compatibility", to: "/kundli-match" },
      { icon: Gauge, name: "Aura & Navagraha", desc: "Level up your 9 planets", to: "/aura" },
      { icon: CalendarRange, name: "Destiny Timeline", desc: "Your past & predicted future", to: "/timeline" },
    ],
  },
  {
    title: "Time it right & shop",
    color: "#16A34A",
    tint: "#DCFCE7",
    items: [
      { icon: CalendarClock, name: "Muhurat Marketplace", desc: "Auspicious dates + verified vendors", to: "/muhurat" },
      { icon: ShoppingBag, name: "Astro Store", desc: "Remedies matched to your chart", to: "/today" },
      { icon: PartyPopper, name: "Festival Cards", desc: "Bless a friend, get shared", to: "/festival" },
      { icon: Users, name: "Cosmic Circle", desc: "Check compatibility with friends", to: "/circle" },
    ],
  },
];

export function markGuideSeen() {
  store.set("cosmos_guide_seen", true);
}

export default function GuidePage() {
  const nav = useNavigate();
  const go = (to: string) => {
    markGuideSeen();
    nav(to);
  };

  return (
    <div className="px-4 pt-3 pb-6">
      <PageHeader title="Discover COSMOS OS" sub="Everything the stars can do for you" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="elev overflow-hidden rounded-card p-5 text-white"
        style={{
          background:
            "radial-gradient(120% 90% at 85% -10%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(140deg,#7C3AED 0%,#E11D74 58%,#FF6B2C 100%)",
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
          Welcome
        </p>
        <h1 className="serif mt-1 text-[26px] leading-tight">
          Your whole cosmos, in one app.
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-white/90">
          An AI that remembers your chart, real astrologers 24×7, daily rituals,
          auspicious timing and a spiritual store — all personal to your birth.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["18+ features", "AI + real experts", "Hindi & English"].map((c) => (
            <span key={c} className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-semibold">
              {c}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Feature groups */}
      {GROUPS.map((g, gi) => (
        <section key={g.title} className="mt-8">
          <div className="mb-3 flex items-center gap-2 px-0.5">
            <span className="h-5 w-1.5 rounded-full" style={{ background: g.color }} />
            <h2 className="serif text-[17px] text-text-primary">{g.title}</h2>
          </div>
          <div className="space-y-2.5">
            {g.items.map((it, i) => (
              <motion.button
                key={it.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.04 + i * 0.03 }}
                onClick={() => go(it.to)}
                className="cosmic-card flex w-full items-center gap-3.5 p-4 text-left active:scale-[0.99]"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: g.tint, color: g.color }}
                >
                  <it.icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-text-primary">{it.name}</p>
                  <p className="text-[12px] leading-snug text-text-muted">{it.desc}</p>
                </div>
                <ChevronRight size={18} className="shrink-0 text-text-muted" />
              </motion.button>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <button
        onClick={() => go("/brief")}
        className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-btn"
      >
        Start with your Morning Brief <ArrowRight size={17} />
      </button>
      <button
        onClick={() => go("/today")}
        className="mt-3 w-full py-2 text-center text-[13px] font-medium text-text-muted"
      >
        Explore on my own →
      </button>
    </div>
  );
}
