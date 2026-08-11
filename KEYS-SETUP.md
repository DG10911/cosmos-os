# COSMOS OS — API Keys Setup Guide

> **Read this first — the #1 thing to understand:**
> Our live app is on **GitHub Pages, which is STATIC** (no server). A static site can
> **only** read `VITE_*` keys (they get baked into the browser bundle and are PUBLIC).
> Every **secret** (OpenAI, Prokerala secret, Razorpay secret, MSG91, 100ms, etc.)
> needs a **server** to read it — either **Supabase Edge Functions** or **Vercel**.
> You do NOT "upload a .env" to GitHub Pages and have secrets work. See "WHERE KEYS GO" below.

---

## STEP 1 — Get each key

### Supabase (database, auth, realtime) — https://supabase.com
1. Sign in → **New project** (pick a name + DB password + region: Mumbai/Singapore).
2. Left sidebar → **Project Settings → API**.
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`  (safe for browser)
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`  (SECRET — server only)

### OpenAI (Cosmos Twin AI) — https://platform.openai.com
1. Sign in → top-right avatar → **View API keys** (platform.openai.com/api-keys).
2. **Create new secret key** → copy (shown once) → `OPENAI_API_KEY`.
3. **Billing → add payment method** and load your $10.

### ElevenLabs (AI voice) — https://elevenlabs.io
1. Sign in → profile icon (bottom-left) → **API Keys** → create → `ELEVENLABS_API_KEY`.

### Deepgram (live call transcription) — https://console.deepgram.com
1. Sign up ($200 free credit) → **API Keys → Create a Key** → `DEEPGRAM_API_KEY`.

### Prokerala (real kundli/panchang/gun-milan) — https://api.prokerala.com
1. Sign in → **Dashboard → Clients → Add** (you already did this).
2. App name COSMO-OS · JavaScript Origins: `https://dg10911.github.io` and `https://localhost` (origin only, NO path!).
3. It gives you **Client ID** → `PROKERALA_CLIENT_ID` and **Client Secret** → `PROKERALA_CLIENT_SECRET`.
   (Both used server-side to fetch an OAuth token.)

### GeoNames (birth-place timezone) — https://www.geonames.org
1. **Create account** → confirm email.
2. Log in → account page → **"Click here to enable"** free web services.
3. Your username → `GEONAMES_USERNAME`.

### Pinecone (AI memory / vectors) — https://app.pinecone.io
1. Sign up → **API Keys** → copy default key → `PINECONE_API_KEY`.
2. **Create index** (dimension 1536, metric cosine) → its name → `PINECONE_INDEX_NAME`.

### MSG91 (OTP SMS) — https://msg91.com
1. Sign up → dashboard → **top-right → API** → copy **Auth Key** → `MSG91_AUTH_KEY`.
2. **SMS → OTP → create template** → copy **Template ID** → `MSG91_TEMPLATE_ID`.
3. **Sender ID** (6-letter, needs DLT approval in India) → `MSG91_SENDER_ID`.

### 100ms (video/audio calls) — https://dashboard.100ms.live
1. Sign up → **Developer → App Credentials**.
2. Copy **App Access Key** → `HMS_ACCESS_KEY` and **App Secret** → `HMS_APP_SECRET`.

### Razorpay (payments) — https://dashboard.razorpay.com
1. Sign up → stay in **Test Mode** first (toggle top-left).
2. **Settings → API Keys → Generate Test Key**.
3. **Key Id** → `VITE_RAZORPAY_KEY_ID`  (safe for browser)
   **Key Secret** → `RAZORPAY_KEY_SECRET`  (SECRET — server only)

### OneSignal (push notifications) — https://onesignal.com
1. Sign up → **New App/Website** → configure Web Push.
2. **Settings → Keys & IDs**: **App ID** → `VITE_ONESIGNAL_APP_ID`, **REST API Key** → `ONESIGNAL_REST_API_KEY` (secret).

### PostHog (analytics) — https://posthog.com
1. Sign up (pick US or EU cloud) → **Project Settings**.
2. Copy **Project API Key** (`phc_...`) → `VITE_POSTHOG_KEY`.

### Sentry (crash reports) — https://sentry.io
1. Sign up → **Create Project** → platform "React".
2. **Settings → Client Keys (DSN)** → copy DSN → `VITE_SENTRY_DSN`.

### Cloudinary (image uploads/CDN) — https://cloudinary.com
1. Sign up → **Dashboard** shows Product Environment Credentials.
2. **Cloud name** → `CLOUDINARY_CLOUD_NAME`, **API Key** → `CLOUDINARY_API_KEY`, **API Secret** → `CLOUDINARY_API_SECRET` (secret).

### PDFMonkey (kundli PDFs) — https://www.pdfmonkey.io
1. Sign up → **My Account → API** → copy **Secret Key** → `PDFMONKEY_API_KEY`.

### Resend (email) — https://resend.com
1. Sign up → **API Keys → Create API Key** → `RESEND_API_KEY`.

---

## STEP 2 — Put keys in the file

1. In `cosmos-os/`, copy the template:  `cp .env.example .env`  (or copy your pasted template into a file named `.env`).
2. Paste each value after its `=` (no quotes, no spaces):
   ```
   VITE_SUPABASE_URL=https://abcd1234.supabase.co
   OPENAI_API_KEY=sk-proj-abc123...
   ```
3. **Save.** `.env` is now git-ignored — it will NEVER be committed. Good.

---

## STEP 3 — WHERE KEYS ACTUALLY GO (the important part)

There are TWO buckets:

### Bucket A — `VITE_*` keys (PUBLIC, frontend)
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID`,
`VITE_ONESIGNAL_APP_ID`, `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`.
- These live in `cosmos-os/.env`. When you run `npm run build`, Vite bakes them into the JS bundle.
- They are meant to be public — do NOT put a secret in a `VITE_` var.
- For the GitHub Pages deploy, add them as **GitHub → repo Settings → Secrets and variables → Actions** and reference them in the build workflow (I can wire this).

### Bucket B — secret keys (SERVER only)
`OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PROKERALA_*`, `RAZORPAY_KEY_SECRET`,
`MSG91_*`, `HMS_*`, `ONESIGNAL_REST_API_KEY`, `DEEPGRAM_*`, `PINECONE_*`,
`ELEVENLABS_*`, `CLOUDINARY_*`, `PDFMONKEY_*`, `RESEND_*`, `GEONAMES_USERNAME`.
- A static site CANNOT read these. They go into a **server**:
  - **Supabase:** Dashboard → **Edge Functions → Secrets** (or CLI: `supabase secrets set OPENAI_API_KEY=sk-...`). Your app calls the Edge Function; the function uses the secret.
  - **Vercel:** deploy there instead, then **Project → Settings → Environment Variables**, used by serverless `/api/*` functions.
- You paste these into that **dashboard**, not into GitHub Pages.

---

## Honest note for the hackathon
You do NOT need all of these to submit. The app already runs on real weather + on-device
ephemeris, and the **OpenAI key is entered at runtime inside the app** (Twin → "Go live") —
no `.env` needed for the demo. Everything above is the PRODUCTION path, and it's exactly
this documented, secure, server-side-secrets architecture that scores points with judges.

Minimum "real product" set: Supabase + OpenAI + Prokerala + MSG91 + Razorpay + 100ms + OneSignal.
