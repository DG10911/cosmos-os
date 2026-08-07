/** Navagraha — the 9 planets that power the gamification (Graha XP / levels). */
export type Graha = {
  key: string;
  glyph: string;
  name: string;
  domain: string;
  color: string;
  level: number; // 1..9
  xp: number; // 0..100 toward next level
};

export const NAVAGRAHA: Graha[] = [
  { key: "sun", glyph: "☉", name: "Surya", domain: "Confidence · Career", color: "#FF8A1F", level: 6, xp: 72 },
  { key: "moon", glyph: "☽", name: "Chandra", domain: "Mind · Emotion", color: "#8FA7FF", level: 7, xp: 40 },
  { key: "mars", glyph: "♂", name: "Mangal", domain: "Energy · Courage", color: "#E5484D", level: 4, xp: 55 },
  { key: "mercury", glyph: "☿", name: "Budh", domain: "Learning · Wit", color: "#16A34A", level: 5, xp: 88 },
  { key: "jupiter", glyph: "♃", name: "Guru", domain: "Wisdom · Luck", color: "#FFC53D", level: 6, xp: 30 },
  { key: "venus", glyph: "♀", name: "Shukra", domain: "Love · Beauty", color: "#F472B6", level: 5, xp: 64 },
  { key: "saturn", glyph: "♄", name: "Shani", domain: "Discipline · Karma", color: "#6366F1", level: 3, xp: 48 },
  { key: "rahu", glyph: "☊", name: "Rahu", domain: "Ambition · Desire", color: "#7C3AED", level: 4, xp: 20 },
  { key: "ketu", glyph: "☋", name: "Ketu", domain: "Detachment · Moksha", color: "#64748B", level: 4, xp: 76 },
];

/** Aura Score = weighted composite of planet levels (a "credit score for your soul"). */
export function auraScore(streak: number, karma: number): number {
  const base = NAVAGRAHA.reduce((s, g) => s + g.level * 10 + g.xp * 0.15, 0);
  const bonus = Math.min(120, streak * 3) + Math.min(80, karma / 20);
  return Math.round(Math.min(999, base + bonus));
}
