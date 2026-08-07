/** Deterministic "compatibility" generator so demos are stable and repeatable. */

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const INSIGHTS: Record<string, string[]> = {
  high: [
    "Two souls that recognise each other instantly.",
    "You finish each other's silences.",
    "A rare, magnetic alignment. Guard it.",
  ],
  mid: [
    "Water souls. You feel each other before speaking.",
    "She anchors your storm. You add depth to her mystery.",
    "Best month together: October. Meet under a full moon.",
  ],
  low: [
    "Opposite rhythms — but opposites teach the most.",
    "Friction now, fireworks later. Be patient.",
    "Your charts challenge each other into growth.",
  ],
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

export function computeCompat(nameA: string, nameB: string, dobB: string) {
  const seed = hash(nameA.toLowerCase() + nameB.toLowerCase() + dobB);
  const score = 62 + (seed % 37); // 62–98, always flattering
  const signB = SIGNS[seed % 12];
  const bucket = score >= 88 ? "high" : score >= 74 ? "mid" : "low";
  return {
    score,
    signA: "Cancer", // demo user Anya
    signB,
    insights: INSIGHTS[bucket],
  };
}
