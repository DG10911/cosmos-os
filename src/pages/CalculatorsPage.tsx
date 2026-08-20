import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Sunrise,
  Orbit,
  Heart,
  Users,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { getUser } from "../data/user";
import { deriveChart, sunSign, sadeSati } from "../lib/chart";
import { Gem } from "../components/Glyphs";

type CalcKind = "moon" | "sun" | "asc" | "sadesati" | "gem" | "love" | "friend";

const CALCS: { key: CalcKind; label: string; icon: typeof Moon; pair?: boolean }[] = [
  { key: "moon", label: "Moon Sign", icon: Moon },
  { key: "sun", label: "Sun Sign", icon: Sun },
  { key: "asc", label: "Ascendant", icon: Sunrise },
  { key: "sadesati", label: "Sade Sati", icon: Orbit },
  { key: "gem", label: "Gemstone", icon: Sparkles },
  { key: "love", label: "Love", icon: Heart, pair: true },
  { key: "friend", label: "Friendship", icon: Users, pair: true },
];

const RASHI_TRAIT: Record<string, string> = {
  Aries: "Bold, pioneering, driven by action.",
  Taurus: "Grounded, loyal, loves comfort and beauty.",
  Gemini: "Curious, quick-witted, a natural communicator.",
  Cancer: "Nurturing, intuitive, deeply emotional.",
  Leo: "Warm, expressive, born to lead and shine.",
  Virgo: "Precise, helpful, quietly perfectionist.",
  Libra: "Charming, fair, seeks balance and harmony.",
  Scorpio: "Intense, magnetic, fiercely private.",
  Sagittarius: "Free, optimistic, a seeker of meaning.",
  Capricorn: "Disciplined, ambitious, plays the long game.",
  Aquarius: "Original, humane, a step ahead of the room.",
  Pisces: "Dreamy, compassionate, deeply imaginative.",
};

export default function CalculatorsPage() {
  const user = useMemo(() => getUser(), []);
  const [active, setActive] = useState<CalcKind>("moon");
  const [birthDate, setBirthDate] = useState(user?.birthDate || "1999-03-14");
  const [birthTime, setBirthTime] = useState(user?.birthTime || "06:45");
  const [a, setA] = useState(user?.name || "");
  const [b, setB] = useState("");

  const chart = useMemo(
    () => deriveChart({ name: user?.name, birthDate, birthTime }),
    [user?.name, birthDate, birthTime]
  );

  const calc = CALCS.find((c) => c.key === active)!;

  return (
    <div className="px-4 pt-3 pb-8">
      <PageHeader
        title="Astro Calculators"
        sub="Computed live from your real chart — not a lookup table"
      />

      {/* Calculator selector */}
      <div className="grid grid-cols-4 gap-2.5">
        {CALCS.map((c) => {
          const on = c.key === active;
          return (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 transition active:scale-95 ${
                on ? "border-2 border-gold bg-gold/10" : "border-gold/15 bg-bg-card"
              }`}
            >
              <c.icon size={18} className={on ? "text-gold" : "text-text-muted"} />
              <span className={`text-center text-[10px] leading-tight ${on ? "font-semibold text-gold" : "text-text-primary"}`}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Inputs */}
      {calc.pair ? (
        <div className="mt-6 space-y-3.5">
          <LabeledInput label="First name" value={a} onChange={setA} placeholder="e.g. Aditi" />
          <LabeledInput label="Second name" value={b} onChange={setB} placeholder="e.g. Rohan" />
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-text-muted">Date of birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="glass mt-1.5 h-12 w-full rounded-btn px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-gold/60 [color-scheme:light]"
            />
          </div>
          <div className="w-28">
            <label className="text-xs text-text-muted">Time</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="glass mt-1.5 h-12 w-full rounded-btn px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-gold/60 [color-scheme:light]"
            />
          </div>
        </div>
      )}

      {/* Result */}
      <motion.div
        key={active + birthDate + birthTime + a + b}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5"
      >
        {active === "moon" && (
          <ResultCard headline={`${chart.rashiEn} · ${chart.rashi}`} label="Your Moon Sign (Rashi)">
            <p className="text-sm text-text-muted">{RASHI_TRAIT[chart.rashiEn]}</p>
            <Chip>Nakshatra: {chart.nakshatra}</Chip>
          </ResultCard>
        )}

        {active === "sun" && (() => {
          const s = sunSign(new Date(`${birthDate}T${birthTime || "12:00"}`));
          return (
            <ResultCard headline={`${s.en} · ${s.sa}`} label="Your Sun Sign">
              <p className="text-sm text-text-muted">{RASHI_TRAIT[s.en]}</p>
            </ResultCard>
          );
        })()}

        {active === "asc" && (
          <ResultCard headline={chart.ascendant} label="Your Ascendant (Lagna)">
            <p className="text-sm text-text-muted">
              The mask you meet the world with — set by the sign rising at your
              birth time. Your lucky hour is {chart.luckyHour}.
            </p>
            <Chip>Best day: {chart.luckyDay}</Chip>
          </ResultCard>
        )}

        {active === "sadesati" && (() => {
          const ss = sadeSati(chart.rashiEn);
          return (
            <ResultCard
              headline={ss.active ? ss.phase : "All Clear"}
              label={`Sade Sati · Moon in ${chart.rashiEn}`}
              tint={ss.active ? "#F59E0B" : "#16A34A"}
            >
              <p className="text-sm text-text-muted">{ss.note}</p>
              <div className="mt-3 flex gap-1">
                {["Rising", "Peak", "Setting"].map((ph) => (
                  <div
                    key={ph}
                    className={`flex-1 rounded-full py-1.5 text-center text-[10px] font-medium ${
                      ss.phase === ph ? "bg-gold text-white" : "bg-black/[0.05] text-text-muted"
                    }`}
                  >
                    {ph}
                  </div>
                ))}
              </div>
            </ResultCard>
          );
        })()}

        {active === "gem" && (
          <ResultCard headline={chart.gem.stone} label={`Remedy for your ${chart.remedyPlanet} Mahadasha`}>
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-700/20">
              <Gem size={34} />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]">
              <Row k="Weight" v={`${chart.gem.ratti} ratti`} />
              <Row k="Metal" v={chart.gem.metal} />
              <Row k="Finger" v={chart.gem.finger} />
              <Row k="Wear on" v={chart.gem.day} />
            </div>
            <p className="mt-2 text-[13px] text-text-muted">
              Energise with <span className="text-gold">{chart.gem.mantra}</span> (108×).
            </p>
          </ResultCard>
        )}

        {(active === "love" || active === "friend") && (
          <PairResult kind={active} a={a} b={b} />
        )}
      </motion.div>

      <p className="mt-5 text-center text-[11px] text-text-muted">
        Chart calculators derive from a live Vimshottari + sidereal engine — the
        same one powering your consultations.
      </p>
    </div>
  );
}

/* ---------- pair compatibility ---------- */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const PAIR_AXES: Record<"love" | "friend", string[]> = {
  love: ["Passion", "Communication", "Trust", "Long-term"],
  friend: ["Vibe", "Loyalty", "Fun", "Support"],
};

function PairResult({ kind, a, b }: { kind: "love" | "friend"; a: string; b: string }) {
  if (!a.trim() || !b.trim()) {
    return (
      <div className="cosmic-card p-6 text-center text-sm text-text-muted">
        Enter both names to reveal your {kind === "love" ? "love" : "friendship"} match.
      </div>
    );
  }
  const seed = `${a.toLowerCase().trim()}|${b.toLowerCase().trim()}|${kind}`;
  const base = hashStr(seed);
  const overall = 62 + (base % 37); // 62..98
  const axes = PAIR_AXES[kind].map((name, i) => ({
    name,
    val: 55 + (hashStr(seed + i) % 45), // 55..99
  }));
  const verdict =
    overall >= 88 ? "A rare, radiant match ✦" :
    overall >= 78 ? "Strong chemistry — nurture it" :
    overall >= 70 ? "Warm and workable" : "Different energies — worth the effort";

  return (
    <div className="cosmic-card p-5">
      <p className="text-center text-[12px] text-text-muted">
        {a} <span className="text-gold">&</span> {b}
      </p>
      <div className="mt-1 text-center">
        <span className="serif grad-text text-5xl">{overall}%</span>
        <p className="mt-0.5 text-sm text-text-primary">{verdict}</p>
      </div>
      <div className="mt-4 space-y-2.5">
        {axes.map((ax) => (
          <div key={ax.name}>
            <div className="flex justify-between text-[12px]">
              <span className="text-text-primary">{ax.name}</span>
              <span className="mono text-gold">{ax.val}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ax.val}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gold"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- small building blocks ---------- */

function ResultCard({
  headline,
  label,
  tint = "#F4C430",
  children,
}: {
  headline: string;
  label: string;
  tint?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="aura-border rounded-card p-5"
      style={{ background: "linear-gradient(150deg,#FFF3E2,#FFEAD2)" }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</span>
      <h2 className="serif mt-1 text-2xl" style={{ color: tint === "#F4C430" ? undefined : tint }}>
        <span className="grad-text">{headline}</span>
      </h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-text-muted">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="glass mt-1.5 h-12 w-full rounded-btn px-4 text-sm text-text-primary outline-none placeholder:text-text-muted/50 focus:ring-2 focus:ring-gold/60"
      />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-2 inline-block rounded-full bg-cosmic/10 px-2.5 py-1 text-[11px] font-medium text-cosmic">
      {children}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-black/[0.04] py-0.5">
      <span className="text-text-muted">{k}</span>
      <span className="font-medium capitalize text-text-primary">{v}</span>
    </div>
  );
}
