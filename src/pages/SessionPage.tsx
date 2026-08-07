import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Brain,
  Compass,
  History,
  Target,
  TrendingDown,
  ShieldCheck,
  Send,
  Mic,
  ChevronUp,
} from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import {
  CHAT_SCRIPT,
  CHAT_AFTER_BUY,
  RITUAL,
  LIFE_SNAPSHOT,
  type ChatMsg,
} from "../data/chatScript";
import { TrustSigil } from "./TodayPage";
import { useApp } from "../state/AppState";
import { Confetti } from "../components/Confetti";

export default function SessionPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const app = useApp();
  const a = ASTROLOGERS.find((x) => x.id === Number(id)) ?? ASTROLOGERS[0];

  const [visible, setVisible] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [snapOpen, setSnapOpen] = useState(true);
  const [timer, setTimer] = useState(272); // 4:32
  const [showWhy, setShowWhy] = useState(false);
  const [bought, setBought] = useState(false);
  const [showBought, setShowBought] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // session timer
  useEffect(() => {
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // auto-play the scripted chat with typing indicators
  useEffect(() => {
    let cancelled = false;
    async function play() {
      for (let i = 0; i < CHAT_SCRIPT.length; i++) {
        const msg = CHAT_SCRIPT[i];
        if (msg.kind === "astro") {
          setTyping(true);
          await wait(1400);
          if (cancelled) return;
          setTyping(false);
        } else {
          await wait(700);
          if (cancelled) return;
        }
        setVisible((v) => [...v, msg]);
        await wait(500);
      }
    }
    play();
    return () => {
      cancelled = true;
    };
  }, []);

  // auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visible, typing]);

  function buyRitual() {
    setBought(true);
    setShowWhy(false);
    setShowBought(true);
    setConfetti((c) => c + 1);
    app.markBoughtRitual();
  }

  function continueAfterBuy() {
    setShowBought(false);
    // append the follow-up messages
    (async () => {
      for (const msg of CHAT_AFTER_BUY) {
        if (msg.kind === "astro") {
          setTyping(true);
          await wait(1200);
          setTyping(false);
        }
        setVisible((v) => [...v, msg]);
        await wait(400);
      }
    })();
  }

  const mm = Math.floor(timer / 60);
  const ss = String(timer % 60).padStart(2, "0");

  return (
    <div className="relative flex h-screen w-full flex-col bg-bg">
      <Confetti fire={confetti} />

      {/* Top bar */}
      <header className="flex items-center gap-2 border-b border-white/[0.06] bg-bg/90 px-3 py-2.5 backdrop-blur">
        <button onClick={() => nav(-1)} className="text-text-muted">
          <ChevronLeft size={22} />
        </button>
        <img
          src={avatarUrl(a.id)}
          alt={a.name}
          className="h-10 w-10 rounded-full bg-bg-elevated"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">{a.name}</span>
            <TrustSigil score={a.trust} />
          </div>
          <span className="text-[11px] text-success">
            In session · {mm}:{ss}
          </span>
        </div>
        <button
          onClick={() => nav(`/session/${a.id}/summary`)}
          className="rounded-full bg-danger/90 px-3 py-1.5 text-xs font-semibold text-white"
        >
          End
        </button>
      </header>

      {/* Life Snapshot */}
      <LifeSnapshot open={snapOpen} setOpen={setSnapOpen} astro={a.name} />

      {/* Chat body */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {visible.map((msg, i) => (
          <Bubble key={i} msg={msg} onBuy={buyRitual} onWhy={() => setShowWhy(true)} bought={bought} />
        ))}
        {typing && <TypingDots />}
        <div className="h-2" />
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] bg-bg/90 px-3 pb-3 pt-2 backdrop-blur">
        <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
          {["Tell me more", "Book follow-up", "Show me the ritual"].map((q) => (
            <button
              key={q}
              className="whitespace-nowrap rounded-full border border-white/12 bg-bg-card px-3 py-1.5 text-xs text-text-muted"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Message Pt. Suresh…"
            className="h-11 flex-1 rounded-full bg-bg-card px-4 text-sm text-white outline-none placeholder:text-text-muted/60"
          />
          <button className="text-text-muted">
            <Mic size={20} />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-bg">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Why modal */}
      <AnimatePresence>
        {showWhy && (
          <Modal onClose={() => setShowWhy(false)}>
            <h3 className="serif text-xl text-white">Why Neelam?</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {RITUAL.why}
            </p>
            <button
              onClick={buyRitual}
              className="btn-gold mt-5 w-full rounded-btn"
            >
              Got it — buy the ring
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* Bought modal */}
      <AnimatePresence>
        {showBought && (
          <Modal onClose={continueAfterBuy}>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl">
                ✨
              </div>
              <h3 className="serif mt-3 text-xl text-white">Ordered!</h3>
              <p className="mt-2 text-sm text-text-muted">
                Your Neelam ring arrives Aug 15. Pt. Suresh has been notified
                and will guide the energizing ritual.
              </p>
              <button
                onClick={continueAfterBuy}
                className="btn-gold mt-5 w-full rounded-btn"
              >
                Continue Chat
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Life Snapshot ---------- */

function LifeSnapshot({
  open,
  setOpen,
  astro,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  astro: string;
}) {
  const tiles = [
    { icon: <Compass size={14} className="text-cosmic" />, label: "Chart", value: LIFE_SNAPSHOT.chart },
    { icon: <History size={14} className="text-cosmic" />, label: "Recent", value: LIFE_SNAPSHOT.recent },
    { icon: <Target size={14} className="text-gold" />, label: "Open Prediction", value: LIFE_SNAPSHOT.openPrediction },
    { icon: <TrendingDown size={14} className="text-danger" />, label: "Mood", value: LIFE_SNAPSHOT.moodTrend },
  ];
  return (
    <div
      className="border-b border-cyan-400/20"
      style={{
        background: "linear-gradient(180deg, #1E1E33, #161629)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5"
      >
        <div className="flex items-center gap-2">
          <Brain size={15} className="text-cyan-300" />
          <span className="text-xs font-semibold text-white">
            Anya's Life Snapshot
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">
            Only {astro} sees this ✨
          </span>
          <ChevronUp
            size={16}
            className={`text-text-muted transition-transform ${open ? "" : "rotate-180"}`}
          />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
              {tiles.map((t) => (
                <div
                  key={t.label}
                  className="flex min-w-[130px] flex-col gap-1 rounded-xl border border-white/[0.06] bg-bg/40 p-2.5"
                >
                  <div className="flex items-center gap-1">
                    {t.icon}
                    <span className="text-[10px] text-text-muted">{t.label}</span>
                  </div>
                  <span className="text-[12px] font-medium leading-tight text-white">
                    {t.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Bubbles ---------- */

function Bubble({
  msg,
  onBuy,
  onWhy,
  bought,
}: {
  msg: ChatMsg;
  onBuy: () => void;
  onWhy: () => void;
  bought: boolean;
}) {
  if (msg.kind === "ritual") {
    return <RitualCard onBuy={onBuy} onWhy={onWhy} bought={bought} />;
  }
  if (msg.kind === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full bg-success/12 px-3 py-1 text-[11px] text-success">
          {msg.text}
        </span>
      </div>
    );
  }
  const isUser = msg.kind === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm text-bg"
            : "cosmic-card rounded-bl-sm text-white/90"
        }`}
        style={
          isUser
            ? { background: "linear-gradient(180deg,#F4C430,#d4a520)" }
            : undefined
        }
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function RitualCard({
  onBuy,
  onWhy,
  bought,
}: {
  onBuy: () => void;
  onWhy: () => void;
  bought: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }}
      className="aura-border overflow-hidden rounded-2xl p-4"
      style={{
        background:
          "radial-gradient(120% 100% at 100% 0%, rgba(244,196,48,0.18), transparent 55%), linear-gradient(150deg, #331e57, #1a0b2e)",
        boxShadow: "0 14px 40px rgba(139,124,252,0.42)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="serif text-[17px] text-gold">
          🌟 Ritual Suggestion from Pt. Suresh
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/40 to-indigo-700/40 text-4xl">
          💍
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-white">{RITUAL.title}</p>
          <p className="text-[11px] text-text-muted">{RITUAL.subtitle}</p>
          <p className="mt-0.5 text-[13px] text-white/70">{RITUAL.reason}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gold">
              ₹{RITUAL.price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-text-muted line-through">
              ₹{RITUAL.strike.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {bought ? (
        <div className="mt-3 rounded-btn bg-success/15 py-2.5 text-center text-sm font-semibold text-success">
          ✓ Added to your order
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onBuy}
            className="flex-1 rounded-btn bg-gold py-2.5 text-sm font-semibold text-bg"
          >
            Buy Now ✨
          </button>
          <button
            onClick={onWhy}
            className="rounded-btn border border-white/15 px-3 py-2.5 text-sm text-white"
          >
            Skip
          </button>
          <button
            onClick={onWhy}
            className="px-1 text-xs font-medium text-cosmic underline"
          >
            Ask why?
          </button>
        </div>
      )}

      <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-white/60">
        <ShieldCheck size={12} className="text-success" /> 30-day Prediction
        Warranty
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="cosmic-card flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-text-muted"
            style={{
              animation: "typing 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes typing {0%,60%,100%{opacity:0.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}`}</style>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] rounded-2xl border border-white/10 bg-bg-elevated p-5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
