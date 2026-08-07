import { store } from "./utils";

/* ============================================================
   REAL, KEYLESS INTEGRATIONS — these work in production today
   ============================================================ */

/** Live weather via Open-Meteo (free, no API key). */
export type Weather = { temp: number; code: number; label: string; emoji: string };

const WMO: Record<number, [string, string]> = {
  0: ["Clear sky", "☀️"],
  1: ["Mostly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Foggy", "🌫️"],
  48: ["Foggy", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  61: ["Light rain", "🌧️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "⛈️"],
  80: ["Showers", "🌦️"],
  95: ["Thunderstorm", "⛈️"],
};

export async function fetchWeather(
  lat = 28.61,
  lon = 77.21 // Delhi default; swapped for geolocation when user allows
): Promise<Weather> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
  );
  if (!res.ok) throw new Error("weather-failed");
  const j = await res.json();
  const code: number = j?.current?.weather_code ?? 0;
  const [label, emoji] = WMO[code] ?? ["Clear", "☀️"];
  return { temp: Math.round(j?.current?.temperature_2m ?? 28), code, label, emoji };
}

/** Real lunar phase — pure astronomy math, no API needed. */
export function moonPhase(date = new Date()): { name: string; emoji: string; illum: number } {
  // days since known new moon (2000-01-06 18:14 UTC)
  const synodic = 29.53058867;
  const days =
    (date.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const illum = Math.round(
    ((1 - Math.cos((2 * Math.PI * phase) / synodic)) / 2) * 100
  );
  const idx = Math.floor((phase / synodic) * 8 + 0.5) % 8;
  const names: [string, string][] = [
    ["Amavasya (New Moon)", "🌑"],
    ["Waxing Crescent", "🌒"],
    ["First Quarter", "🌓"],
    ["Waxing Gibbous", "🌔"],
    ["Purnima (Full Moon)", "🌕"],
    ["Waning Gibbous", "🌖"],
    ["Last Quarter", "🌗"],
    ["Waning Crescent", "🌘"],
  ];
  const [name, emoji] = names[idx];
  return { name, emoji, illum };
}

/** Real WhatsApp share — opens WhatsApp with prefilled text. */
export function shareToWhatsApp(text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

/** Native share sheet (Instagram/WhatsApp/etc.) with WhatsApp fallback. */
export async function nativeShare(title: string, text: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      /* user cancelled */
      return false;
    }
  }
  shareToWhatsApp(text);
  return true;
}

/** Real Google Calendar — event-creation deep link (no key needed). */
export function googleCalendarUrl(opts: {
  title: string;
  details: string;
  start: Date;
  minutes: number;
}) {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const end = new Date(opts.start.getTime() + opts.minutes * 60000);
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    details: opts.details,
    dates: `${fmt(opts.start)}/${fmt(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/* ============================================================
   API KEY VAULT — user-provided keys, stored only in-browser
   ============================================================ */

export type ServiceDef = {
  key: string;
  name: string;
  purpose: string;
  placeholder: string;
  tier: "live" | "key" | "server";
};

export const SERVICES: ServiceDef[] = [
  { key: "openai", name: "OpenAI", purpose: "Cosmos Twin live AI (gpt-4o-mini)", placeholder: "sk-…", tier: "key" },
  { key: "elevenlabs", name: "ElevenLabs", purpose: "AI voice notes", placeholder: "xi-api-key…", tier: "key" },
  { key: "prokerala", name: "Prokerala", purpose: "Real kundli, panchang, gun-milan", placeholder: "client id:secret", tier: "server" },
  { key: "supabase", name: "Supabase", purpose: "DB, auth, realtime (anon key)", placeholder: "https://xxx.supabase.co|anon-key", tier: "key" },
  { key: "razorpay", name: "Razorpay", purpose: "UPI / wallet payments (key-id)", placeholder: "rzp_test_…", tier: "key" },
  { key: "hundredms", name: "100ms", purpose: "Real video/audio calls", placeholder: "room token…", tier: "server" },
  { key: "onesignal", name: "OneSignal", purpose: "Push notifications (app id)", placeholder: "app-id…", tier: "key" },
  { key: "posthog", name: "PostHog", purpose: "Product analytics", placeholder: "phc_…", tier: "key" },
  { key: "sentry", name: "Sentry", purpose: "Crash reporting (DSN)", placeholder: "https://…@sentry.io/…", tier: "key" },
  { key: "msg91", name: "MSG91", purpose: "OTP SMS", placeholder: "auth key…", tier: "server" },
];

const VAULT = "cosmos_api_vault";

export function getServiceKey(k: string): string {
  const v = store.get<Record<string, string>>(VAULT, {});
  return v[k] ?? "";
}

export function setServiceKey(k: string, val: string) {
  const v = store.get<Record<string, string>>(VAULT, {});
  if (val.trim()) v[k] = val.trim();
  else delete v[k];
  store.set(VAULT, v);
}

export function connectedCount(): number {
  const v = store.get<Record<string, string>>(VAULT, {});
  return Object.keys(v).length;
}
