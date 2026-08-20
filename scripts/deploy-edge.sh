#!/usr/bin/env bash
#
# COSMOS OS — deploy the edge function + push its secrets from .env.
# Run this AFTER:  supabase login  &&  supabase link --project-ref ffyxzqvgmtzjicnrbwgc
#
# Usage:  bash scripts/deploy-edge.sh
#
# Reads the five secrets the edge function needs directly from cosmos-os/.env,
# so nothing sensitive is ever typed or printed to the terminal.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v supabase >/dev/null 2>&1; then
  echo "❌ Supabase CLI not found. Install it first:"
  echo "     brew install supabase/tap/supabase"
  exit 1
fi

if [ ! -f .env ]; then
  echo "❌ cosmos-os/.env not found."
  exit 1
fi

# Load only the keys the edge function uses (avoids reserved SUPABASE_* names).
set -a
# shellcheck disable=SC1090
source <(grep -E '^(OPENAI_API_KEY|PROKERALA_CLIENT_ID|PROKERALA_CLIENT_SECRET|HMS_ACCESS_KEY|HMS_APP_SECRET)=' .env)
set +a

echo "▶ Deploying cosmos-api edge function…"
supabase functions deploy cosmos-api --no-verify-jwt

echo "▶ Pushing secrets (values read from .env, not shown)…"
supabase secrets set \
  OPENAI_API_KEY="$OPENAI_API_KEY" \
  PROKERALA_CLIENT_ID="$PROKERALA_CLIENT_ID" \
  PROKERALA_CLIENT_SECRET="$PROKERALA_CLIENT_SECRET" \
  HMS_ACCESS_KEY="$HMS_ACCESS_KEY" \
  HMS_APP_SECRET="$HMS_APP_SECRET"

echo ""
echo "✅ Done. Verify with:  node scripts/test-keys.mjs"
echo "   Then the ai-json + hms-token edge actions will pass."
