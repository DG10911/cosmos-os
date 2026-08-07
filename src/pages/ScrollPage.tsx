import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Sparkles,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Spark } from "../components/Glyphs";

type Card =
  | { kind: "insight"; title: string; body: string; tag: string; grad: string }
  | { kind: "astro"; id: number; hook: string; grad: string }
  | { kind: "mantra"; sanskrit: string; meaning: string; grad: string }
  | { kind: "teaser"; text: string; due: string; grad: string }
  | { kind: "cta"; title: string; sub: string; to: string; btn: string; grad: string };

const GRADS = [
  "linear-gradient(160deg,#FF6B2C 0%,#E11D74 60%,#7C3AED 100%)",
  "linear-gradient(160deg,#7C3AED 0%,#E11D74 55%,#FF9A1F 100%)",
  "linear-gradient(160deg,#0EA5E9 0%,#7C3AED 55%,#E11D74 100%)",
  "linear-gradient(160deg,#16A34A 0%,#0EA5E9 60%,#7C3AED 100%)",
  "linear-gradient(160deg,#E11D74 0%,#FF6B2C 55%,#FFC53D 100%)",
];

const FEED: Card[] = [
  {
    kind: "insight",
    tag: "TODAY'S ENERGY",
    title: "Mercury clears at 4:37 PM",
    body: "That conversation you've been avoiding? The window opens this evening. Speak before sunset.",
    grad: GRADS[0],
  },
  { kind: "astro", id: 1, hook: "“Your Saturn isn't punishing you. It's promoting you.”", grad: GRADS[1] },
  {
    kind: "mantra",
    sanskrit: "ॐ शं शनैश्चराय नमः",
    meaning: "Chant 11× today — Saturn rewards the patient. Your discipline is being watched.",
    grad: GRADS[2],
  },
  {
    kind: "teaser",
    text: "A senior at work will notice your effort before Friday.",
    due: "Prediction resolves in 2 days",
    grad: GRADS[3],
  },
  {
    kind: "cta",
    title: "Who's written in your stars?",
    sub: "Check your compatibility with anyone in 10 seconds.",
    to: "/circle/compat",
    btn: "Generate my card",
    grad: GRADS[4],
  },
  {
    kind: "insight",
    tag: "LUCKY WINDOW",
    title: "2:00 – 3:30 PM",
    body: "Jupiter aligns with your Moon. Send the pitch, make the ask, book the ticket.",
    grad: GRADS[1],
  },
  { kind: "astro", id: 2, hook: "“Rahu creates obsession. Ketu creates detachment. You need both.”", grad: GRADS[2] },
  {
    kind: "mantra",
    sanskrit: "ॐ सूर्याय नमः",
    meaning: "Face east. Three deep breaths. The Sun charges your confidence for the day ahead.",
    grad: GRADS[0],
  },
  {
    kind: "cta",
    title: "Your Aura is evolving",
    sub: "9 planets. 9 levels. See where your energy stands today.",
    to: "/aura",
    btn: "Check my Aura",
    grad: GRADS[3],
  },
  {
    kind: "insight",
    tag: "CAUTION",
    title: "Rahu Kaal · 1:30 – 3:00 PM",
    body: "Hold the big decisions for 90 minutes. Reply to messages, don't sign anything.",
    grad: GRADS[4],
  },
];

export default function ScrollPage() {
  return (
    <div className="no-scrollbar h-dvh snap-y snap-mandatory overflow-y-auto">
      {FEED.map((card, i) => (
        <FeedCard key={i} card={card} index={i} />
      ))}
    </div>
  );
}

function FeedCard({ card, index }: { card: Card; index: number }) {
  const nav = useNavigate();
  const toast = useToast();
  const app = useApp();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);
  const likeBase = useMemo(() => 800 + ((index * 733) % 4200), [index]);
  const lastTap = useRef(0);

  function like(viaDoubleTap = false) {
    if (!liked) {
      setLiked(true);
      app.addKarma(1, "Cosmic scroll");
    }
    if (viaDoubleTap || !liked) setBurst((b) => b + 1);
  }

  function onTap() {
    const now = performance.now();
    if (now - lastTap.current < 280) like(true);
    lastTap.current = now;
  }

  const astro =
    card.kind === "astro" ? ASTROLOGERS.find((a) => a.id === card.id) : null;

  return (
    <section
      className="relative flex h-dvh w-full snap-start flex-col justify-end overflow-hidden"
      style={{ background: card.grad }}
      onClick={onTap}
    >
      {/* ambient sparkles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="star"
          style={{
            position: "absolute",
            top: `${(i * 41 + index * 13) % 100}%`,
            left: `${(i * 59 + index * 29) % 100}%`,
            width: i % 4 === 0 ? 4 : 2,
            height: i % 4 === 0 ? 4 : 2,
            borderRadius: "50%",
            background: i % 4 === 0 ? "#FFE08A" : "#fff",
            opacity: 0.6,
          }}
        />
      ))}

      {/* double-tap heart burst */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.div
            key={burst}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          >
            <Heart size={120} fill="#fff" stroke="none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* content */}
      <div className="relative z-10 px-6 pb-32 pr-20">
        {card.kind === "insight" && (
          <>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white">
              {card.tag}
            </span>
            <h2 className="serif mt-3 text-4xl leading-tight text-white">
              {card.title}
            </h2>
            <p className="mt-3 max-w-[260px] text-[15px] leading-relaxed text-white/90">
              {card.body}
            </p>
          </>
        )}

        {card.kind === "astro" && astro && (
          <>
            <p className="serif text-[26px] leading-snug text-white">{card.hook}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nav(`/astrologer/${astro.id}`);
              }}
              className="mt-5 flex items-center gap-3 rounded-2xl bg-white/15 p-3 pr-4 backdrop-blur-sm"
            >
              <img
                src={avatarUrl(astro.id)}
                className="h-11 w-11 rounded-full border-2 border-white/70 bg-white"
                alt={astro.name}
              />
              <span className="text-left">
                <span className="block text-sm font-bold text-white">{astro.name}</span>
                <span className="block text-[11px] text-white/80">
                  {astro.accuracy}% accuracy · 1st chat FREE
                </span>
              </span>
              <PhoneCall size={18} className="ml-2 text-white" />
            </button>
          </>
        )}

        {card.kind === "mantra" && (
          <>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white">
              MANTRA OF THE DAY
            </span>
            <p className="serif mt-4 text-4xl text-white">{card.sanskrit}</p>
            <p className="mt-3 max-w-[260px] text-[15px] leading-relaxed text-white/90">
              {card.meaning}
            </p>
          </>
        )}

        {card.kind === "teaser" && (
          <>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] text-white">
              PREDICTION
            </span>
            <p className="serif mt-3 text-3xl leading-snug text-white">{card.text}</p>
            <p className="mt-3 text-sm text-white/85">{card.due} ⏳</p>
          </>
        )}

        {card.kind === "cta" && (
          <>
            <h2 className="serif text-4xl leading-tight text-white">{card.title}</h2>
            <p className="mt-2 max-w-[250px] text-[15px] text-white/90">{card.sub}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nav(card.to);
              }}
              className="mt-5 flex items-center gap-1.5 rounded-full bg-white px-5 py-3 text-sm font-bold text-text-primary shadow-lg transition-transform active:scale-95"
            >
              <Sparkles size={16} /> {card.btn} <ChevronRight size={15} />
            </button>
          </>
        )}
      </div>

      {/* right action rail */}
      <div className="absolute bottom-32 right-3 z-10 flex flex-col items-center gap-5">
        <Rail
          onClick={() => like()}
          active={liked}
          icon={
            <Heart
              size={28}
              fill={liked ? "#F43F6E" : "none"}
              stroke={liked ? "#F43F6E" : "#fff"}
            />
          }
          label={`${(likeBase + (liked ? 1 : 0)).toLocaleString("en-IN")}`}
        />
        <Rail
          onClick={() => toast("Comments open when you go live ✦")}
          icon={<MessageCircle size={27} stroke="#fff" />}
          label="Ask"
        />
        <Rail
          onClick={() => toast("Link copied — share the cosmos")}
          icon={<Send size={26} stroke="#fff" />}
          label="Share"
        />
        <Rail
          onClick={() => {
            setSaved((s) => !s);
            if (!saved) toast("Saved to your stars ✦");
          }}
          active={saved}
          icon={
            <Bookmark
              size={26}
              fill={saved ? "#FFC53D" : "none"}
              stroke={saved ? "#FFC53D" : "#fff"}
            />
          }
          label="Save"
        />
      </div>

      {/* brand corner */}
      <div className="absolute left-6 top-14 z-10 flex items-center gap-1.5 text-white/80">
        <Spark size={14} />
        <span className="text-xs font-bold tracking-wide">Cosmic Scroll</span>
        <span className="text-[10px] text-white/50">· swipe up</span>
      </div>
    </section>
  );
}

function Rail({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex flex-col items-center gap-1"
    >
      <span
        className={`drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform ${
          active ? "scale-110" : ""
        }`}
      >
        {icon}
      </span>
      <span className="text-[11px] font-semibold text-white drop-shadow">{label}</span>
    </motion.button>
  );
}
