import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, UserRound } from "lucide-react";

type Msg = { role: "ai" | "user"; text: string };

const SUGGESTED = [
  "How's my week looking?",
  "Best day to ask for a raise?",
  "Why do I feel restless lately?",
  "Is it a good time to travel?",
];

/** Canned, chart-aware responses so the demo feels intelligent & personal. */
const ANSWERS: Record<string, string> = {
  "How's my week looking?":
    "Your Rahu Mahadasha keeps energy high but scattered this week. Tuesday and Friday afternoons (your Lucky Hours) are strongest for decisions. Guard against overcommitting on Wednesday — Mercury is retrograde-adjacent for your Moon.",
  "Best day to ask for a raise?":
    "Thursday, between 10:00–12:30 — your Best Work window aligns with Jupiter's aspect on your 10th house of career. Pt. Suresh also flagged Nov 2026 as your promotion window, so framing it as a longer-term ask lands well.",
  "Why do I feel restless lately?":
    "Your mood log has drifted below baseline for 7 days, and Rahu periods often amplify inner restlessness. It's a signal, not a flaw. Try today's ritual — lighting a diya at sunset — and a 10-minute grounding meditation. Want me to add it to your Missions?",
  "Is it a good time to travel?":
    "Short trips are favored after the 14th, when the Moon transits your 3rd house. Avoid long-haul on the 9th–11th. Shall I check auspicious departure muhurats for a specific date?",
};

function reply(q: string) {
  return (
    ANSWERS[q] ??
    "I hear you. Based on your chart — Cancer ascendant, Rohini Nakshatra, in a Rahu Mahadasha — this is a season of transformation. Tell me a little more and I'll ground my guidance in your exact transits. If it gets weighty, I can connect you with Pt. Suresh."
  );
}

export default function CosmosAIPage() {
  const nav = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hi Anya — I'm your Cosmos Twin. I remember every reading, ritual, and mood you log. Ask me anything, anytime. ✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "ai", text: reply(text) }]);
    }, 1300);
  }

  const showSuggestions = msgs.length === 1;

  return (
    <div
      className="relative flex h-screen w-full flex-col"
      style={{ background: "linear-gradient(180deg,#12081f,#0B0B14)" }}
    >
      {/* header */}
      <header className="glass flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
        <button onClick={() => nav(-1)} className="text-text-muted">
          <ChevronLeft size={22} />
        </button>
        <Orb size={30} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Cosmos Twin</p>
          <p className="text-[11px] text-cosmic">Always here · knows your chart</p>
        </div>
      </header>

      {/* messages */}
      <div ref={scroller} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {showSuggestions && (
          <div className="flex flex-col items-center pb-4 pt-8">
            <Orb size={96} />
            <p className="serif mt-5 text-center text-2xl text-white">
              Ask your Twin anything
            </p>
            <p className="mt-1 text-center text-xs text-text-muted">
              Grounded in your exact chart & history
            </p>
          </div>
        )}

        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && <Orb size={26} className="mr-2 mt-1 shrink-0" />}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm text-bg"
                  : "cosmic-card rounded-bl-sm text-white/90"
              }`}
              style={
                m.role === "user"
                  ? { background: "linear-gradient(180deg,#F4C430,#d4a520)" }
                  : undefined
              }
            >
              {m.text}
            </div>
            {m.role === "user" && (
              <span className="ml-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-text-muted">
                <UserRound size={13} />
              </span>
            )}
          </motion.div>
        ))}

        {typing && (
          <div className="flex items-center gap-2">
            <Orb size={26} />
            <div className="cosmic-card flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-cosmic"
                  style={{ animation: "typing 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2"
          >
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="glass whitespace-nowrap rounded-full border border-cosmic/30 px-3.5 py-2 text-xs text-white/90"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* composer */}
      <div className="glass border-t border-white/[0.06] px-3 pb-4 pt-2">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask your Cosmos Twin…"
            className="h-11 flex-1 rounded-full bg-bg-card px-4 text-sm text-white outline-none placeholder:text-text-muted/60"
          />
          <button
            onClick={() => send(input)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-bg"
            style={{ background: "linear-gradient(135deg,#8B7CFC,#F4C430)" }}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-text-faint">
          Cosmos Twin offers guidance, not medical or financial advice.
        </p>
      </div>

      <style>{`@keyframes typing {0%,60%,100%{opacity:0.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}`}</style>
    </div>
  );
}

/** Living cosmic orb — the Twin's avatar. Breathing gradient + glow. */
export function Orb({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 32% 28%, #F4C430 0%, #8B7CFC 45%, #4C1D95 100%)",
        boxShadow: "0 0 16px rgba(139,124,252,0.6), inset 0 0 10px rgba(255,255,255,0.25)",
        animation: "orb-breathe 3.5s ease-in-out infinite",
      }}
    >
      <style>{`@keyframes orb-breathe{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.06);filter:brightness(1.15)}}`}</style>
    </span>
  );
}
