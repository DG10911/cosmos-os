import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/** Bold saffron festive banner used atop primary tabs. */
export function FestiveBanner({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-card p-5 text-white"
      style={{
        background:
          "radial-gradient(120% 90% at 85% -10%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(135deg,#FF6B2C 0%,#FF8A1F 55%,#FFB423 100%)",
        boxShadow: "0 14px 34px rgba(255,107,44,0.32)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          {eyebrow && (
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              {eyebrow}
            </span>
          )}
          <h2 className="serif mt-3 text-[24px] leading-tight">{title}</h2>
          {sub && <p className="mt-1 text-[13px] text-white/90">{sub}</p>}
        </div>
        {right}
      </div>
      <Sparkles className="absolute -bottom-3 -right-3 text-white/15" size={84} />
    </motion.div>
  );
}
