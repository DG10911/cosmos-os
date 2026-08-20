import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  MapPin,
  Star,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Store,
  Check,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { EVENTS, getEvent, findMuhurats, isVendorFreeOn, type Muhurat } from "../lib/muhurat";
import { vendorsForCat, type Vendor } from "../data/vendors";
import { openRazorpay } from "../lib/razorpay";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";

const QUALITY_COLOR: Record<Muhurat["quality"], string> = {
  Excellent: "#16A34A",
  "Very Good": "#F59E0B",
  Good: "#8B7CFC",
};

export default function MuhuratPage() {
  const app = useApp();
  const toast = useToast();
  const [eventKey, setEventKey] = useState(EVENTS[0].key);
  const [openReasons, setOpenReasons] = useState<string | null>(null);
  const [selected, setSelected] = useState<Muhurat | null>(null);
  const [booked, setBooked] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(0);

  const ev = getEvent(eventKey);
  const today = useMemo(() => new Date(), []);
  const muhurats = useMemo(() => findMuhurats(eventKey, today), [eventKey, today]);
  const vendors = useMemo(() => vendorsForCat(ev.vendorCat), [ev.vendorCat]);

  function pickEvent(k: string) {
    setEventKey(k);
    setSelected(null);
    setOpenReasons(null);
  }

  async function book(v: Vendor) {
    const desc = `${v.name} · ${ev.label}${selected ? ` · ${selected.dateLabel}` : ""}`;
    const done = () => {
      setBooked((b) => [...b, v.id]);
      setConfetti((c) => c + 1);
      app.addKarma(15, "Muhurat vendor booked");
      toast("Booked ✓ · vendor notified with your muhurat");
    };
    const opened = await openRazorpay({
      amountInr: v.price,
      description: desc,
      onSuccess: () => {
        toast("Payment successful ✓");
        done();
      },
      onDismiss: () => toast("Booking cancelled"),
    });
    if (!opened) done();
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <Confetti fire={confetti} />
      <PageHeader
        title="Muhurat Marketplace"
        sub="Find the right time. Book date-matched vendors."
      />

      {/* USP banner */}
      <div
        className="aura-border overflow-hidden rounded-card p-4 text-white"
        style={{
          background:
            "radial-gradient(120% 90% at 90% -10%, rgba(255,255,255,0.2), transparent 55%), linear-gradient(135deg,#7C3AED,#E11D74)",
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">One flow: auspicious date → verified vendor</span>
        </div>
        <p className="mt-1 text-[12px] text-white/85">
          Every date below is scored live from the Panchang — Tithi, Nakshatra and
          weekday — then matched to vendors actually free that day.
        </p>
      </div>

      {/* Event picker */}
      <h3 className="serif mt-6 text-lg text-text-primary">What are you planning?</h3>
      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
        {EVENTS.map((e) => {
          const on = e.key === eventKey;
          return (
            <button
              key={e.key}
              onClick={() => pickEvent(e.key)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition active:scale-95 ${
                on ? "border-2 border-gold bg-gold/10 text-gold" : "border-gold/20 bg-bg-card text-text-primary"
              }`}
            >
              {e.label}
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 px-0.5 text-[12px] text-text-muted">{ev.blurb}</p>

      {/* Auspicious dates */}
      <h3 className="serif mt-6 flex items-center gap-2 text-lg text-text-primary">
        <CalendarClock size={17} className="text-gold" /> Shubh Muhurats
        <span className="ml-auto text-[11px] font-normal text-text-muted">next 75 days</span>
      </h3>

      <div className="mt-2 space-y-2">
        {muhurats.map((m, i) => {
          const isSel = selected?.iso === m.iso;
          return (
            <motion.div
              key={m.iso}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`cosmic-card overflow-hidden p-3.5 ${isSel ? "ring-2 ring-gold" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gold/10">
                  <span className="text-[9px] font-semibold uppercase text-text-muted">
                    {m.dateLabel.split(" ")[0].replace(",", "")}
                  </span>
                  <span className="mono text-base font-bold leading-none text-gold">
                    {m.dateLabel.split(" ")[1]}
                  </span>
                  <span className="text-[8px] text-text-muted">{m.dateLabel.split(" ")[2]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: QUALITY_COLOR[m.quality] }}
                    >
                      {m.quality}
                    </span>
                    <span className="mono text-xs text-text-muted">{m.score}/99</span>
                  </div>
                  <p className="mt-1 truncate text-[12px] text-text-primary">
                    {m.nakshatra} · {m.paksha} {m.tithi}
                  </p>
                  <p className="text-[11px] text-text-muted">Shubh hora {m.hora}</p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => setSelected(isSel ? null : m)}
                  className="flex-1 rounded-btn bg-gold py-2 text-xs font-semibold text-white active:scale-95"
                >
                  {isSel ? "Selected — see vendors ↓" : "Choose this date"}
                </button>
                <button
                  onClick={() => setOpenReasons(openReasons === m.iso ? null : m.iso)}
                  className="flex items-center gap-1 rounded-btn border border-gold/20 px-2.5 py-2 text-xs text-cosmic"
                >
                  Why <ChevronDown size={13} className={openReasons === m.iso ? "rotate-180 transition" : "transition"} />
                </button>
              </div>

              <AnimatePresence initial={false}>
                {openReasons === m.iso && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1 overflow-hidden pl-1"
                  >
                    {m.reasons.map((r, j) => (
                      <li key={j} className="flex gap-1.5 text-[11px] text-text-muted">
                        <span className="text-gold">•</span> {r}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {muhurats.length === 0 && (
          <div className="cosmic-card p-6 text-center text-sm text-text-muted">
            No strongly auspicious windows in this range — try another event.
          </div>
        )}
      </div>

      {/* Date-matched vendors */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-7"
          >
            <h3 className="serif flex items-center gap-2 text-lg text-text-primary">
              <Store size={17} className="text-cosmic" /> Vendors free on {selected.dateLabel}
            </h3>
            <p className="mt-0.5 text-[12px] text-text-muted">
              Verified for {ev.label} · availability matched to your muhurat
            </p>
            <div className="mt-2 space-y-2">
              {vendors.map((v) => {
                const free = isVendorFreeOn(v.id, selected.iso);
                const isBooked = booked.includes(v.id);
                return (
                  <div key={v.id} className="cosmic-card flex items-center gap-3 p-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cosmic/10 text-cosmic">
                      <Store size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-text-primary">{v.name}</span>
                        {v.verified && <ShieldCheck size={13} className="shrink-0 text-success" />}
                      </div>
                      <p className="truncate text-[11px] text-text-muted">{v.tag}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="flex items-center gap-0.5 text-gold">
                          <Star size={11} className="fill-gold" /> {v.rating}
                        </span>
                        <span>({v.reviews})</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin size={10} /> {v.city}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {isBooked ? (
                        <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1.5 text-[11px] font-semibold text-success">
                          <Check size={12} /> Booked
                        </span>
                      ) : free ? (
                        <button
                          onClick={() => book(v)}
                          className="rounded-btn bg-gold px-3 py-2 text-xs font-semibold text-white active:scale-95"
                        >
                          Book ₹{v.price.toLocaleString("en-IN")}
                          <span className="block text-[9px] font-normal text-white/80">{v.priceNote}</span>
                        </button>
                      ) : (
                        <span className="rounded-btn bg-black/[0.04] px-3 py-2 text-[11px] text-text-muted">
                          Booked out
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
