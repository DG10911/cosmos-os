/**
 * COSMOS OS — the Astro-Brain consultation engine.
 *
 * Turns the flagship consultation from a fixed script into a loop that adapts
 * to whoever is logged in. Every output is grounded in the user's DERIVED chart
 * (see chart.ts), so it is personal and defensible even with no network:
 *   • personalizedRitual()  → the in-consultation Ritual Moment (the cross-sell wedge)
 *   • sessionSummary()      → "what was said / what to do / prediction" recap
 *   • lifeSnapshot()        → the Memory Brain chips the astrologer sees
 *   • openingScript()       → a personalised opening exchange
 *
 * When a live AI key / Edge Function is available the text is written by the
 * model; otherwise a chart-driven template produces the same shape. The UI
 * never has to know which path ran.
 */
import type { DerivedChart } from "./chart";
import { chartLine } from "./chart";
import { askJson } from "./ai";

export type Ritual = {
  title: string;
  subtitle: string;
  reason: string;
  why: string;
  price: number;
  strike: number;
  mantra: string;
  category: string;
};

export type SessionSummary = {
  said: string[];
  todo: string[];
  prediction: { text: string; category: string; dueOn: string };
};

const CATEGORY_BY_GOAL: Record<string, string> = {
  Career: "Career", Business: "Career", Finance: "Finance",
  Relationship: "Love", Marriage: "Marriage", Family: "Family",
  Health: "Health", Spiritual: "Spiritual",
};

function topGoal(goals?: string[]): string {
  return goals && goals.length ? goals[0] : "Career";
}

/* -------------------------------------------------------------------------- */
/*  Ritual Moment                                                             */
/* -------------------------------------------------------------------------- */

/** Chart-driven ritual — always available, fully personalised, offline-safe. */
export function ritualFromChart(chart: DerivedChart, astroName: string): Ritual {
  const g = chart.gem;
  const p = chart.mahadashaLord;
  return {
    title: g.stone,
    subtitle: `Certified · ${g.ratti} ratti · sized to your ${chart.ascendant} ascendant`,
    reason: `For ${p} Mahadasha stability`,
    category: "Remedy",
    price: g.price,
    strike: g.strike,
    mantra: g.mantra,
    why:
      `You are currently running your ${p} Mahadasha — ${chart.challenge.toLowerCase()} ` +
      `In Vedic remedial astrology, ${g.stone.split(" (")[0]} is the classical stone that steadies ${p}. ` +
      `${astroName} has sized it to ${g.ratti} ratti for your ${chart.ascendant} ascendant, ` +
      `set in ${g.metal}, worn on the ${g.finger} finger on a ${g.day}. ` +
      `Energise it with "${g.mantra}" (108×).`,
  };
}

/** Live-AI ritual when a key exists; falls back to the chart template. */
export async function personalizedRitual(
  chart: DerivedChart,
  astroName: string,
  lastUserMessages: string[],
): Promise<Ritual> {
  const base = ritualFromChart(chart, astroName);
  try {
    const sys =
      "You are a senior Vedic astrologer recommending ONE authentic remedy (a gemstone, " +
      "yantra, rudraksha or pooja) during a live consultation. Be specific, warm and never " +
      "fear-sell. Respond ONLY as compact JSON: " +
      `{"title","subtitle","reason","why","mantra","category","price","strike"}. ` +
      "price/strike are INR integers (price 1500-4500, strike higher).";
    const usr =
      `Client chart: Moon in ${chart.rashiEn} (${chart.rashi}), ${chart.nakshatra} nakshatra, ` +
      `${chart.ascendant} ascendant, running ${chart.mahadashaLord} Mahadasha ` +
      `(${chart.antardashaLord} antardasha), classical remedy planet ${chart.remedyPlanet}. ` +
      `They just said: "${lastUserMessages.slice(-2).join(" / ") || "seeking guidance"}". ` +
      `Recommend the single best remedy and explain the "why" citing their dasha and placement.`;
    const j = await askJson(sys, usr);
    const price = int(j.price, base.price);
    let strike = int(j.strike, base.strike);
    if (strike <= price) strike = Math.round(price * 1.2); // always a real discount
    return {
      title: str(j.title) || base.title,
      subtitle: str(j.subtitle) || base.subtitle,
      reason: str(j.reason) || base.reason,
      why: str(j.why) || base.why,
      mantra: str(j.mantra) || base.mantra,
      category: str(j.category) || base.category,
      price,
      strike,
    };
  } catch {
    return base;
  }
}

/* -------------------------------------------------------------------------- */
/*  Session summary + auto-extracted prediction                               */
/* -------------------------------------------------------------------------- */

export function sessionSummarySync(
  chart: DerivedChart,
  _astroName: string,
  goals: string[] | undefined,
  ritual: Ritual,
): SessionSummary {
  const goal = topGoal(goals);
  const cat = CATEGORY_BY_GOAL[goal] ?? "Career";
  const stone = ritual.title.split(" (")[0];
  return {
    said: [
      `Your ${chart.mahadashaLord} Mahadasha is a period of transformation, not just pressure.`,
      `${goal} timing is governed by ${chart.mahadashaLord} through your ${chart.nakshatra} nakshatra — a supportive window opens ${dueLabel(70)}.`,
      `A ${stone}, correctly energised, will stabilise your ${chart.mahadashaLord} period.`,
    ],
    todo: [
      `Wear the ${stone} from a ${chart.gem.day}, on the ${chart.gem.finger} finger`,
      `Chant "${chart.gem.mantra}" 108 times on ${chart.luckyDay}`,
      `Keep your ${chart.luckyHour} window free for important ${goal.toLowerCase()} moves`,
      `Revisit your ${goal.toLowerCase()} decision before ${dueLabel(92)}`,
    ],
    prediction: {
      text: `You'll get clarity on your ${goal.toLowerCase()} question`,
      category: cat,
      dueOn: dueLabel(94),
    },
  };
}

/** Live-AI summary; chart template fallback. */
export async function sessionSummary(
  chart: DerivedChart,
  astroName: string,
  goals: string[] | undefined,
  ritual: Ritual,
  transcript: { role: "astro" | "user"; text: string }[],
): Promise<SessionSummary> {
  const base = sessionSummarySync(chart, astroName, goals, ritual);
  try {
    const convo = transcript
      .slice(-8)
      .map((m) => `${m.role === "astro" ? astroName : "Client"}: ${m.text}`)
      .join("\n");
    const sys =
      "You summarise a Vedic astrology consultation for the client afterwards. " +
      "Respond ONLY as compact JSON: " +
      `{"said":[3 short strings],"todo":[4 short action items],` +
      `"prediction":{"text","category","dueOn"}}. ` +
      "dueOn is a human date within the next 4 months.";
    const usr =
      `Client chart: ${chartLine(chart)}, ${chart.ascendant} ascendant. ` +
      `Recommended remedy: ${ritual.title}. Transcript:\n${convo || "(brief session)"}`;
    const j = await askJson(sys, usr);
    const jp = (j?.prediction ?? {}) as Record<string, unknown>;
    return {
      said: arr(j.said, base.said),
      todo: arr(j.todo, base.todo),
      prediction: {
        text: str(jp.text) || base.prediction.text,
        category: str(jp.category) || base.prediction.category,
        dueOn: str(jp.dueOn) || base.prediction.dueOn,
      },
    };
  } catch {
    return base;
  }
}

/* -------------------------------------------------------------------------- */
/*  Memory Brain snapshot + opening script                                    */
/* -------------------------------------------------------------------------- */

export function lifeSnapshot(
  user: { name?: string; goals?: string[] } | null,
  chart: DerivedChart,
) {
  const goal = topGoal(user?.goals);
  return {
    name: chart.name === "friend" ? "Your" : `${chart.name}'s`,
    chart: chartLine(chart),
    recent: `Focus: ${(user?.goals ?? [goal]).slice(0, 2).join(" · ")}`,
    openPrediction: `${goal} clarity ${dueLabel(94)}`,
    moodTrend: `${chart.antardashaLord} antardasha · ${chart.mahadashaYearsLeft}y left`,
  };
}

export type ScriptMsg =
  | { kind: "astro"; text: string }
  | { kind: "user"; text: string }
  | { kind: "voice"; seconds: number }
  | { kind: "ritual" }
  | { kind: "system"; text: string };

/** Personalised opening exchange that leads into the Ritual Moment. */
export function openingScript(
  user: { name?: string; goals?: string[] } | null,
  chart: DerivedChart,
): ScriptMsg[] {
  const first = (chart.name === "friend" ? "" : chart.name).split(" ")[0];
  const hello = first ? `Namaste ${first}.` : "Namaste.";
  const goal = topGoal(user?.goals).toLowerCase();
  return [
    {
      kind: "astro",
      text: `${hello} I've read your chart — Moon in ${chart.rashiEn}, ${chart.nakshatra} nakshatra, and you're running a ${chart.mahadashaLord} Mahadasha. How have you been feeling about your ${goal} lately?`,
    },
    {
      kind: "user",
      text: `Honestly a bit anxious about my ${goal} timing.`,
    },
    { kind: "voice", seconds: 14 },
    {
      kind: "astro",
      text: `That fits — ${chart.challenge.toLowerCase()} Your ${chart.antardashaLord} antardasha is the real driver of the timing you're worried about. Let me suggest a remedy sized to your chart…`,
    },
    { kind: "ritual" },
  ];
}

/** Follow-up after the Ritual Moment. */
export function afterBuyScript(chart: DerivedChart): ScriptMsg[] {
  const g = chart.gem;
  return [
    { kind: "system", text: `✓ Ordered — ${g.stone} · arrives in 5 days` },
    {
      kind: "astro",
      text: `Wonderful. Wear it on a ${g.day} morning after washing it in raw milk. I'll check in with you in 21 days — and I've noted your prediction so we can track it together.`,
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*  helpers                                                                    */
/* -------------------------------------------------------------------------- */

function dueLabel(daysAhead: number): string {
  const d = new Date(Date.now() + daysAhead * 86_400_000);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
function int(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}
function arr(v: unknown, fallback: string[]): string[] {
  return Array.isArray(v) && v.length ? v.map(String) : fallback;
}
