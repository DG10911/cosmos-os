import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { StarField } from "../components/StarField";
import { Mandala, Spark } from "../components/Glyphs";
import { saveUser } from "../data/user";

type Stage = "choose" | "phone" | "otp" | "loading" | "success";

export default function AuthPage() {
  const nav = useNavigate();
  const [stage, setStage] = useState<Stage>("choose");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (stage === "otp") setTimeout(() => refs.current[0]?.focus(), 300);
  }, [stage]);

  function handleOtp(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (i === 5 && d) verify(next);
  }

  function toSuccess() {
    setStage("loading");
    setTimeout(() => {
      setStage("success");
      setTimeout(() => nav("/onboarding"), 1500);
    }, 1600);
  }

  function verify(code = otp) {
    if (code.some((d) => !d)) return;
    toSuccess();
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <StarField count={90} />
      {/* slow-rotating mandala crown */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 z-0 -translate-x-1/2"
        style={{ animation: "mandala-spin 90s linear infinite" }}
      >
        <Mandala size={420} className="text-gold/15" />
      </div>
      <style>{`@keyframes mandala-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes orbit-a{from{transform:rotate(0deg) translateX(34px) rotate(0deg)}to{transform:rotate(360deg) translateX(34px) rotate(-360deg)}}
@keyframes orbit-b{from{transform:rotate(120deg) translateX(48px) rotate(-120deg)}to{transform:rotate(480deg) translateX(48px) rotate(-480deg)}}
@keyframes orbit-c{from{transform:rotate(240deg) translateX(60px) rotate(-240deg)}to{transform:rotate(600deg) translateX(60px) rotate(-600deg)}}`}</style>

      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-6"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        {/* back */}
        {(stage === "phone" || stage === "otp") && (
          <button
            onClick={() => setStage(stage === "otp" ? "phone" : "choose")}
            className="mt-6 flex w-fit items-center gap-1 text-sm text-text-muted"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}

        <div
          className={`flex flex-1 flex-col ${
            stage === "choose" ? "justify-start pt-16" : "justify-center"
          }`}
        >
          <AnimatePresence mode="wait">
            {/* ---------- CHOOSE ---------- */}
            {stage === "choose" && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl shadow-[0_10px_28px_rgba(255,107,44,0.35)]"
                  style={{ background: "linear-gradient(135deg,#FF6B2C,#FFB423)" }}
                >
                  <Spark size={30} className="text-white" />
                </motion.div>

                <h1 className="serif text-4xl leading-tight text-text-primary">
                  Welcome to your
                  <br />
                  <span className="grad-text">cosmic journey</span>
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
                  Sign in to unlock your chart, your rituals, and your daily
                  guidance.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    { label: "Continue with Google", icon: <GoogleMark /> },
                    { label: "Continue with Truecaller", icon: <TruecallerMark /> },
                    { label: "Continue with Apple", icon: <AppleMark /> },
                  ].map((b, i) => (
                    <motion.div
                      key={b.label}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.09 }}
                    >
                      <SocialButton label={b.label} icon={b.icon} onClick={toSuccess} />
                    </motion.div>
                  ))}
                </div>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-black/10" />
                  <span className="text-xs font-medium text-text-muted">or</span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setStage("phone")}
                  className="btn-gold flex w-full items-center justify-center gap-2 rounded-full text-[15px]"
                >
                  <Phone size={17} /> Continue with Phone
                </motion.button>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.62 }}
                  onClick={() => {
                    saveUser({
                      phone: "9876543210",
                      birthDate: "1999-03-14",
                      birthTime: "06:45",
                      birthPlace: "Jaipur, Rajasthan",
                      goals: ["Career growth", "Inner peace"],
                      notifyTime: "07:00",
                      whatsapp: true,
                      onboardedAt: 0,
                    });
                    nav("/today");
                  }}
                  className="mt-4 w-full text-center text-[13px] font-semibold text-cosmic underline decoration-cosmic/30"
                >
                  Just exploring? Enter the instant demo →
                </motion.button>

                <p className="mt-5 text-center text-[11px] leading-relaxed text-text-muted">
                  By continuing you agree to our{" "}
                  <span className="font-semibold text-gold underline decoration-gold/40">Terms</span> &{" "}
                  <span className="font-semibold text-gold underline decoration-gold/40">Privacy Policy</span>.
                </p>
              </motion.div>
            )}

            {/* ---------- PHONE ---------- */}
            {stage === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
              >
                <h2 className="serif text-3xl text-text-primary">Enter your number</h2>
                <p className="mt-2 text-sm text-text-muted">
                  We'll send a one-time code to verify it's you.
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-14 items-center rounded-btn border border-gold/25 bg-white px-4 text-lg font-semibold text-text-primary shadow-[0_4px_14px_rgba(191,105,30,0.08)]">
                    🇮🇳 +91
                  </div>
                  <input
                    autoFocus
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="98765 43210"
                    className="h-14 flex-1 rounded-btn border border-gold/25 bg-white px-4 text-lg font-semibold tracking-wide text-text-primary shadow-[0_4px_14px_rgba(191,105,30,0.08)] outline-none placeholder:font-normal placeholder:text-text-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/30"
                  />
                </div>
                <button
                  disabled={phone.length !== 10}
                  onClick={() => setStage("otp")}
                  className="btn-gold mt-8 flex w-full items-center justify-center gap-1.5 rounded-full disabled:opacity-40"
                >
                  Send OTP <ChevronRight size={16} />
                </button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-text-muted">
                  <ShieldCheck size={12} className="text-success" /> We never share your number
                </p>
              </motion.div>
            )}

            {/* ---------- OTP ---------- */}
            {stage === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
              >
                <h2 className="serif text-3xl text-text-primary">Verify your code</h2>
                <p className="mt-2 text-sm text-text-muted">
                  Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
                </p>
                <div className="mt-8 flex justify-center gap-2.5">
                  {otp.map((d, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      value={d}
                      onChange={(e) => handleOtp(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0)
                          refs.current[i - 1]?.focus();
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      animate={d ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="h-14 w-12 rounded-btn border-2 bg-white text-center text-2xl font-bold text-text-primary outline-none focus:ring-2 focus:ring-gold/40"
                      style={{
                        borderColor: d ? "#FF6B2C" : "rgba(255,154,31,0.25)",
                        boxShadow: d
                          ? "0 4px 16px rgba(255,107,44,0.25)"
                          : "0 4px 14px rgba(191,105,30,0.06)",
                      }}
                    />
                  ))}
                </div>
                <button
                  disabled={otp.some((d) => !d)}
                  onClick={() => verify()}
                  className="btn-gold mt-8 flex w-full items-center justify-center gap-2 rounded-full disabled:opacity-40"
                >
                  Verify & Continue
                </button>
                <p className="mt-4 text-center text-xs text-text-muted">
                  Didn't get it? <span className="font-semibold text-gold">Resend in 30s</span>
                </p>
              </motion.div>
            )}

            {/* ---------- LOADING — orbiting planets ---------- */}
            {stage === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative flex h-36 w-36 items-center justify-center">
                  {/* orbit rings */}
                  <span className="absolute h-[68px] w-[68px] rounded-full border border-gold/25" />
                  <span className="absolute h-[96px] w-[96px] rounded-full border border-cosmic/20" />
                  <span className="absolute h-[120px] w-[120px] rounded-full border border-rose/20" />
                  {/* sun core */}
                  <span
                    className="h-9 w-9 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 35% 30%,#FFC53D,#FF6B2C)",
                      boxShadow: "0 0 24px rgba(255,154,31,0.7)",
                      animation: "flame-flicker 1.6s ease-in-out infinite",
                    }}
                  />
                  {/* orbiting planets */}
                  <span
                    className="absolute h-3 w-3 rounded-full bg-cosmic"
                    style={{ animation: "orbit-a 1.6s linear infinite", boxShadow: "0 0 10px rgba(124,58,237,0.8)" }}
                  />
                  <span
                    className="absolute h-2.5 w-2.5 rounded-full bg-rose"
                    style={{ animation: "orbit-b 2.4s linear infinite", boxShadow: "0 0 10px rgba(244,63,110,0.8)" }}
                  />
                  <span
                    className="absolute h-2 w-2 rounded-full bg-amber"
                    style={{ animation: "orbit-c 3.2s linear infinite", boxShadow: "0 0 10px rgba(255,197,61,0.9)" }}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="serif mt-6 text-xl text-text-primary"
                >
                  Aligning your stars…
                </motion.p>
                <p className="mt-1 text-xs text-text-muted">reading today's sky for you</p>
              </motion.div>
            )}

            {/* ---------- SUCCESS ---------- */}
            {stage === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 30%,#4ADE80,#16A34A)",
                    boxShadow: "0 0 40px rgba(74,222,128,0.5)",
                  }}
                >
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <motion.path
                      d="M4 12.5l5 5L20 6"
                      stroke="#fff"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    />
                  </svg>
                  <Spark
                    size={18}
                    className="absolute -right-1 -top-1 text-gold"
                    style={{ animation: "twinkle 1.5s ease-in-out infinite" }}
                  />
                </motion.div>
                <h2 className="serif mt-6 text-3xl text-text-primary">You're in ✦</h2>
                <p className="mt-1 text-sm text-text-muted">Let's map your stars.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {stage === "choose" && (
          <div className="flex items-center justify-center gap-1.5 pb-8 text-[11px] text-text-muted">
            <ShieldCheck size={13} className="text-success" /> Bank-grade encryption · Your data stays private
          </div>
        )}
      </div>
    </div>
  );
}

function SocialButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-btn border border-gold/20 bg-white px-4 py-3.5 text-sm font-semibold text-text-primary shadow-[0_4px_16px_rgba(191,105,30,0.08)] transition-all active:scale-[0.98] active:shadow-none"
    >
      <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
      {label}
      <ChevronRight size={16} className="ml-auto text-text-muted/50" />
    </button>
  );
}

/* Brand marks — drawn, not emoji */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7C21.8 18.6 23 15.8 23 12.3Z" />
      <path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v2.9C3.7 20.5 7.5 23 12 23Z" />
      <path fill="#FBBC05" d="M5.6 13.8c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V6.7H1.8C1 8.2.6 9.9.6 11.7s.4 3.5 1.2 5l3.8-2.9Z" />
      <path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.9 15.1.9 12 .9 7.5.9 3.7 3.4 1.8 6.7l3.8 2.9C6.5 6.9 9 5.4 12 5.4Z" />
    </svg>
  );
}
function TruecallerMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#0089FF" />
      <path d="M8.5 7c0 5 3 8 7 8.5-.5 1.4-1.8 2.3-3.3 2.3C9.3 17.8 7 14.4 7 10.5 7 9 7.6 7.9 8.5 7Z" fill="#fff" />
    </svg>
  );
}
function AppleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="#000">
      <path d="M16 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-1.1 2.7-2.1c.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.5ZM13.8 5.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-1 2.7 1 .1 2-.4 2.7-1.1Z" />
    </svg>
  );
}
