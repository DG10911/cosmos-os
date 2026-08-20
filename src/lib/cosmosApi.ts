/**
 * Client for the COSMOS OS secure Edge Function (supabase/functions/cosmos-api).
 * Returns real Prokerala data when the function is deployed; callers fall back
 * to the on-device ephemeris if it isn't (so the app always works).
 */
const BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export function edgeApiReady(): boolean {
  return !!BASE && !!ANON;
}

async function call<T>(action: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!BASE || !ANON) return null;
  try {
    const r = await fetch(`${BASE}/functions/v1/cosmos-api`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${ANON}`,
        apikey: ANON,
      },
      body: JSON.stringify({ action, params }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (j?.error) return null;
    return j as T;
  } catch {
    return null; // function not deployed / network — caller falls back
  }
}

export type RealKundli = {
  nakshatra?: { name?: string };
  chandra_rasi?: { name?: string };
  soorya_rasi?: { name?: string };
  [k: string]: unknown;
};

export function fetchRealKundli(p: { datetime: string; lat: number; lng: number }) {
  return call<{ data?: RealKundli } | RealKundli>("kundli", p);
}

export function fetchRealPanchang(p: { datetime: string; lat: number; lng: number }) {
  return call<Record<string, unknown>>("panchang", p);
}

/** Mint a real 100ms room token (used by the video call screen). */
export function fetchHmsToken(roomId: string, userId?: string) {
  return call<{ token: string }>("hms-token", { roomId, userId, role: "host" });
}

/** Sarvam AI text-to-speech — returns base64 WAV audio (null if unavailable). */
export function fetchSarvamTts(p: { text: string; lang?: string; speaker?: string }) {
  return call<{ audio: string }>("sarvam-tts", p);
}
