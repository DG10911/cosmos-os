import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { StarField } from "../components/StarField";
import { ONBOARDING_ART } from "../components/CelestialArt";
import { ChartWheel } from "../components/ChartWheel";
import { saveUser } from "../data/user";

const GOALS = [
  "Career",
  "Relationship",
  "Health",
  "Finance",
  "Marriage",
  "Spiritual",
  "Business",
  "Family",
];

export default function OnboardingPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [finishing, setFinishing] = useState(false);

  // form state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [notifyTime, setNotifyTime] = useState("08:30");
  const [whatsapp, setWhatsapp] = useState(true);

  const Art = ONBOARDING_ART[step - 1];

  const canContinue =
    (step === 1 && phone.length === 10) ||
    (step === 2 && otp.every((d) => d !== "")) ||
    (step === 3 && birthDate && birthTime && birthPlace.trim()) ||
    (step === 4 && goals.length === 3) ||
    step === 5;

  const ctaLabel =
    step === 1
      ? "Send OTP"
      : step === 2
      ? "Verify"
      : step === 5
      ? "Meet Your Cosmos ✨"
      : "Continue";

  function toggleGoal(g: string) {
    setGoals((prev) => {
      if (prev.includes(g)) return prev.filter((x) => x !== g);
      if (prev.length >= 3) return [...prev.slice(1), g];
      return [...prev, g];
    });
  }

  function next() {
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      saveUser({
        phone,
        birthDate,
        birthTime,
        birthPlace,
        goals,
        notifyTime,
        whatsapp,
        onboardedAt: Date.now(),
      });
      setFinishing(true);
      setTimeout(() => nav("/today"), 2200);
    }
  }

  if (finishing) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-bg">
        <StarField count={120} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.3, 0.64, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <ChartWheel size={230} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="serif mt-6 text-2xl text-white/90"
          >
            Aligning your stars…
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <StarField count={90} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i <= step
                  ? "w-6 bg-gold"
                  : "w-2.5 border border-white/25 bg-transparent"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-1 flex-col"
          >
            {/* Celestial illustration */}
            <div className="flex h-[170px] items-center justify-center pt-4">
              <Art />
            </div>

            {/* Step content */}
            <div className="mt-2 flex-1">
              {step === 1 && (
                <Step1 phone={phone} setPhone={setPhone} />
              )}
              {step === 2 && (
                <Step2 otp={otp} setOtp={setOtp} phone={phone} />
              )}
              {step === 3 && (
                <Step3
                  {...{
                    birthDate,
                    setBirthDate,
                    birthTime,
                    setBirthTime,
                    birthPlace,
                    setBirthPlace,
                  }}
                />
              )}
              {step === 4 && (
                <Step4 goals={goals} toggleGoal={toggleGoal} />
              )}
              {step === 5 && (
                <Step5
                  {...{ notifyTime, setNotifyTime, whatsapp, setWhatsapp }}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-3 pb-8">
          {step > 1 && (
            <button
              className="flex items-center gap-1 text-sm text-text-muted hover:text-white"
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button
            className="btn-gold w-full rounded-full disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canContinue}
            onClick={next}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Step components ---------- */

function Question({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center">
      <h2 className="serif text-[28px] leading-tight text-white">{title}</h2>
      {sub && <p className="mt-2 text-sm text-text-muted">{sub}</p>}
    </div>
  );
}

function Step1({
  phone,
  setPhone,
}: {
  phone: string;
  setPhone: (v: string) => void;
}) {
  return (
    <>
      <Question title="What's your phone number?" />
      <div className="mt-8 flex items-center gap-3">
        <div className="cosmic-card flex h-14 items-center px-4 text-lg text-text-primary">
          +91
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
          className="cosmic-card h-14 flex-1 bg-bg-card px-4 text-lg text-text-primary outline-none placeholder:text-text-muted/50 focus:ring-2 focus:ring-gold/60"
        />
      </div>
    </>
  );
}

function Step2({
  otp,
  setOtp,
  phone,
}: {
  otp: string[];
  setOtp: (v: string[]) => void;
  phone: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function handle(i: number, v: string) {
    const digit = v.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[i] = digit;
    setOtp(nextOtp);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <>
      <Question
        title="Enter the OTP"
        sub={`Sent to +91 ${phone.slice(0, 5)} ${phone.slice(5) || "•••••"}`}
      />
      <div className="mt-8 flex justify-center gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => handle(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[i] && i > 0)
                refs.current[i - 1]?.focus();
            }}
            inputMode="numeric"
            maxLength={1}
            className="cosmic-card h-12 w-12 bg-bg-card text-center text-xl text-text-primary outline-none focus:ring-2 focus:ring-gold/60"
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-text-muted">
        Resend OTP (30s)
      </p>
    </>
  );
}

function Step3(props: {
  birthDate: string;
  setBirthDate: (v: string) => void;
  birthTime: string;
  setBirthTime: (v: string) => void;
  birthPlace: string;
  setBirthPlace: (v: string) => void;
}) {
  const inputCls =
    "cosmic-card mt-1.5 h-13 w-full bg-bg-card px-4 py-3 text-base text-text-primary outline-none focus:ring-2 focus:ring-gold/60 [color-scheme:dark]";
  return (
    <>
      <Question
        title="When were you born?"
        sub="This unlocks your entire cosmic chart"
      />
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-text-muted">Date of birth</label>
          <input
            type="date"
            value={props.birthDate}
            onChange={(e) => props.setBirthDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs text-text-muted">
            Time of birth (as accurate as possible)
          </label>
          <input
            type="time"
            value={props.birthTime}
            onChange={(e) => props.setBirthTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs text-text-muted">Place of birth</label>
          <input
            type="text"
            value={props.birthPlace}
            onChange={(e) => props.setBirthPlace(e.target.value)}
            placeholder="e.g. Bangalore, India"
            className={inputCls + " placeholder:text-text-muted/50"}
          />
        </div>
      </div>
    </>
  );
}

function Step4({
  goals,
  toggleGoal,
}: {
  goals: string[];
  toggleGoal: (g: string) => void;
}) {
  return (
    <>
      <Question
        title="What matters most to you right now?"
        sub="Pick 3 focus areas"
      />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {GOALS.map((g) => {
          const active = goals.includes(g);
          return (
            <button
              key={g}
              onClick={() => toggleGoal(g)}
              className={`rounded-full border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "border-2 border-gold bg-gold/10 text-gold"
                  : "border-white/15 bg-bg-card text-white"
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-text-muted">
        {goals.length}/3 selected
      </p>
    </>
  );
}

function Step5({
  notifyTime,
  setNotifyTime,
  whatsapp,
  setWhatsapp,
}: {
  notifyTime: string;
  setNotifyTime: (v: string) => void;
  whatsapp: boolean;
  setWhatsapp: (v: boolean) => void;
}) {
  return (
    <>
      <Question
        title="When should we say good morning?"
        sub="We'll send you your Cosmic Weather"
      />
      <div className="mt-8 flex flex-col items-center">
        <input
          type="time"
          value={notifyTime}
          onChange={(e) => setNotifyTime(e.target.value)}
          className="cosmic-card w-48 bg-bg-card px-4 py-4 text-center text-3xl text-gold outline-none [color-scheme:dark] focus:ring-2 focus:ring-gold/60"
        />
        <button
          onClick={() => setWhatsapp(!whatsapp)}
          className="mt-8 flex w-full items-center justify-between rounded-card bg-bg-card px-4 py-4"
        >
          <span className="text-sm text-white">
            Also send WhatsApp digest to my phone
          </span>
          <span
            className={`relative h-6 w-11 rounded-full transition-colors ${
              whatsapp ? "bg-gold" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                whatsapp ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
      </div>
    </>
  );
}
