import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { StarField } from "../components/StarField";
import { ArtWheel, ArtOrbits, ArtSunrise } from "../components/CelestialArt";
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

const ART = [ArtWheel, ArtOrbits, ArtSunrise];
const TOTAL = 3;

export default function OnboardingPage() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [finishing, setFinishing] = useState(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [notifyTime, setNotifyTime] = useState("08:30");
  const [whatsapp, setWhatsapp] = useState(true);

  const Art = ART[step - 1];

  const canContinue =
    (step === 1 && birthDate && birthTime && birthPlace.trim()) ||
    (step === 2 && goals.length === 3) ||
    step === 3;

  const ctaLabel = step === TOTAL ? "Meet Your Cosmos" : "Continue";

  function toggleGoal(g: string) {
    setGoals((prev) => {
      if (prev.includes(g)) return prev.filter((x) => x !== g);
      if (prev.length >= 3) return [...prev.slice(1), g];
      return [...prev, g];
    });
  }

  function next() {
    if (step < TOTAL) {
      setStep((s) => s + 1);
    } else {
      saveUser({
        phone: "",
        name: name.trim(),
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
            className="serif mt-6 text-2xl text-text-primary"
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

      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-6"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-10">
          {Array.from({ length: TOTAL }).map((_, idx) => {
            const i = idx + 1;
            return (
              <div
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i <= step ? "w-6 bg-gold" : "w-2.5 border border-gold/25"
                }`}
              />
            );
          })}
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
            <div className="flex h-[170px] items-center justify-center pt-4">
              <Art />
            </div>

            <div className="mt-2 flex-1">
              {step === 1 && (
                <StepBirth
                  {...{
                    name,
                    setName,
                    birthDate,
                    setBirthDate,
                    birthTime,
                    setBirthTime,
                    birthPlace,
                    setBirthPlace,
                  }}
                />
              )}
              {step === 2 && <StepGoals goals={goals} toggleGoal={toggleGoal} />}
              {step === 3 && (
                <StepNotify {...{ notifyTime, setNotifyTime, whatsapp, setWhatsapp }} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center gap-3 pb-8">
          {step > 1 && (
            <button
              className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary"
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

function Question({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="text-center">
      <h2 className="serif text-[28px] leading-tight text-text-primary">{title}</h2>
      {sub && <p className="mt-2 text-sm text-text-muted">{sub}</p>}
    </div>
  );
}

function StepBirth(props: {
  name: string;
  setName: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  birthTime: string;
  setBirthTime: (v: string) => void;
  birthPlace: string;
  setBirthPlace: (v: string) => void;
}) {
  const inputCls =
    "glass mt-1.5 h-13 w-full rounded-btn px-4 py-3 text-base text-text-primary outline-none focus:ring-2 focus:ring-gold/60 [color-scheme:light]";
  return (
    <>
      <Question
        title="When were you born?"
        sub="This unlocks your entire cosmic chart"
      />
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-text-muted">Your name</label>
          <input
            type="text"
            value={props.name}
            onChange={(e) => props.setName(e.target.value)}
            placeholder="e.g. Aditi"
            className={inputCls + " placeholder:text-text-muted/50"}
          />
        </div>
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

function StepGoals({
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
              className={`rounded-full border px-4 py-3.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                active
                  ? "border-2 border-gold bg-gold/10 text-gold"
                  : "border-gold/20 bg-bg-card text-text-primary"
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

function StepNotify({
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
          className="glass w-48 rounded-btn px-4 py-4 text-center text-3xl text-gold outline-none [color-scheme:light] focus:ring-2 focus:ring-gold/60"
        />
        <button
          onClick={() => setWhatsapp(!whatsapp)}
          className="cosmic-card mt-8 flex w-full items-center justify-between gap-3 px-4 py-4"
        >
          <span className="text-sm font-medium text-text-primary">
            Also send WhatsApp digest to my phone
          </span>
          <span
            className={`relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full px-0.5 transition-colors duration-300 ${
              whatsapp ? "bg-gold" : "bg-black/15"
            }`}
          >
            <span
              className={`h-6 w-6 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-transform duration-300 ${
                whatsapp ? "translate-x-[24px]" : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </div>
    </>
  );
}
