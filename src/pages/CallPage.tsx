import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  PhoneOff,
  Brain,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { getUser } from "../data/user";
import { deriveChart } from "../lib/chart";
import { lifeSnapshot } from "../lib/astrologer";

type Phase = "connecting" | "ringing" | "live";

export default function CallPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const isVideo = params.get("type") !== "audio"; // default video
  const nav = useNavigate();
  const a = ASTROLOGERS.find((x) => x.id === Number(id)) ?? ASTROLOGERS[0];
  const snap = lifeSnapshot(getUser(), deriveChart(getUser()));

  const [phase, setPhase] = useState<Phase>("connecting");
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(!isVideo);
  const [wallet, setWallet] = useState(450);
  const timerRef = useRef<number | null>(null);

  // connect sequence: connecting → ringing → live
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ringing"), 1400);
    const t2 = setTimeout(() => setPhase("live"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // live timer + per-minute billing
  useEffect(() => {
    if (phase !== "live") return;
    timerRef.current = window.setInterval(() => {
      setSecs((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // deduct wallet each minute
  useEffect(() => {
    if (phase === "live" && secs > 0 && secs % 60 === 0) {
      setWallet((w) => Math.max(0, w - a.price));
    }
  }, [secs, phase, a.price]);

  const mm = Math.floor(secs / 60);
  const ss = String(secs % 60).padStart(2, "0");
  const cost = Math.max(1, Math.ceil(secs / 60)) * a.price;

  function end() {
    nav(`/session/${a.id}/summary`);
  }

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, rgba(124,58,237,0.55), transparent 60%), linear-gradient(160deg,#3B1470 0%,#7C1D5A 55%,#B3421A 100%)",
      }}
    >
      {/* astrologer "video" surface */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative flex flex-col items-center"
        >
          <div className="relative">
            {phase === "ringing" && (
              <>
                <span className="absolute inset-0 rounded-full ring-2 ring-white/50" style={{ animation: "live-ring 1.6s ease-out infinite" }} />
                <span className="absolute inset-0 rounded-full ring-2 ring-white/40" style={{ animation: "live-ring 1.6s ease-out 0.5s infinite" }} />
              </>
            )}
            <img
              src={avatarUrl(a.id)}
              alt={a.name}
              className="h-32 w-32 rounded-full border-4 border-white/25 bg-white/10 object-cover"
            />
            {phase === "live" && (
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[#3B1470] bg-success" />
            )}
          </div>
          <h2 className="serif mt-5 text-2xl">{a.name}</h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
            <ShieldCheck size={13} className="text-success" /> Verified · {a.systems.join(" · ")}
          </p>

          <div className="mt-3">
            {phase === "connecting" && <Status text="Connecting securely…" />}
            {phase === "ringing" && <Status text={`${a.name.split(" ")[0]} is joining…`} />}
            {phase === "live" && (
              <span className="mono rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                {isVideo && !camOff ? "● Live video" : "● Live audio"} · {mm}:{ss}
              </span>
            )}
          </div>
        </motion.div>

        {/* your self-view PiP (video mode) */}
        {isVideo && phase === "live" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-4 top-4 flex h-28 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-black/25 backdrop-blur"
          >
            {camOff ? (
              <VideoOff size={20} className="text-white/60" />
            ) : (
              <img src={avatarUrl(99)} alt="you" className="h-full w-full object-cover" />
            )}
          </motion.div>
        )}
      </div>

      {/* Life Snapshot — the astrologer's edge */}
      {phase === "live" && (
        <div className="relative z-10 mx-4 mb-2 rounded-2xl bg-white/10 p-3 backdrop-blur">
          <div className="flex items-center gap-1.5">
            <Brain size={14} className="text-cyan-300" />
            <span className="text-[11px] font-semibold">{snap.name} Life Snapshot</span>
            <span className="ml-auto text-[10px] text-white/60">only {a.name.split(" ")[0]} sees this</span>
          </div>
          <p className="mt-1 text-[11px] text-white/80">
            {snap.chart} · {snap.recent} · open: {snap.openPrediction}
          </p>
        </div>
      )}

      {/* wallet / billing */}
      {phase === "live" && (
        <div className="relative z-10 mx-4 mb-3 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur">
          <span className="flex items-center gap-1.5 text-sm">
            <Wallet size={15} className="text-amber" /> Balance ₹{wallet}
          </span>
          <span className="text-sm">
            <span className="text-white/70">₹{a.price}/min · </span>
            <span className="font-bold text-amber">₹{cost}</span>
          </span>
        </div>
      )}

      {/* controls */}
      <div className="relative z-10 flex items-center justify-center gap-4 pb-8 pt-2">
        <CtrlBtn active={!muted} onClick={() => setMuted((m) => !m)} on={<Mic size={22} />} off={<MicOff size={22} />} />
        {isVideo && (
          <CtrlBtn active={!camOff} onClick={() => setCamOff((c) => !c)} on={<Video size={22} />} off={<VideoOff size={22} />} />
        )}
        <CtrlBtn active onClick={() => {}} on={<Volume2 size={22} />} off={<Volume2 size={22} />} />
        <button
          onClick={end}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-danger shadow-[0_10px_30px_rgba(229,72,77,0.5)] active:scale-90"
        >
          <PhoneOff size={26} />
        </button>
      </div>

      {/* connecting overlay copy */}
      <AnimatePresence>
        {phase !== "live" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-28 text-center text-xs text-white/70"
          >
            End-to-end encrypted · your number stays private
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Status({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm text-white/85">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" style={{ animation: "typing 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
        ))}
      </span>
      {text}
      <style>{`@keyframes typing{0%,60%,100%{opacity:.3}30%{opacity:1}}`}</style>
    </span>
  );
}

function CtrlBtn({
  active,
  onClick,
  on,
  off,
}: {
  active: boolean;
  onClick: () => void;
  on: React.ReactNode;
  off: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-14 w-14 items-center justify-center rounded-full backdrop-blur transition active:scale-90 ${
        active ? "bg-white/15 text-white" : "bg-white text-[#3B1470]"
      }`}
    >
      {active ? on : off}
    </button>
  );
}
