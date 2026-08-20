import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Sparkles, Languages } from "lucide-react";

/**
 * "Call Cosmo" — dials the real Sarvam AI voice agent (a telephony agent that
 * holds a natural spoken astrology conversation in Hindi or English). The number
 * comes from VITE_SARVAM_AGENT_PHONE (falls back to the demo agent). On a phone
 * this opens the dialer; on desktop the sheet shows the number to call.
 */
const PHONE = (import.meta.env.VITE_SARVAM_AGENT_PHONE as string) || "+918065354027";
const TEL = `tel:${PHONE.replace(/\s+/g, "")}`;

export function CallCosmo({ variant = "chip" }: { variant?: "chip" | "tile" }) {
  const [open, setOpen] = useState(false);

  const Trigger =
    variant === "tile" ? (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-card p-4 text-left"
        style={{
          background: "linear-gradient(135deg,#16A34A,#0EA5E9)",
          boxShadow: "0 12px 30px rgba(14,165,233,0.32)",
        }}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Phone size={18} className="text-white" />
        </span>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-white">Call Cosmo — AI voice agent →</p>
          <p className="text-[10px] text-white/85">talk naturally in Hindi or English</p>
        </div>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold text-white">
          LIVE
        </span>
      </button>
    ) : (
      <button
        onClick={() => setOpen(true)}
        aria-label="Call Cosmo voice agent"
        className="flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1.5 text-[11px] font-bold text-success"
      >
        <Phone size={12} /> Call
      </button>
    );

  return (
    <>
      {Trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 px-4 pb-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-gold/20 bg-bg-elevated"
            >
              <div
                className="relative p-6 text-center text-white"
                style={{ background: "linear-gradient(150deg,#16A34A,#0EA5E9)" }}
              >
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 text-white/80"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                  <Phone size={30} />
                </div>
                <h3 className="serif mt-3 text-2xl">Talk to Cosmo</h3>
                <p className="mt-1 text-sm text-white/90">Your AI astrologer, on a real call</p>
              </div>

              <div className="p-5">
                <p className="text-sm leading-relaxed text-text-muted">
                  Cosmo is a live AI voice agent. Call and just talk — about your day,
                  your chart, a decision you're weighing — and it answers naturally,
                  grounded in Vedic astrology.
                </p>
                <div className="mt-3 flex gap-2">
                  <Feature icon={<Languages size={14} className="text-cosmic" />} text="Hindi & English" />
                  <Feature icon={<Sparkles size={14} className="text-gold" />} text="Knows Vedic timing" />
                </div>

                <a
                  href={TEL}
                  className="btn-gold mt-5 flex w-full items-center justify-center gap-2 rounded-btn"
                >
                  <Phone size={16} /> Call Cosmo now
                </a>
                <p className="mt-2 text-center text-[12px] text-text-muted">
                  {PHONE} · tap on mobile to dial
                </p>
                <p className="mt-3 text-center text-[10px] text-text-muted">
                  Powered by Sarvam AI voice agents
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] text-text-primary">
      {icon} {text}
    </span>
  );
}
