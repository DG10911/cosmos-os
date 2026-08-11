import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Real Supabase client — created only if the public env keys are present.
 * If not configured, everything degrades gracefully to local-only (no crash).
 *
 * The app keeps localStorage as the fast source of truth and MIRRORS events
 * (karma, streak, rituals, missions) into Supabase in the background — so the
 * numbers genuinely land in a real Postgres database you can watch update.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

export const isSupabaseLive = !!supabase;

/** Stable anonymous device id so events group per visitor without login. */
export function deviceId(): string {
  const k = "cosmos_device_id";
  let v = localStorage.getItem(k);
  if (!v) {
    v = `dev_${Math.abs(hashStr(`${navigator.userAgent}${screen.width}x${screen.height}`))}_${Date.now().toString(36)}`;
    localStorage.setItem(k, v);
  }
  return v;
}

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Fire-and-forget event write to the real DB. Never throws, never blocks UI.
 * Requires a table `cosmos_events` (SQL in KEYS-SETUP / README).
 */
export function logEvent(
  type: string,
  payload: Record<string, unknown> = {}
): void {
  if (!supabase) return;
  supabase
    .from("cosmos_events")
    .insert({ device_id: deviceId(), type, payload })
    .then(
      () => {},
      () => {} // swallow errors — logging must never break the app
    );
}
