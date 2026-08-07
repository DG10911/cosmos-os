import { motion } from "framer-motion";

/**
 * A button that morphs into an animated drawn checkmark when `done` is true.
 * Used for ritual/mission completion — the checkmark path draws itself.
 */
export function CheckButton({
  done,
  label,
  doneLabel,
  onClick,
  className = "",
}: {
  done: boolean;
  label: string;
  doneLabel: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={done}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-btn px-3 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 ${
        done ? "bg-success/15 text-success" : "bg-gold text-bg"
      } ${className}`}
    >
      {done && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M4 12.5l5 5L20 6"
            stroke="#4ADE80"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </svg>
      )}
      {done ? doneLabel : label}
    </button>
  );
}

/** A circular tick that draws itself — for checklists. */
export function DrawTick({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
        checked ? "border-success bg-success" : "border-white/30"
      }`}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M5 12.5l4 4L19 7"
            stroke="#0B0B14"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </svg>
      )}
    </span>
  );
}
