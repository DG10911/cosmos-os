import { store } from "./utils";
import { getUser } from "../data/user";
import { edgeApiReady } from "./cosmosApi";
import { deriveChart } from "./chart";

const BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Live AI wiring for the Cosmos Twin.
 *
 * The key is provided by the user at runtime (Settings → Connect live AI) and
 * stored only in their browser's localStorage — it is never committed to the
 * repo or sent anywhere except api.openai.com. In production this call moves
 * behind a Supabase Edge Function / Vercel serverless proxy (see SETUP.md).
 */
const KEY = "cosmos_openai_key";

export function getAiKey(): string {
  return (
    store.get<string>(KEY, "") ||
    (import.meta.env.VITE_OPENAI_KEY as string | undefined) ||
    ""
  );
}

export function setAiKey(k: string) {
  store.set(KEY, k.trim());
}

export function hasLiveAi(): boolean {
  // Live if a server proxy (Edge Function) is available OR a runtime key is set.
  return edgeApiReady() || getAiKey().length > 20;
}

export type ChatMsg = { role: "ai" | "user"; text: string };

function systemPrompt(): string {
  const u = getUser();
  const c = deriveChart(u);
  const name = (u?.name || "").trim();
  const profile = u
    ? `You are speaking with ${name || "this user"}. Birth details: born ${u.birthDate} at ${u.birthTime} in ${u.birthPlace}. Life goals: ${u.goals.join(", ") || "not shared"}.`
    : "They haven't completed onboarding, so speak generally but warmly.";
  return [
    "You are Cosmos Twin — a warm, wise Vedic astrology companion inside the COSMOS OS app for Indian users.",
    profile,
    `Their chart (computed by the app): Moon in ${c.rashiEn} (${c.rashi}), ${c.nakshatra} nakshatra (lord ${c.nakshatraLord}), ${c.ascendant} ascendant. They are running a ${c.mahadashaLord} Mahadasha (${c.antardashaLord} antardasha), ${c.mahadashaYearsLeft} years remaining. Lucky day ${c.luckyDay}, lucky hour ${c.luckyHour}. Classical remedy planet: ${c.remedyPlanet} (${c.gem.stone}).`,
    "Style: 2-4 short sentences. Warm Hinglish-friendly English. Reference their ACTUAL chart/dasha above when relevant. Practical guidance over doom. Never fear-sell remedies.",
    "If the question is heavy (health, legal, crisis), gently suggest talking to a verified astrologer in the Consult tab — and for medical/legal issues, a professional.",
  ].join("\n");
}

/**
 * Ask the model for a strict JSON object (used by the Astro-Brain to generate
 * rituals and summaries). Prefers the secure Edge Function; falls back to a
 * runtime OpenAI key. Throws if neither is available or parsing fails, so
 * callers can fall back to their chart-driven template.
 */
export async function askJson(
  system: string,
  user: string,
): Promise<Record<string, unknown>> {
  // Preferred: server proxy (key stays server-side).
  if (edgeApiReady() && BASE && ANON) {
    const post = (body: unknown) =>
      fetch(`${BASE}/functions/v1/cosmos-api`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${ANON}`,
          apikey: ANON,
        },
        body: JSON.stringify(body),
      });

    // 1) Preferred: the dedicated ai-json action (JSON mode, 500 tokens).
    try {
      const j = await (await post({ action: "ai-json", params: { system, user } })).json();
      if (j?.json) return j.json as Record<string, unknown>;
      if (j?.text) {
        const parsed = extractJson(String(j.text));
        if (parsed) return parsed;
      }
    } catch {
      /* fall through */
    }

    // 2) Fallback: reuse the always-deployed `twin` action for structured
    //    output — works even if the function predates the ai-json action.
    //    Key still never leaves the server.
    try {
      const messages = [
        { role: "system", content: system },
        {
          role: "user",
          content:
            user + "\n\nReply ONLY with valid minified JSON — no prose, no markdown fences.",
        },
      ];
      const j = await (await post({ action: "twin", params: { messages } })).json();
      if (j?.text) {
        const parsed = extractJson(String(j.text));
        if (parsed) return parsed;
      }
    } catch {
      /* fall through to runtime key */
    }
  }

  const key = getAiKey();
  if (!key) throw new Error("no-key");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`openai-${res.status}`);
  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("empty");
  const parsed = extractJson(text);
  if (!parsed) throw new Error("bad-json");
  return parsed;
}

/**
 * Pull a JSON object out of a model response that may be wrapped in prose or
 * ```json fences. Returns null if nothing parseable is found.
 */
function extractJson(raw: string): Record<string, unknown> | null {
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    /* try to slice out the first {...} block */
  }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

/** Ask OpenAI (gpt-4o-mini) with full conversation context. Throws on failure. */
export async function askTwin(history: ChatMsg[]): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt() },
    ...history.slice(-12).map((m) => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text,
    })),
  ];

  // Preferred path: server-side proxy (Edge Function) — no key ever in the app.
  if (edgeApiReady() && BASE && ANON) {
    try {
      const r = await fetch(`${BASE}/functions/v1/cosmos-api`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${ANON}`,
          apikey: ANON,
        },
        body: JSON.stringify({ action: "twin", params: { messages } }),
      });
      const j = await r.json();
      if (j?.text) return String(j.text).trim();
    } catch {
      /* fall through to runtime-key path */
    }
  }

  // Fallback: a runtime key pasted in the app (used when no server proxy).
  const key = getAiKey();
  if (!key) throw new Error("no-key");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.8,
    }),
  });

  if (!res.ok) throw new Error(`openai-${res.status}`);
  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("empty");
  return text.trim();
}
