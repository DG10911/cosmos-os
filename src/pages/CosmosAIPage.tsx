import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, UserRound, Zap, X, CornerDownRight, Mic, Volume2, VolumeX } from "lucide-react";
import { askTwin, hasLiveAi, setAiKey } from "../lib/ai";
import { voiceSupported, listen, speak, stopSpeaking } from "../lib/voice";

type Msg = { role: "ai" | "user"; text: string };

const SUGGESTED = [
  "Why am I feeling stuck lately?",
  "What does this week look like?",
  "Should I change jobs?",
  "What does my relationship chart say?",
];

/** Contextual follow-ups shown after any answer. */
const FOLLOWUPS = [
  "Tell me more",
  "What should I do today?",
  "When is the best timing?",
  "Any remedy for this?",
];

/** Canned, chart-aware responses so the demo feels intelligent & personal. */
const ANSWERS: Record<string, string> = {
  "Why am I feeling stuck lately?":
    "Your mood log has drifted below baseline for 7 days, and Rahu periods often amplify that stuck, restless feeling. It's a signal, not a flaw. Try today's ritual — lighting a diya at sunset — and a 10-minute grounding meditation. Want me to add it to your Missions?",
  "What does this week look like?":
    "Your Rahu Mahadasha keeps energy high but scattered this week. Tuesday and Friday afternoons (your Lucky Hours) are strongest for decisions. Guard against overcommitting on Wednesday — Mercury is retrograde-adjacent for your Moon.",
  "Should I change jobs?":
    "Thursday's Best Work window aligns with Jupiter's aspect on your 10th house of career, so conversations land well then. Pt. Suresh flagged Nov 2026 as your promotion aperture — if you can, time a move to ride that, rather than jumping in a rush.",
  "What does my relationship chart say?":
    "Venus sits favorably for your Moon sign right now — warmth comes easily, but Rahu can make you crave intensity over stability. After the 14th, when the Moon transits your 3rd house, honest conversations flow. Want a compatibility card for someone specific?",
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
      text: "Hi Anya — I'm your Cosmos Twin. I remember every reading, ritual, and mood you log. Ask me anything, anytime.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [live, setLive] = useState(hasLiveAi());
  const [keySheet, setKeySheet] = useState(false);
  const [keyDraft, setKeyDraft] = useState("");
  const [voiceOn, setVoiceOn] = useState(false); // speak replies aloud
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  // stop any speech when leaving the screen
  useEffect(() => () => stopSpeaking(), []);

  function finish(answer: string) {
    setTyping(false);
    setMsgs((m) => [...m, { role: "ai", text: answer }]);
    if (voiceOn) speak(answer, lang);
  }

  async function send(text: string) {
    if (!text.trim() || typing) return;
    const history = [...msgs, { role: "user" as const, text }];
    setMsgs(history);
    setInput("");
    setTyping(true);
    stopSpeaking();

    if (live) {
      try {
        finish(await askTwin(history));
        return;
      } catch {
        // fall through to offline guidance below
      }
    }
    setTimeout(() => finish(reply(text)), 1100);
  }

  function micTap() {
    if (listening) return;
    stopSpeaking();
    setVoiceOn(true); // enable spoken replies once they've spoken
    setListening(true);
    listen({
      lang,
      onResult: (t) => send(t),
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    });
  }

  function saveKey() {
    setAiKey(keyDraft);
    setLive(hasLiveAi());
    setKeySheet(false);
    setKeyDraft("");
  }

  const showSuggestions = msgs.length === 1;

  return (
    <div
      className="relative flex h-screen w-full flex-col"
      style={{ background: "linear-gradient(180deg,#FFEAD2,#FFE6C9)" }}
    >
      {/* header */}
      <header
        className="glass flex items-center gap-2 border-b border-gold/15 px-3 py-2.5"
        style={{ paddingTop: "calc(0.625rem + var(--safe-top))" }}
      >
        <button onClick={() => nav(-1)} className="text-text-muted">
          <ChevronLeft size={22} />
        </button>
        <Orb size={30} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">Cosmos Twin</p>
          <p className="text-[11px] text-cosmic">
            {live ? "Live AI · knows your chart" : "Always here · knows your chart"}
          </p>
        </div>
        <button
          onClick={() => setKeySheet(true)}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${
            live
              ? "bg-success/12 text-success"
              : "bg-cosmic/10 text-cosmic ring-1 ring-cosmic/25"
          }`}
        >
          <Zap size={12} className={live ? "fill-current" : ""} />
          {live ? "Live" : "Go live"}
        </button>
      </header>

      {/* messages */}
      <div ref={scroller} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {showSuggestions && (
          <div className="flex flex-col items-center pb-4 pt-8">
            <Orb size={96} />
            <p className="serif mt-5 text-center text-2xl text-text-primary">
              Ask your Twin anything
            </p>
            <p className="mt-1 text-center text-xs text-text-muted">
              Grounded in your exact chart &amp; history
            </p>
            {/* chart-aware identity — proves it knows YOUR chart */}
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {["Cancer Asc", "Rohini Nakshatra", "Rahu Mahadasha"].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-cosmic/10 px-2.5 py-1 text-[11px] font-semibold text-cosmic ring-1 ring-cosmic/20"
                >
                  {c}
                </span>
              ))}
            </div>
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
                  ? "rounded-br-sm text-white"
                  : "cosmic-card rounded-bl-sm text-text-primary"
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
              <span className="ml-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-text-muted">
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
                className="glass whitespace-nowrap rounded-full border border-cosmic/30 px-3.5 py-2 text-xs text-text-primary"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* follow-up suggestions after an answer — premium AI affordance */}
      {!showSuggestions && !typing && msgs[msgs.length - 1]?.role === "ai" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2"
        >
          {FOLLOWUPS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="flex items-center gap-1 whitespace-nowrap rounded-full border border-cosmic/25 bg-bg-card px-3 py-1.5 text-xs text-cosmic"
            >
              <CornerDownRight size={12} /> {s}
            </button>
          ))}
        </motion.div>
      )}

      {/* listening banner */}
      {listening && (
        <div className="flex items-center justify-center gap-2 pb-1 text-xs font-semibold text-cosmic">
          <span className="flex gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-cosmic"
                style={{ height: 12, animation: `vwave 0.9s ease-in-out ${i * 0.12}s infinite` }}
              />
            ))}
          </span>
          Listening… speak now
          <style>{`@keyframes vwave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1.4)}}`}</style>
        </div>
      )}

      {/* composer */}
      <div className="glass border-t border-gold/15 px-3 pb-4 pt-2">
        <div className="flex items-center gap-2">
          {voiceSupported() && (
            <button
              onClick={micTap}
              aria-label="Speak to your Twin"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                listening
                  ? "bg-danger text-white"
                  : "bg-cosmic/12 text-cosmic ring-1 ring-cosmic/25"
              }`}
            >
              <Mic size={18} className={listening ? "animate-pulse" : ""} />
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={listening ? "Listening…" : "Ask your Cosmos Twin…"}
            className="h-11 flex-1 rounded-full bg-bg-card px-4 text-sm text-text-primary outline-none placeholder:text-text-muted/60"
          />
          <button
            onClick={() => send(input)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: "linear-gradient(135deg,#8B7CFC,#F4C430)" }}
          >
            <Send size={18} />
          </button>
        </div>
        {voiceSupported() && (
          <div className="mt-2 flex items-center justify-center gap-3 text-[11px]">
            <button
              onClick={() => {
                setVoiceOn((v) => !v);
                stopSpeaking();
              }}
              className={`flex items-center gap-1 font-semibold ${voiceOn ? "text-cosmic" : "text-text-muted"}`}
            >
              {voiceOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
              {voiceOn ? "Voice replies on" : "Voice replies off"}
            </button>
            <span className="text-text-muted/40">·</span>
            <button
              onClick={() => setLang((l) => (l === "en-IN" ? "hi-IN" : "en-IN"))}
              className="font-semibold text-cosmic"
            >
              {lang === "en-IN" ? "English" : "हिंदी"}
            </button>
          </div>
        )}
        <p className="mt-1.5 text-center text-[10px] text-text-faint">
          Cosmos Twin offers guidance, not medical or financial advice.
        </p>
      </div>

      {/* Connect live AI sheet */}
      <AnimatePresence>
        {keySheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setKeySheet(false)}
            className="absolute inset-0 z-40 flex items-end bg-black/50 px-4 pb-6"
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-2xl bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <h3 className="serif text-xl text-text-primary">
                  {live ? "Live AI connected ✦" : "Connect live AI"}
                </h3>
                <button onClick={() => setKeySheet(false)} className="text-text-muted">
                  <X size={18} />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                Paste your OpenAI API key to make the Twin answer for real
                (gpt-4o-mini, ~₹0.05 per question). The key stays only in{" "}
                <b>your browser</b> — never uploaded, never in our code. Without
                it, the Twin uses built-in guidance.
              </p>
              <input
                type="password"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder="sk-…"
                className="mt-4 h-12 w-full rounded-btn border border-gold/25 bg-white px-4 text-sm text-text-primary outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
              />
              <button
                disabled={keyDraft.trim().length < 20}
                onClick={saveKey}
                className="btn-gold mt-4 w-full rounded-full text-sm disabled:opacity-40"
              >
                Connect
              </button>
              {live && (
                <button
                  onClick={() => {
                    setAiKey("");
                    setLive(false);
                    setKeySheet(false);
                  }}
                  className="mt-3 w-full text-center text-xs text-danger"
                >
                  Disconnect & forget key
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
