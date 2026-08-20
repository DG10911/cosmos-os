/**
 * COSMOS OS — Muhurat engine.
 *
 * A deterministic, Panchang-based auspicious-date finder. For a given event it
 * scans the next N days, scoring each by its Nakshatra, Tithi and weekday using
 * classical muhurat rules, and returns the shubh (auspicious) windows. Runs
 * fully client-side (see chart.ts primitives) so the Muhurat Marketplace works
 * with zero backend — the vendor booking then flows through real Razorpay.
 */
import { nakshatraOfDate, tithiOfDate } from "./chart";

export type EventType = {
  key: string;
  label: string;
  blurb: string;
  vendorCat: VendorCat;
  good: string[]; // favourable nakshatras
  favWeekdays: number[]; // 0=Sun .. 6=Sat
};

export type VendorCat = "wedding" | "pandit" | "decor" | "catering" | "vehicle";

export const EVENTS: EventType[] = [
  {
    key: "marriage",
    label: "Marriage / Wedding",
    blurb: "Vivah muhurat for the wedding ceremony",
    vendorCat: "wedding",
    good: ["Rohini", "Mrigashira", "Magha", "Uttara Phalguni", "Hasta", "Swati", "Anuradha", "Mula", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
    favWeekdays: [1, 3, 4, 5], // Mon, Wed, Thu, Fri
  },
  {
    key: "griha",
    label: "Griha Pravesh",
    blurb: "Housewarming & first entry into a new home",
    vendorCat: "pandit",
    good: ["Rohini", "Mrigashira", "Chitra", "Anuradha", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada", "Revati"],
    favWeekdays: [1, 4, 5],
  },
  {
    key: "business",
    label: "Business Launch",
    blurb: "Open a shop, sign a deal, or start a venture",
    vendorCat: "pandit",
    good: ["Ashwini", "Pushya", "Hasta", "Chitra", "Swati", "Anuradha", "Shravana", "Dhanishta", "Revati"],
    favWeekdays: [3, 4, 5],
  },
  {
    key: "vehicle",
    label: "Vehicle Purchase",
    blurb: "Buy & first-drive a new car or bike",
    vendorCat: "vehicle",
    good: ["Ashwini", "Rohini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Chitra", "Swati", "Shravana", "Dhanishta", "Revati"],
    favWeekdays: [1, 3, 4, 5],
  },
  {
    key: "naming",
    label: "Naming (Namkaran)",
    blurb: "Baby naming ceremony",
    vendorCat: "pandit",
    good: ["Ashwini", "Rohini", "Mrigashira", "Punarvasu", "Pushya", "Hasta", "Swati", "Shravana", "Revati"],
    favWeekdays: [1, 3, 4, 5],
  },
  {
    key: "property",
    label: "Property / Registry",
    blurb: "Register or take possession of property",
    vendorCat: "pandit",
    good: ["Rohini", "Mrigashira", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada", "Chitra", "Anuradha", "Revati"],
    favWeekdays: [1, 4, 5],
  },
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHUBH_HORA: Record<number, string> = {
  0: "8:00–9:30 AM", 1: "6:30–8:00 AM", 2: "10:00–11:30 AM", 3: "10:30–12:00 PM",
  4: "9:00–10:30 AM", 5: "11:00–12:30 PM", 6: "8:30–10:00 AM",
};

export type Muhurat = {
  iso: string;
  dateLabel: string; // "Sat, 6 Sep"
  weekday: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  hora: string; // shubh (auspicious) time window
  score: number; // 0..99
  quality: "Excellent" | "Very Good" | "Good";
  reasons: string[];
};

export function getEvent(key: string): EventType {
  return EVENTS.find((e) => e.key === key) ?? EVENTS[0];
}

/** Scan `days` days from `from` and return the auspicious windows (score ≥ 70). */
export function findMuhurats(eventKey: string, from: Date, days = 75): Muhurat[] {
  const ev = getEvent(eventKey);
  const out: Muhurat[] = [];

  for (let i = 1; i <= days; i++) {
    const d = new Date(from.getTime() + i * 86_400_000);
    const nak = nakshatraOfDate(d);
    const tithi = tithiOfDate(d);
    const wd = d.getDay();

    let score = 58;
    const reasons: string[] = [];

    if (ev.good.includes(nak.name)) {
      score += 24;
      reasons.push(`${nak.name} nakshatra — highly favourable for ${ev.label.toLowerCase()}`);
    } else {
      reasons.push(`${nak.name} nakshatra — neutral`);
    }

    if (tithi.isAmavasya) {
      score -= 45;
      reasons.push("Amavasya (no-moon) — inauspicious");
    } else if (tithi.name === "Chaturdashi") {
      score -= 18;
      reasons.push("Chaturdashi — generally avoided");
    } else if (tithi.num === 8) {
      score -= 12;
      reasons.push("Ashtami — mixed");
    } else if (tithi.isPurnima) {
      score += 6;
      reasons.push("Purnima (full moon) — auspicious");
    } else if (tithi.name === "Ekadashi") {
      score += 5;
      reasons.push("Ekadashi — pious");
    } else if (tithi.paksha === "Shukla") {
      score += 8;
      reasons.push(`Shukla Paksha ${tithi.name} — waxing moon supports growth`);
    } else {
      reasons.push(`Krishna Paksha ${tithi.name}`);
    }

    if (ev.favWeekdays.includes(wd)) {
      score += 9;
      reasons.push(`${WEEKDAYS[wd]} — a favourable weekday`);
    } else if (wd === 2) {
      score -= 6;
      reasons.push("Tuesday (Mangal) — best avoided");
    }

    score = Math.max(0, Math.min(99, score));
    if (score < 70) continue;

    out.push({
      iso: d.toISOString().slice(0, 10),
      dateLabel: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      weekday: WEEKDAYS[wd],
      tithi: tithi.name,
      paksha: tithi.paksha,
      nakshatra: nak.name,
      hora: SHUBH_HORA[wd],
      score,
      quality: score >= 85 ? "Excellent" : score >= 76 ? "Very Good" : "Good",
      reasons,
    });
  }

  return out.sort((a, b) => b.score - a.score).slice(0, 8);
}

/** Deterministic per-date vendor availability (so "date-matched" feels real). */
export function isVendorFreeOn(vendorId: number, iso: string): boolean {
  let h = 0;
  const s = `${vendorId}:${iso}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 10 > 2; // ~70% available on any given date
}
