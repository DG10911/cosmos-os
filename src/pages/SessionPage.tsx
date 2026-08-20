import { useState, useEffect, useRef, useMemo } from "react";
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
import { CheckCheck } from "lucide-react";
import { TrustSigil } from "./TodayPage";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { askTwin, hasLiveAi } from "../lib/ai";
import { openRazorpay } from "../lib/razorpay";
import { Confetti } from "../components/Confetti";
import { VoiceNote } from "../components/Waveform";
import { Spark, Gem } from "../components/Glyphs";
import { getUser } from "../data/user";
import { deriveChart } from "../lib/chart";
import {
  openingScript,
  afterBuyScript,
  ritualFromChart,
  personalizedRitual,
  lifeSnapshot,
  sessionSummary,
  sessionSummarySync,
  type Ritual,
  type ScriptMsg as ChatMsg,
} from "../lib/astrologer";
import { saveSession } from "../lib/session";

export default function SessionPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const app = useApp();
  const toast = useToast();
  const a = ASTROLOGERS.find((x) => x.id === Number(id)) ?? ASTROLOGERS[0];

  // Everything below is derived from the logged-in user's OWN chart.
  const user = useMemo(() => getUser(), []);
  const chart = useMemo(() => deriveChart(user), [user]);
  const snap = useMemo(() => lifeSnapshot(user, chart), [user, chart]);
  const script = useMemo(() => openingScript(user, chart), [user, chart]);

  const [visible, setVisible] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [snapOpen, setSnapOpen] = useState(true);
  const [timer, setTimer] = useState(272); // 4:32
  const [showWhy, setShowWhy] = useState(false);
  const [bought, setBought] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [showBought, setShowBought] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [ritual, setRitual] = useState<Ritual>(() => ritualFromChart(chart, a.name));
  const boughtRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Upgrade the (already-personalised) ritual with a live-AI version if a key
  // is connected. Falls back silently to the chart-driven ritual otherwise.
  useEffect(() => {
    let alive = true;
    const lastUser = script.filter((m) => m.kind === "user").map((m) => (m as { text: string }).text);
    personalizedRitual(chart, a.name, lastUser).then((r) => {
      if (alive) setRitual(r);
    });
    return () => {
      alive = false;
    };
  }, [chart, a.name, script]);

  // session timer
  useEffect(() => {
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // auto-play the personalised opening with typing indicators
  useEffect(() => {
    let cancelled = false;
    async function play() {
      for (let i = 0; i < script.length; i++) {
        const msg = script[i];
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
  }, [script]);

  // auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [visible, typing]);

  function completePurchase() {
    setBought(true);
    boughtRef.current = true;
    setShowWhy(false);
    setShowBought(true);
    setConfetti((c) => c + 1);
    app.markBoughtRitual();
  }

  async function buyRitual() {
    setShowWhy(false);
    // Try the REAL Razorpay checkout (test mode, public key only). If Razorpay
    // isn't configured, fall back to the in-app confirmation flow.
    const opened = await openRazorpay({
      amountInr: ritual.price,
      description: ritual.title,
      onSuccess: () => {
        toast("Payment successful ✓");
        completePurchase();
      },
      onDismiss: () => toast("Payment cancelled"),
    });
    if (!opened) completePurchase();
  }

  function continueAfterBuy() {
    setShowBought(false);
    (async () => {
      for (const msg of afterBuyScript(chart)) {
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

  // Generate the recap (AI when available, chart template otherwise), persist
  // it so the Summary + Prediction pages show what the user was actually told.
  async function endSession() {
    const transcript = visible
      .filter((m) => m.kind === "astro" || m.kind === "user")
      .map((m) => ({ role: m.kind as "astro" | "user", text: (m as { text: string }).text }));
    const summary = await withTimeout(
      sessionSummary(chart, a.name, user?.goals, ritual, transcript),
      3500,
      sessionSummarySync(chart, a.name, user?.goals, ritual),
    );
    saveSession({
      astrologerName: a.name,
      astrologerId: a.id,
      minutes: Math.max(1, Math.round(timer / 60)),
      said: summary.said,
      todo: summary.todo,
      prediction: summary.prediction,
      ritual,
      ritualBought: boughtRef.current,
      at: Date.now(),
    });
    nav(`/session/${a.id}/summary`);
  }

  // Contextual astrologer replies when the live AI isn't connected — now keyed
  // to the user's OWN dasha + lucky day instead of a fixed persona.
  function cannedReply(q: string): string {
    const t = q.toLowerCase();
    const md = chart.mahadashaLord;
    if (/marriage|shaadi|partner|love|relationship/.test(t))
      return `Venus threads through your ${chart.rashiEn} Moon, so the heart is warm right now. Your ${md} Mahadasha asks for honest conversations over grand gestures — speak from your chart, not your fear.`;
    if (/job|career|work|promotion|business/.test(t))
      return `Your ${md} Mahadasha governs this career phase, and ${chart.luckyDay}s are your strongest window. Time a big ask near your ${chart.antardashaLord} sub-period rather than rushing it.`;
    if (/money|finance|wealth|loan|invest/.test(t))
      return `${md} is teaching patience with money this year — steady beats sudden. Avoid commitments outside your ${chart.luckyHour} window; a disciplined approach suits your chart far better than a gamble.`;
    if (/health|stress|anxiety|sleep|tired/.test(t))
      return `Your ${md} period can scatter energy. Ground with the ${chart.gem.mantra} japa at sunset and a short morning meditation — small, daily, and your ${chart.nakshatra} chart responds.`;
    return `I hear you. Reading your chart — Moon in ${chart.rashiEn}, ${chart.nakshatra}, in a ${md} Mahadasha — this is a season of transformation. Tell me more and I'll ground my guidance in your exact transits.`;
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setInput("");
    setVisible((v) => [...v, { kind: "user", text: q } as ChatMsg]);
    setTyping(true);
    let reply = "";
    if (hasLiveAi()) {
      try {
        reply = await askTwin([{ role: "user", text: q }]);
      } catch {
        reply = cannedReply(q);
      }
    } else {
      await wait(1200);
      reply = cannedReply(q);
    }
    setTyping(false);
    setVisible((v) => [...v, { kind: "astro", text: reply } as ChatMsg]);
  }

  const mm = Math.floor(timer / 60);
  const ss = String(timer % 60).padStart(2, "0");

  return (
    <div className="relative flex h-screen w-full flex-col bg-bg">
      <Confetti fire={confetti} />

      {/* Top bar */}
      <header
        className="flex items-center gap-2 border-b border-gold/15 bg-bg/90 px-3 py-2.5 backdrop-blur"
        style={{ paddingTop: "calc(0.625rem + var(--safe-top))" }}
      >
        <button onClick={() => nav(-1)} className="text-text-muted">
          <ChevronLeft size={22} />
        </button>
        <span className="relative flex h-11 w-11 items-center justify-center">
          <span className="absolute inset-0 rounded-full ring-2 ring-success/70" style={{ animation: "live-ring 2s ease-out infinite" }} />
          <img
            src={avatarUrl(a.id)}
            alt={a.name}
            className="h-10 w-10 rounded-full bg-bg-elevated"
          />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-text-primary">{a.name}</span>
            <TrustSigil score={a.trust} />
          </div>
          <span className="text-[11px] text-success">
            In session · {mm}:{ss}
          </span>
        </div>
        <button
          onClick={endSession}
          className="rounded-full bg-danger/90 px-3 py-1.5 text-xs font-semibold text-text-primary"
        >
          End
        </button>
      </header>

      {/* Life Snapshot */}
      <LifeSnapshot open={snapOpen} setOpen={setSnapOpen} astro={a.name} snap={snap} />

      {/* Chat body */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {visible.map((msg, i) => (
          <Bubble
            key={i}
            msg={msg}
            ritual={ritual}
            onBuy={buyRitual}
            onWhy={() => setShowWhy(true)}
            onSkip={() => {
              setSkipped(true);
              toast("No problem — saved to your remedies for later");
            }}
            bought={bought}
            skipped={skipped}
          />
        ))}
        {typing && <TypingDots />}
        <div className="h-2" />
      </div>

      {/* Input */}
      <div className="border-t border-gold/15 bg-bg/90 px-3 pb-3 pt-2 backdrop-blur">
        <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto">
          {["Will I get the promotion?", "When is my marriage?", "How's my money this year?"].map(
            (q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={typing}
                className="whitespace-nowrap rounded-full border border-gold/25 bg-bg-card px-3 py-1.5 text-xs text-text-primary active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={`Message ${a.name.split(" ")[0]}…`}
            className="h-11 flex-1 rounded-full bg-bg-card px-4 text-sm text-text-primary outline-none placeholder:text-text-muted/60"
          />
          <button
            onClick={() => toast("Voice notes need mic access — coming to the app build")}
            className="text-text-muted active:scale-90"
            aria-label="Voice note"
          >
            <Mic size={20} />
          </button>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-white transition active:scale-90 disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Why modal */}
      <AnimatePresence>
        {showWhy && (
          <Modal onClose={() => setShowWhy(false)}>
            <h3 className="serif text-xl text-text-primary">
              Why {ritual.title.split(" (")[0]}?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {ritual.why}
            </p>
            <button
              onClick={buyRitual}
              className="btn-gold mt-5 w-full rounded-btn"
            >
              Got it — add to my order
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* Bought modal */}
      <AnimatePresence>
        {showBought && (
          <Modal onClose={continueAfterBuy}>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <Gem size={26} />
              </div>
              <h3 className="serif mt-3 text-xl text-text-primary">Ordered!</h3>
              <p className="mt-2 text-sm text-text-muted">
                Your {ritual.title} arrives in 5 days. {a.name} has been notified
                and will guide the energising ritual.
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

type Snap = ReturnType<typeof lifeSnapshot>;

function LifeSnapshot({
  open,
  setOpen,
  astro,
  snap,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  astro: string;
  snap: Snap;
}) {
  const tiles = [
    { icon: <Compass size={14} className="text-cosmic" />, label: "Chart", value: snap.chart },
    { icon: <History size={14} className="text-cosmic" />, label: "Recent", value: snap.recent },
    { icon: <Target size={14} className="text-gold" />, label: "Open Prediction", value: snap.openPrediction },
    { icon: <TrendingDown size={14} className="text-danger" />, label: "Dasha", value: snap.moodTrend },
  ];
  return (
    <div
      className="border-b border-cyan-400/20"
      style={{
        background: "linear-gradient(180deg, #FFF6EC, #FFFFFF)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5"
      >
        <div className="flex items-center gap-2">
          <Brain size={15} className="text-cyan-300" />
          <span className="text-xs font-semibold text-text-primary">
            {snap.name} Life Snapshot
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">
            Only {astro} sees this
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
                  className="flex min-w-[130px] flex-col gap-1 rounded-xl border border-gold/15 bg-bg/40 p-2.5"
                >
                  <div className="flex items-center gap-1">
                    {t.icon}
                    <span className="text-[10px] text-text-muted">{t.label}</span>
                  </div>
                  <span className="text-[12px] font-medium leading-tight text-text-primary">
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
  ritual,
  onBuy,
  onWhy,
  onSkip,
  bought,
  skipped,
}: {
  msg: ChatMsg;
  ritual: Ritual;
  onBuy: () => void;
  onWhy: () => void;
  onSkip: () => void;
  bought: boolean;
  skipped: boolean;
}) {
  if (msg.kind === "ritual") {
    return <RitualCard ritual={ritual} onBuy={onBuy} onWhy={onWhy} onSkip={onSkip} bought={bought} skipped={skipped} />;
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
  if (msg.kind === "voice") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start"
      >
        <div className="cosmic-card rounded-2xl rounded-bl-sm px-3 py-2.5">
          <VoiceNote seconds={msg.seconds} />
        </div>
      </motion.div>
    );
  }
  const isUser = msg.kind === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm text-white"
            : "cosmic-card rounded-bl-sm text-text-primary"
        }`}
        style={
          isUser
            ? { background: "linear-gradient(180deg,#F4C430,#d4a520)" }
            : undefined
        }
      >
        {msg.text}
      </div>
      {isUser && (
        <span className="mt-1 flex items-center gap-0.5 pr-1 text-[10px] text-text-muted">
          Read <CheckCheck size={12} className="text-cosmic" />
        </span>
      )}
    </motion.div>
  );
}

function RitualCard({
  ritual,
  onBuy,
  onWhy,
  onSkip,
  bought,
  skipped,
}: {
  ritual: Ritual;
  onBuy: () => void;
  onWhy: () => void;
  onSkip: () => void;
  bought: boolean;
  skipped: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }}
      className="aura-border overflow-hidden rounded-2xl p-4"
      style={{
        background:
          "radial-gradient(120% 100% at 100% 0%, rgba(244,196,48,0.18), transparent 55%), linear-gradient(150deg, #FFEBD5, #FFE9CE)",
        boxShadow: "0 14px 40px rgba(139,124,252,0.42)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <Spark size={17} className="text-gold" />
        <span className="serif text-[17px] text-gold">
          Ritual Suggestion — matched to your chart
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-indigo-700/25">
          <Gem size={44} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-text-primary">{ritual.title}</p>
          <p className="text-[11px] text-text-muted">{ritual.subtitle}</p>
          <p className="mt-0.5 text-[13px] text-text-muted">{ritual.reason}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gold">
              ₹{ritual.price.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-text-muted line-through">
              ₹{ritual.strike.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {bought ? (
        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-btn bg-success/15 py-2.5 text-center text-sm font-semibold text-success">
          <CheckCheck size={15} /> Added to your order
        </div>
      ) : skipped ? (
        <div className="mt-3 rounded-btn bg-black/[0.04] py-2.5 text-center text-sm font-medium text-text-muted">
          Saved to your remedies · maybe later
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onBuy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-gold py-2.5 text-sm font-semibold text-white active:scale-95"
          >
            <Spark size={14} /> Buy Now
          </button>
          <button
            onClick={onSkip}
            className="rounded-btn border border-gold/20 px-3 py-2.5 text-sm text-text-primary active:scale-95"
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

      <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-text-muted">
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
        className="w-full max-w-[390px] rounded-2xl border border-gold/20 bg-bg-elevated p-5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((r) => setTimeout(() => r(fallback), ms)),
  ]);
}
