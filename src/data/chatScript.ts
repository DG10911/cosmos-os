/** The scripted demo consultation. Drives the auto-playing chat on the Session screen. */

export type ChatMsg =
  | { kind: "astro"; text: string }
  | { kind: "user"; text: string }
  | { kind: "voice"; seconds: number } // astrologer voice note
  | { kind: "ritual" } // triggers the Ritual Moment card
  | { kind: "system"; text: string };

export const CHAT_SCRIPT: ChatMsg[] = [
  {
    kind: "astro",
    text: "Namaste Anya. I remember our last session — how did that difficult meeting with your manager go?",
  },
  {
    kind: "user",
    text: "Better actually! But I'm still worried about the promotion timing.",
  },
  { kind: "voice", seconds: 14 },
  {
    kind: "astro",
    text: "Your Rahu Mahadasha is amplifying anxiety through the Rahu–Ketu axis. Your chart shows Saturn's transit is the real driver of career timing. Let me suggest a specific remedy that aligns with your chart…",
  },
  { kind: "ritual" },
];

/** After the user buys (or skips) the ritual, this continues. */
export const CHAT_AFTER_BUY: ChatMsg[] = [
  { kind: "system", text: "✓ Ordered — Blue Sapphire (Neelam) Ring · arrives Aug 15" },
  {
    kind: "astro",
    text: "Wonderful. Wear it on Saturday morning after washing it in raw milk. I'll check in with you in 21 days — and I've noted your promotion prediction so we can track it together.",
  },
];

export const RITUAL = {
  title: "Blue Sapphire (Neelam) Ring",
  subtitle: "Certified · Sized to your chart",
  reason: "For Rahu period stability",
  price: 2499,
  strike: 2999,
  image:
    "https://images.unsplash.com/photo-1602752275197-9d8b0b8b1c7d?w=200&q=80",
  why: "Your chart shows Rahu in the 10th house, which amplifies career anxiety during its Mahadasha period. Blue Sapphire (Neelam) is the traditional Vedic remedy for Rahu-related instability. Pt. Suresh selected the exact carat weight (5.25 ratti) based on your ascendant.",
};

/** Anya's Life Snapshot — the visible Memory Brain. */
export const LIFE_SNAPSHOT = {
  chart: "Cancer / Rohini / Rahu Mahadasha",
  recent: "3 sessions · Last: promotion anxiety",
  openPrediction: "Promotion by Diwali",
  moodTrend: "Below baseline (7d)",
};
