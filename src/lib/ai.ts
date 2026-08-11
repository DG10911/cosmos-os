import { store } from "./utils";
import { getUser } from "../data/user";
import { edgeApiReady } from "./cosmosApi";

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
  const profile = u
    ? `Their birth details: born ${u.birthDate} at ${u.birthTime} in ${u.birthPlace}. Life goals they told you: ${u.goals.join(", ") || "not shared"}.`
    : "They haven't completed onboarding, so speak generally but warmly.";
  return [
    "You are Cosmos Twin — a warm, wise Vedic astrology companion inside the COSMOS OS app for Indian users.",
    profile,
    "Their chart context (from the app): Cancer ascendant, Rohini Nakshatra, currently in a Rahu Mahadasha. Today's lucky hour is 2:00–3:30 PM; Rahu Kaal 1:30–3:00 PM.",
    "Style: 2-4 short sentences. Warm Hinglish-friendly English. Reference their actual chart/dasha when relevant. Practical guidance over doom. Never fear-sell remedies.",
    "If the question is heavy (health, legal, crisis), gently suggest talking to a verified astrologer in the Consult tab — and for medical/legal issues, a professional.",
  ].join("\n");
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
