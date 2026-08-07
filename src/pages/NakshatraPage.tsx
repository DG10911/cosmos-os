import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share2, HelpCircle } from "lucide-react";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";

/** Today's puzzle — same for everyone (Wordle-style appointment mechanic). */
const PUZZLE = {
  number: 142,
  answer: "Jupiter",
  options: ["Mars", "Venus", "Jupiter", "Saturn", "Mercury", "Rahu"],
  clues: [
    "I am the heaviest of the Navagraha in blessings, not in iron.",
    "Thursdays belong to me — yellow is my colour.",
    "Teachers, gurus and growth are my domain.",
    "In your kundli's 9th house, I open doors of fortune.",
    "They call me Guru — the great benefic.",
  ],
};

export default function NakshatraPage() {
  const nav = useNavigate();
  const app = useApp();
  const toast = useToast();
  const [revealed, setRevealed] = useState(1);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [confetti, setConfetti] = useState(0);

  const won = guesses.includes(PUZZLE.answer);
  const lost = !won && guesses.length >= 5;
  const over = won || lost;

  function guess(opt: string) {
    if (over || guesses.includes(opt)) return;
    const next = [...guesses, opt];
    setGuesses(next);
    if (opt === PUZZLE.answer) {
      setConfetti((c) => c + 1);
      const karma = Math.max(25 - revealed * 5, 5);
      app.addKarma(karma, `Daily Graha #${PUZZLE.number}`);
      toast(`The universe noticed · +${karma} Karma`);
    } else if (next.length >= 5) {
      toast("The stars keep their secret today");
    } else {
      setRevealed((r) => Math.min(r + 1, 5));
    }
  }

  function share() {
    const grid = Array.from({ length: 5 })
      .map((_, i) => {
        if (i < guesses.length)
          return guesses[i] === PUZZLE.answer ? "🟡" : "🟣";
        return "⬛";
      })
      .join("");
    const text = `Daily Graha #${PUZZLE.number} ${
      won ? `${guesses.length}/5` : "X/5"
    }\n${grid}\ncosmos-os.app`;
    navigator.clipboard?.writeText(text).catch(() => {});
    toast("Result copied — paste on WhatsApp Status ✦");
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <Confetti fire={confetti} />
      <button
        onClick={() => nav(-1)}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="serif text-2xl text-text-primary">Daily Graha</h1>
        <span className="mono rounded-full bg-cosmic/10 px-2.5 py-1 text-xs font-bold text-cosmic">
          #{PUZZLE.number}
        </span>
      </div>
      <p className="mt-1 text-sm text-text-muted">
        One planet. Five clues. Everyone in India gets the same puzzle — fewer
        clues, more karma.
      </p>

      {/* Clues */}
      <div className="mt-4 space-y-2">
        {PUZZLE.clues.slice(0, over ? 5 : revealed).map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="cosmic-card flex items-start gap-2.5 p-3.5"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-bold text-gold">
              {i + 1}
            </span>
            <p className="text-sm italic leading-relaxed text-text-primary">{c}</p>
          </motion.div>
        ))}
        {!over && revealed < 5 && (
          <p className="flex items-center gap-1 px-1 text-[11px] text-text-muted">
            <HelpCircle size={12} /> A wrong guess reveals the next clue
          </p>
        )}
      </div>

      {/* Options */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {PUZZLE.options.map((opt) => {
          const wrong = guesses.includes(opt) && opt !== PUZZLE.answer;
          const right = over && opt === PUZZLE.answer;
          return (
            <button
              key={opt}
              disabled={over || wrong}
              onClick={() => guess(opt)}
              className={`rounded-btn border py-3 text-sm font-semibold transition active:scale-95 ${
                right
                  ? "border-gold bg-gold text-white"
                  : wrong
                    ? "border-black/10 bg-black/[0.04] text-text-muted line-through"
                    : "border-gold/25 bg-bg-card text-text-primary"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Result */}
      <AnimatePresence>
        {over && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="aura-border mt-5 rounded-card p-5 text-center"
            style={{ background: "linear-gradient(150deg,#FFF0DC,#FFEAD2)" }}
          >
            <p className="serif text-2xl text-text-primary">
              {won ? `Guru smiles upon you ✦` : `It was ${PUZZLE.answer}`}
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {won
                ? `Solved with ${guesses.length} guess${guesses.length > 1 ? "es" : ""} · come back tomorrow`
                : "The next Graha rises at midnight"}
            </p>
            {/* share grid preview */}
            <p className="mono mt-3 text-xl tracking-widest">
              {Array.from({ length: 5 })
                .map((_, i) =>
                  i < guesses.length
                    ? guesses[i] === PUZZLE.answer
                      ? "🟡"
                      : "🟣"
                    : "⬛"
                )
                .join("")}
            </p>
            <button
              onClick={share}
              className="btn-gold mx-auto mt-4 flex items-center gap-2 rounded-full px-5 text-sm"
            >
              <Share2 size={15} /> Share to WhatsApp Status
            </button>
            <p className="mt-3 text-[11px] text-text-muted">
              2,41,882 players solved today's Graha
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
