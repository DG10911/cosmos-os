# COSMOS OS

**The world's first AI-powered Life Operating System — built for AstroHack 2026.**

A daily-habit astrology super-app that turns AstroLive from a consultation marketplace
into an app users open every morning — and closes the market leader's ₹130 Cr in-app
cross-sell gap with the **Ritual Moment**.

## The winning insight

AstroTalk (₹1,176 Cr FY25 leader) does ₹140 Cr in ecommerce — but **<3%** comes from
in-app cross-sell during consultations. COSMOS OS closes that gap while building the
first Indian daily-habit + viral loop (Co-Star + Duolingo + Spotify Wrapped, localized
to Panchang/Dasha/Muhurat).

Four AstroHack axes, one architecture: **Habit · Virality · New Revenue · USP.**

## Screens

Splash · 5-step Onboarding · Today (Cosmic Weather) · Consult · Astrologer Profile ·
**Live Chat + Life Snapshot + Ritual Moment** · Session Summary · **Compatibility Card
(shareable)** · Missions + Karma + Streak · Destiny Timeline · Destiny Replay · Profile.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview
```

## Tech

Vite · React · TypeScript · Tailwind CSS · React Router · Framer Motion · Lucide.
All demo data is local (no backend needed for the prototype). State persists to
localStorage. Tap **Me → Reset demo** to replay onboarding.

## Demo flow (90 seconds)

1. Today → complete the ritual (confetti, +10 Karma)
2. Tap the suggested astrologer → **Chat**
3. Watch the Life Snapshot + auto-played consultation
4. **Ritual Moment card** slides in → Buy Now (the ₹130 Cr fix)
5. End → Session Summary with prediction locked in
6. Circle → **Compatibility Card** → Save/Share (the viral atom)

Built with Claude (Anthropic) + Vite. See the report for full citations.
