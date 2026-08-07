# COSMOS OS — API Keys & Real-Backend Setup

Which API powers which screen, where to sign up, and the exact order to do it.
The live demo needs **none** of these (it runs standalone). This is the guide to
turn the prototype into a real, live product.

---

## The golden rule
Secret keys live on the **backend** (Supabase Edge Function / Vercel serverless),
**never** in the React frontend. The app calls *your* backend → your backend calls
OpenAI/Razorpay/etc. Anyone can view-source the frontend, so a key there = stolen.

---

## Tier 1 — makes the app REAL (3 signups · ₹0 beyond your OpenAI credit)

| Key | Powers these screens | Sign up | Cost |
|---|---|---|---|
| `OPENAI_API_KEY` | Cosmos Twin, astrologer AI copilot (Life Snapshot), Ritual Moment suggestions, daily Cosmic Weather, prediction extraction, Compatibility insights | platform.openai.com → API Keys | you have **$10** (gpt-4o-mini ≈ 10M tokens) |
| `SUPABASE_*` | Login, database (users, charts, consults, karma, predictions, memory), live text chat, file storage | supabase.com → New project | Free |
| Vercel | Hosting + serverless (holds the secret keys) | vercel.com | Free |

**Model to use:** `gpt-4o-mini` for everything (Twin, readings, extraction). Cheap,
fast, more than enough. Reserve `gpt-4o` only for the deepest astrologer copilot.

---

## Tier 2 — makes it a real BUSINESS

| Key | Powers | Sign up | Cost |
|---|---|---|---|
| `HMS_ACCESS_KEY` / `HMS_SECRET` | **Real video & audio calls** + AstroTalk-Live streams (the Call/Video screens) | 100ms.live (India-first) or agora.io | Free ~10k min/mo |
| `RAZORPAY_*` | Payments — wallet recharge, per-minute consults, Ritual Moment store | razorpay.com | 2%/txn |
| `MSG91_AUTH_KEY` | Real phone OTP (Login screen) | msg91.com | ~₹0.15/SMS |
| `PROKERALA_*` | Real Free Kundli, Panchang, Muhurat, Kundli Matching | prokerala.com/astrology/api (or self-host Swiss Ephemeris — free) | Free ~50-100/day |
| `ONESIGNAL_*` | Push notifications — daily horoscope (the #1 retention hook) | onesignal.com | Free |

---

## Tier 3 — polish / scale

| Key | Powers | Cost |
|---|---|---|
| `ELEVENLABS_API_KEY` (or OpenAI TTS) | Voice notes / AI voice companion | free tier / your OpenAI credit |
| `CLOUDINARY_URL` | Optimized image/avatar hosting (Supabase Storage also works, free) | free tier |
| `POSTHOG_KEY` | Analytics — DAU/MAU, funnels, retention | free tier |
| `SENTRY_DSN` | Error tracking | free tier |

---

## The minimum real build (do this order)
1. Create **Supabase** project → copy `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
2. Create **OpenAI** key (you have credit)
3. `cp .env.example .env` and fill Tier 1
4. Deploy on **Vercel** (frontend + `/api` serverless functions)
5. Serverless function pattern (never expose the key):
   ```
   frontend → POST /api/twin  → (Vercel/Supabase fn, holds OPENAI_API_KEY)
                              → OpenAI gpt-4o-mini with the user's chart as context
                              → streams reply back
   ```
6. Add Tier 2 as you get real users.

---

## What's real vs simulated in the current prototype
- **Simulated (works for demo, needs a key to be real):** AI chat responses (canned →
  swap to OpenAI), video/audio call (UI only → swap to 100ms/Agora), OTP (any 6 digits →
  MSG91), payments (fake modal → Razorpay), kundli/panchang (hardcoded → Prokerala).
- **Real already:** all UI, navigation, state, streaks/karma/missions, PNG card export,
  localStorage persistence.
