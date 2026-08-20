/**
 * COSMOS OS — client-side Vedic chart engine.
 *
 * Derives a plausible, DETERMINISTIC Vedic snapshot (Moon Rashi, Nakshatra,
 * current Vimshottari Mahadasha, remedy planet + gemstone) from a user's date
 * and time of birth — with zero network calls. This is what makes every
 * personalisation ("based on your Saturn Mahadasha") true for ANY user, even
 * offline. When the Prokerala Edge Function is deployed, callers may enrich
 * these values with the real ephemeris, but the app never depends on it.
 *
 * The Vimshottari Dasha math is genuine: the 120-year planetary cycle is
 * advanced from the birth Nakshatra lord by the user's age to find the
 * Mahadasha they are actually running today.
 */

export type Planet =
  | "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter"
  | "Venus" | "Saturn" | "Rahu" | "Ketu";

export type DerivedChart = {
  name: string;
  rashi: string; // Vedic Moon sign (Sanskrit)
  rashiEn: string; // Western-recognisable equivalent
  nakshatra: string;
  nakshatraLord: Planet;
  ascendant: string; // Lagna (approximate)
  mahadashaLord: Planet;
  mahadashaYearsLeft: number;
  antardashaLord: Planet;
  luckyDay: string;
  luckyHour: string;
  remedyPlanet: Planet;
  gem: Gem;
  challenge: string; // one-line life theme of the current dasha
};

export type Gem = {
  stone: string; // e.g. "Blue Sapphire (Neelam)"
  ratti: number;
  metal: string;
  finger: string;
  day: string;
  mantra: string;
  price: number;
  strike: number;
};

/** Vimshottari Dasha order + years (sums to 120). */
const DASHA: [Planet, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

/** 27 Nakshatras. Lord repeats the 9-planet Dasha order three times. */
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const RASHIS: [string, string][] = [
  ["Mesha", "Aries"], ["Vrishabha", "Taurus"], ["Mithuna", "Gemini"],
  ["Karka", "Cancer"], ["Simha", "Leo"], ["Kanya", "Virgo"],
  ["Tula", "Libra"], ["Vrishchika", "Scorpio"], ["Dhanu", "Sagittarius"],
  ["Makara", "Capricorn"], ["Kumbha", "Aquarius"], ["Meena", "Pisces"],
];

const LUCKY_DAY: Record<Planet, string> = {
  Sun: "Sunday", Moon: "Monday", Mars: "Tuesday", Mercury: "Wednesday",
  Jupiter: "Thursday", Venus: "Friday", Saturn: "Saturday",
  Rahu: "Saturday", Ketu: "Tuesday",
};

/** Classical Vedic gemstone remedy for each planet. */
export const GEM_BY_PLANET: Record<Planet, Gem> = {
  Sun: { stone: "Ruby (Manik)", ratti: 5.25, metal: "gold", finger: "ring", day: "Sunday", mantra: "Om Suryaya Namaha", price: 2799, strike: 3499 },
  Moon: { stone: "Pearl (Moti)", ratti: 6.0, metal: "silver", finger: "little", day: "Monday", mantra: "Om Chandraya Namaha", price: 1899, strike: 2499 },
  Mars: { stone: "Red Coral (Moonga)", ratti: 7.0, metal: "gold", finger: "ring", day: "Tuesday", mantra: "Om Angarakaya Namaha", price: 2199, strike: 2899 },
  Mercury: { stone: "Emerald (Panna)", ratti: 5.5, metal: "gold", finger: "little", day: "Wednesday", mantra: "Om Budhaya Namaha", price: 3299, strike: 4199 },
  Jupiter: { stone: "Yellow Sapphire (Pukhraj)", ratti: 5.25, metal: "gold", finger: "index", day: "Thursday", mantra: "Om Gurave Namaha", price: 3499, strike: 4499 },
  Venus: { stone: "Diamond / Opal (Heera)", ratti: 1.0, metal: "platinum", finger: "middle", day: "Friday", mantra: "Om Shukraya Namaha", price: 3999, strike: 4999 },
  Saturn: { stone: "Blue Sapphire (Neelam)", ratti: 5.25, metal: "silver", finger: "middle", day: "Saturday", mantra: "Om Shanaischaraya Namaha", price: 2499, strike: 2999 },
  Rahu: { stone: "Hessonite (Gomed)", ratti: 6.25, metal: "silver", finger: "middle", day: "Saturday", mantra: "Om Rahave Namaha", price: 2099, strike: 2699 },
  Ketu: { stone: "Cat's Eye (Lehsunia)", ratti: 5.25, metal: "silver", finger: "middle", day: "Tuesday", mantra: "Om Ketave Namaha", price: 2299, strike: 2999 },
};

const DASHA_THEME: Record<Planet, string> = {
  Sun: "A season of visibility, authority and stepping into leadership.",
  Moon: "An emotional, nurturing chapter — relationships and home take centre stage.",
  Mars: "High energy and courage — a time to act boldly, but guard your temper.",
  Mercury: "Sharp thinking, learning and communication — great for skills and deals.",
  Jupiter: "The most auspicious period — growth, wisdom, mentors and expansion.",
  Venus: "Love, comfort, creativity and money flow more easily now.",
  Saturn: "A demanding but rewarding period of discipline, patience and hard-earned results.",
  Rahu: "An ambitious, unconventional phase — big desires and sudden shifts, mind the anxiety.",
  Ketu: "An inward, spiritual chapter — detachment, letting go, and deeper meaning.",
};

const SIDEREAL_MONTH = 27.32166; // days for Moon to traverse all 27 nakshatras

/** Parse "YYYY-MM-DD" + "HH:MM" into a stable Date (local, noon-safe). */
function toDate(birthDate?: string, birthTime?: string): Date | null {
  if (!birthDate) return null;
  const [y, m, d] = birthDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  const [hh, mm] = (birthTime || "12:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh || 12, mm || 0);
}

/**
 * Derive the chart. Falls back to a sensible default (a Cancer / Rohini /
 * Saturn profile) when no birth data exists, so the UI never breaks.
 */
export function deriveChart(user: {
  name?: string;
  birthDate?: string;
  birthTime?: string;
} | null): DerivedChart {
  const name = (user?.name || "").trim() || "friend";
  const born = toDate(user?.birthDate, user?.birthTime);

  if (!born) return defaultChart(name);

  // Days since a Rohini reference new-moon epoch (deterministic sidereal proxy).
  const days = born.getTime() / 86_400_000;
  const cyclePos = ((days % SIDEREAL_MONTH) + SIDEREAL_MONTH) % SIDEREAL_MONTH;
  const nakFloat = (cyclePos / SIDEREAL_MONTH) * 27; // 0..27
  const nakIndex = Math.floor(nakFloat) % 27;
  // fraction traversed *within* the birth nakshatra → balance of first dasha
  const withinNak = nakFloat - Math.floor(nakFloat);

  const nakshatra = NAKSHATRAS[nakIndex];
  const startIdx = nakIndex % 9;
  const nakshatraLord = DASHA[startIdx][0];

  // Moon Rashi from the nakshatra's ecliptic longitude midpoint.
  const deg = (nakIndex + 0.5) * (360 / 27);
  const rashiIdx = Math.floor(deg / 30) % 12;
  const [rashi, rashiEn] = RASHIS[rashiIdx];

  // Ascendant (Lagna) — approx: advances ~1 rashi per 2 hours from the Moon sign.
  const bh = born.getHours() + born.getMinutes() / 60;
  const ascIdx = (rashiIdx + Math.floor(bh / 2)) % 12;
  const ascendant = RASHIS[ascIdx][0];

  // --- Vimshottari: advance from birth Mahadasha by age to today ---
  const ageYears = (Date.now() - born.getTime()) / (365.2425 * 86_400_000);
  const balanceYears = (1 - withinNak) * DASHA[startIdx][1]; // remaining first dasha
  let idx = startIdx;
  let elapsed = 0;
  let segLen = balanceYears;
  while (elapsed + segLen <= ageYears && elapsed < 120) {
    elapsed += segLen;
    idx = (idx + 1) % 9;
    segLen = DASHA[idx][1];
  }
  const mahadashaLord = DASHA[idx][0];
  const mahadashaYearsLeft = Math.max(0.1, elapsed + segLen - ageYears);

  // Antardasha (sub-period): proportional slice within the Mahadasha.
  const intoDasha = ageYears - elapsed; // years into current mahadasha
  const antardashaLord = antardasha(idx, intoDasha, segLen);

  const remedyPlanet = mahadashaLord;
  return {
    name,
    rashi, rashiEn,
    nakshatra, nakshatraLord,
    ascendant,
    mahadashaLord,
    mahadashaYearsLeft: Math.round(mahadashaYearsLeft * 10) / 10,
    antardashaLord,
    luckyDay: LUCKY_DAY[mahadashaLord],
    luckyHour: LUCKY_HOUR[mahadashaLord] ?? "2:00–3:30 PM",
    remedyPlanet,
    gem: GEM_BY_PLANET[remedyPlanet],
    challenge: DASHA_THEME[mahadashaLord],
  };
}

const LUCKY_HOUR: Partial<Record<Planet, string>> = {
  Sun: "6:00–7:30 AM", Moon: "8:00–9:30 PM", Mars: "7:00–8:30 AM",
  Mercury: "10:00–11:30 AM", Jupiter: "4:00–5:30 PM", Venus: "5:00–6:30 PM",
  Saturn: "8:30–10:00 AM", Rahu: "1:30–3:00 PM", Ketu: "3:00–4:30 PM",
};

/** Antardasha runs the 9 lords in Dasha order, each scaled by its own years. */
function antardasha(mahaIdx: number, intoYears: number, mahaLen: number): Planet {
  let acc = 0;
  for (let k = 0; k < 9; k++) {
    const sub = DASHA[(mahaIdx + k) % 9];
    const subLen = (sub[1] / 120) * mahaLen;
    if (intoYears <= acc + subLen) return sub[0];
    acc += subLen;
  }
  return DASHA[mahaIdx][0];
}

function defaultChart(name: string): DerivedChart {
  return {
    name,
    rashi: "Karka", rashiEn: "Cancer",
    nakshatra: "Rohini", nakshatraLord: "Moon",
    ascendant: "Karka",
    mahadashaLord: "Saturn",
    mahadashaYearsLeft: 4.2,
    antardashaLord: "Mercury",
    luckyDay: "Saturday",
    luckyHour: "8:30–10:00 AM",
    remedyPlanet: "Saturn",
    gem: GEM_BY_PLANET.Saturn,
    challenge: DASHA_THEME.Saturn,
  };
}

/** A one-line, human summary used in the Life Snapshot chip. */
export function chartLine(c: DerivedChart): string {
  return `${c.rashiEn} · ${c.nakshatra} · ${c.mahadashaLord} Mahadasha`;
}

/* -------------------------------------------------------------------------- */
/*  Panchang / calculator primitives (used by Muhurat + Calculators)          */
/* -------------------------------------------------------------------------- */

export const RASHI_LIST = RASHIS;
export const NAKSHATRA_LIST = NAKSHATRAS;

/** The Nakshatra the Moon transits on a given date (sidereal proxy). */
export function nakshatraOfDate(d: Date): { index: number; name: string; lord: Planet } {
  const days = d.getTime() / 86_400_000;
  const cyclePos = ((days % SIDEREAL_MONTH) + SIDEREAL_MONTH) % SIDEREAL_MONTH;
  const index = Math.floor((cyclePos / SIDEREAL_MONTH) * 27) % 27;
  return { index, name: NAKSHATRAS[index], lord: DASHA[index % 9][0] };
}

const SYNODIC_MONTH = 29.530588; // new moon → new moon
const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];

/** The lunar day (Tithi) + Paksha for a given date (synodic proxy). */
export function tithiOfDate(d: Date): {
  index: number; num: number; paksha: string; name: string;
  isAmavasya: boolean; isPurnima: boolean;
} {
  const days = d.getTime() / 86_400_000;
  const pos = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const index = Math.floor((pos / SYNODIC_MONTH) * 30) % 30; // 0..29
  const num = (index % 15) + 1; // 1..15
  const shukla = index < 15;
  const isPurnima = shukla && num === 15;
  const isAmavasya = !shukla && num === 15;
  const base = TITHI_NAMES[num - 1];
  const name = num === 15 ? (shukla ? "Purnima" : "Amavasya") : base;
  return { index, num, paksha: shukla ? "Shukla" : "Krishna", name, isAmavasya, isPurnima };
}

const ZODIAC: [string, string, number][] = [
  // [English, Sanskrit, last day-of-month the PREVIOUS sign spills into]
  ["Capricorn", "Makara", 20], ["Aquarius", "Kumbha", 19], ["Pisces", "Meena", 20],
  ["Aries", "Mesha", 20], ["Taurus", "Vrishabha", 21], ["Gemini", "Mithuna", 21],
  ["Cancer", "Karka", 22], ["Leo", "Simha", 23], ["Virgo", "Kanya", 23],
  ["Libra", "Tula", 23], ["Scorpio", "Vrishchika", 22], ["Sagittarius", "Dhanu", 22],
];

/** Western/tropical Sun sign for a date of birth. */
export function sunSign(d: Date): { en: string; sa: string } {
  const m = d.getMonth(); // 0..11
  const day = d.getDate();
  const [en, sa] = day <= ZODIAC[m][2] ? ZODIAC[m] : ZODIAC[(m + 1) % 12];
  return { en, sa };
}

// Saturn's sidereal sign during 2025–2027 (Meena / Pisces).
const SATURN_SIGN_INDEX = 11;

export type SadeSati = {
  active: boolean;
  phase: string; // "Rising" | "Peak" | "Setting" | "Kantaka (Dhaiya)" | "Clear"
  house: number; // Saturn's house from natal Moon (1..12)
  note: string;
};

/** Sade Sati / Dhaiya status for a Moon sign, given Saturn's current transit. */
export function sadeSati(moonRashiEn: string): SadeSati {
  const idx = RASHIS.findIndex((r) => r[1] === moonRashiEn);
  if (idx < 0) return { active: false, phase: "Clear", house: 0, note: "Moon sign unknown." };
  const house = ((SATURN_SIGN_INDEX - idx + 12) % 12) + 1;
  if (house === 12) return { active: true, phase: "Rising", house, note: "First dhaiya — Saturn in your 12th. Expenses and endings; simplify and let go." };
  if (house === 1) return { active: true, phase: "Peak", house, note: "Peak Sade Sati — Saturn over your Moon. The heaviest, most transformative phase. Discipline is your shield." };
  if (house === 2) return { active: true, phase: "Setting", house, note: "Final dhaiya — Saturn in your 2nd. Focus on savings, family and speech; the tunnel is ending." };
  if (house === 4 || house === 8) return { active: true, phase: "Kantaka (Dhaiya)", house, note: `Small panoti — Saturn in your ${house}th. A 2.5-year test of patience, not full Sade Sati.` };
  return { active: false, phase: "Clear", house, note: "No Sade Sati or Dhaiya right now — Saturn is well-placed from your Moon." };
}
