#!/usr/bin/env node
/**
 * COSMOS OS — API key tester.
 * Reads cosmos-os/.env and pings each service to confirm the key is valid.
 * Only tests keys that are filled in; blanks are skipped.
 *
 *   node scripts/test-keys.mjs
 *
 * Requires Node 18+ (native fetch). No npm install needed.
 * Keys never leave your machine except to each service's official API.
 */
import { readFileSync } from "node:fs";
import { createHmac } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, "..", ".env");

// ---- load .env ----
let env = {};
try {
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
} catch {
  console.error(`\n❌ No .env file found at ${ENV_PATH}`);
  console.error(`   Run:  cp .env.example .env   then paste your keys.\n`);
  process.exit(1);
}

const has = (k) => env[k] && env[k].length > 3;
const results = [];
const log = (name, ok, detail) => results.push({ name, ok, detail });

async function timed(fn) {
  return await Promise.race([
    fn(),
    new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 12000)),
  ]);
}

async function test(name, requiredKeys, fn) {
  if (!requiredKeys.every(has)) {
    results.push({ name, ok: null, detail: "skipped (no key)" });
    return;
  }
  try {
    const detail = await timed(fn);
    log(name, true, detail || "valid");
  } catch (e) {
    log(name, false, e.message);
  }
}

// ---------- tests ----------
await test("OpenAI", ["OPENAI_API_KEY"], async () => {
  const r = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return `${j.data?.length ?? 0} models available`;
});

await test("Supabase", ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"], async () => {
  const r = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/`, {
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY },
  });
  if (r.status >= 500) throw new Error(`HTTP ${r.status}`);
  return `reachable (HTTP ${r.status})`;
});

await test("Prokerala", ["PROKERALA_CLIENT_ID", "PROKERALA_CLIENT_SECRET"], async () => {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.PROKERALA_CLIENT_ID,
    client_secret: env.PROKERALA_CLIENT_SECRET,
  });
  const r = await fetch("https://api.prokerala.com/token", { method: "POST", body });
  const j = await r.json();
  if (!j.access_token) throw new Error(j.error || `HTTP ${r.status}`);
  return "OAuth token issued ✓";
});

await test("Pinecone", ["PINECONE_API_KEY"], async () => {
  const r = await fetch("https://api.pinecone.io/indexes", {
    headers: { "Api-Key": env.PINECONE_API_KEY, "X-Pinecone-API-Version": "2024-07" },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return `${j.indexes?.length ?? 0} index(es)`;
});

await test("Razorpay", ["VITE_RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"], async () => {
  const auth = Buffer.from(`${env.VITE_RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const r = await fetch("https://api.razorpay.com/v1/payments?count=1", {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "credentials valid ✓";
});

await test("OneSignal", ["VITE_ONESIGNAL_APP_ID", "ONESIGNAL_REST_API_KEY"], async () => {
  const r = await fetch(`https://api.onesignal.com/apps/${env.VITE_ONESIGNAL_APP_ID}`, {
    headers: { Authorization: `Basic ${env.ONESIGNAL_REST_API_KEY}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "app + REST key valid ✓";
});

await test("100ms", ["HMS_ACCESS_KEY", "HMS_APP_SECRET"], async () => {
  // build a short-lived management JWT (HS256) and hit the rooms API
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const header = b64({ alg: "HS256", typ: "JWT" });
  const payload = b64({
    access_key: env.HMS_ACCESS_KEY,
    type: "management",
    version: 2,
    jti: `${now}`,
    iat: now,
    nbf: now,
    exp: now + 3600,
  });
  const sig = createHmac("sha256", env.HMS_APP_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  const token = `${header}.${payload}.${sig}`;
  const r = await fetch("https://api.100ms.live/v2/rooms?limit=10", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "management token valid ✓";
});

await test("ElevenLabs", ["ELEVENLABS_API_KEY"], async () => {
  const r = await fetch("https://api.elevenlabs.io/v1/user", {
    headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "valid ✓";
});

await test("Deepgram", ["DEEPGRAM_API_KEY"], async () => {
  const r = await fetch("https://api.deepgram.com/v1/projects", {
    headers: { Authorization: `Token ${env.DEEPGRAM_API_KEY}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "valid ✓";
});

await test("Cloudinary", ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"], async () => {
  const auth = Buffer.from(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`).toString("base64");
  const r = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/resources/image?max_results=1`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "valid ✓";
});

await test("PDFMonkey", ["PDFMONKEY_API_KEY"], async () => {
  const r = await fetch("https://api.pdfmonkey.io/api/v1/current_user", {
    headers: { Authorization: `Bearer ${env.PDFMONKEY_API_KEY}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "valid ✓";
});

await test("Resend", ["RESEND_API_KEY"], async () => {
  const r = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}` },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return "valid ✓";
});

await test("GeoNames", ["GEONAMES_USERNAME"], async () => {
  const r = await fetch(`http://api.geonames.org/searchJSON?q=Delhi&maxRows=1&username=${env.GEONAMES_USERNAME}`);
  const j = await r.json();
  if (j.status) throw new Error(j.status.message);
  return `${j.totalResultsCount ?? 0} results`;
});

// presence-only (public analytics keys — nothing to auth-test)
for (const [name, key] of [["PostHog", "VITE_POSTHOG_KEY"], ["Sentry", "VITE_SENTRY_DSN"]]) {
  results.push({ name, ok: has(key) ? "present" : null, detail: has(key) ? "key present (loads in browser)" : "skipped (no key)" });
}

// ---------- report ----------
console.log("\n  COSMOS OS — API key check\n  " + "─".repeat(46));
let pass = 0, fail = 0, skip = 0;
for (const r of results) {
  let icon;
  if (r.ok === true || r.ok === "present") { icon = "✅"; pass++; }
  else if (r.ok === false) { icon = "❌"; fail++; }
  else { icon = "⏭️ "; skip++; }
  console.log(`  ${icon} ${r.name.padEnd(12)} ${r.detail}`);
}
console.log("  " + "─".repeat(46));
console.log(`  ${pass} working · ${fail} failed · ${skip} skipped\n`);
process.exit(fail > 0 ? 1 : 0);
