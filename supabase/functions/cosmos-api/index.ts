// COSMOS OS — secure server API (Supabase Edge Function, Deno).
// Holds SECRET keys (Prokerala, 100ms) server-side so the browser never sees them.
//
// Deploy:
//   supabase functions deploy cosmos-api --no-verify-jwt
//   supabase secrets set PROKERALA_CLIENT_ID=... PROKERALA_CLIENT_SECRET=... \
//                        HMS_ACCESS_KEY=... HMS_APP_SECRET=...
//
// The frontend calls it with { action, params } and gets real data back.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

// ---- Prokerala OAuth (token cached in memory until ~expiry) ----
let pkToken = "";
let pkExp = 0;
async function prokeralaToken(): Promise<string> {
  if (pkToken && Date.now() < pkExp) return pkToken;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: (Deno.env.get("PROKERALA_CLIENT_ID") ?? "").trim(),
    client_secret: (Deno.env.get("PROKERALA_CLIENT_SECRET") ?? "").trim(),
  });
  const idSet = (Deno.env.get("PROKERALA_CLIENT_ID") ?? "").length;
  const secretSet = (Deno.env.get("PROKERALA_CLIENT_SECRET") ?? "").length;
  const r = await fetch("https://api.prokerala.com/token", { method: "POST", body });
  const j = await r.json();
  if (!j.access_token) {
    throw new Error(
      `prokerala auth failed (HTTP ${r.status}): ${j.error ?? ""} ${j.error_description ?? j.message ?? ""} [id_len=${idSet}, secret_len=${secretSet}]`
    );
  }
  pkToken = j.access_token;
  pkExp = Date.now() + (j.expires_in ?? 3600) * 1000 - 60_000;
  return pkToken;
}

async function prokerala(path: string, qs: Record<string, string>) {
  const token = await prokeralaToken();
  const url = `https://api.prokerala.com/v2/astrology/${path}?` + new URLSearchParams(qs);
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await r.text();
  if (!r.ok) throw new Error(`prokerala ${path} HTTP ${r.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

// ---- 100ms app token (JWT to join a room) ----
async function hmsToken(roomId: string, userId: string, role = "host"): Promise<string> {
  const access = Deno.env.get("HMS_ACCESS_KEY") ?? "";
  const secret = Deno.env.get("HMS_APP_SECRET") ?? "";
  const enc = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const now = Math.floor(Date.now() / 1000);
  const header = enc({ alg: "HS256", typ: "JWT" });
  const payload = enc({
    access_key: access,
    room_id: roomId,
    user_id: userId,
    role,
    type: "app",
    version: 2,
    jti: crypto.randomUUID(),
    iat: now,
    nbf: now,
    exp: now + 3600,
  });
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${payload}`));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${header}.${payload}.${sigB64}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { action, params = {} } = await req.json();

    if (action === "kundli") {
      // params: { datetime, lat, lng }  e.g. "1999-03-14T06:45:00+05:30"
      const qs = {
        ayanamsa: "1", // Lahiri
        coordinates: `${params.lat ?? 26.9124},${params.lng ?? 75.7873}`,
        datetime: params.datetime ?? "1999-03-14T06:45:00+05:30",
      };
      return json(await prokerala("kundli", qs));
    }

    if (action === "panchang") {
      const qs = {
        ayanamsa: "1",
        coordinates: `${params.lat ?? 28.6139},${params.lng ?? 77.209}`,
        datetime: params.datetime ?? new Date().toISOString(),
      };
      return json(await prokerala("panchang", qs));
    }

    if (action === "kundli-match") {
      const qs = {
        ayanamsa: "1",
        girl_coordinates: `${params.girlLat},${params.girlLng}`,
        girl_dob: params.girlDob,
        boy_coordinates: `${params.boyLat},${params.boyLng}`,
        boy_dob: params.boyDob,
      };
      return json(await prokerala("kundli-matching", qs));
    }

    if (action === "hms-token") {
      const token = await hmsToken(
        params.roomId ?? "",
        params.userId ?? crypto.randomUUID(),
        params.role ?? "host",
      );
      return json({ token });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
