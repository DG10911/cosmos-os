#!/usr/bin/env bash
#
# COSMOS OS — deploy the edge function + push its secrets. Fully non-interactive:
# no brew, no Xcode CLT, no Docker, no browser login.
#
# One-time: create a Personal Access Token at
#   https://supabase.com/dashboard/account/tokens
# and add it to cosmos-os/.env:
#   SUPABASE_ACCESS_TOKEN=sbp_xxx
#
# Then run:  bash scripts/deploy-edge.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."
REF="ffyxzqvgmtzjicnrbwgc"

# Use a global `supabase` if present, else the npm devDependency via npx.
if command -v supabase >/dev/null 2>&1; then SB=(supabase); else SB=(npx --no-install supabase); fi

[ -f .env ] || { echo "❌ cosmos-os/.env not found."; exit 1; }

# Read each needed value directly (robust to spaces / special chars in secrets —
# unlike `source`, which chokes on them). Nothing is printed.
getenv() { grep -E "^$1=" .env | head -1 | cut -d= -f2- | sed -e 's/^[[:space:]]*//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" | tr -d '\r'; }
SUPABASE_ACCESS_TOKEN="$(getenv SUPABASE_ACCESS_TOKEN)"
OPENAI_API_KEY="$(getenv OPENAI_API_KEY)"
PROKERALA_CLIENT_ID="$(getenv PROKERALA_CLIENT_ID)"
PROKERALA_CLIENT_SECRET="$(getenv PROKERALA_CLIENT_SECRET)"
HMS_ACCESS_KEY="$(getenv HMS_ACCESS_KEY)"
HMS_APP_SECRET="$(getenv HMS_APP_SECRET)"
SARVAM_API_KEY="$(getenv SARVAM_API_KEY)"
export SUPABASE_ACCESS_TOKEN

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "❌ SUPABASE_ACCESS_TOKEN not set in .env."
  echo "   1) Create one: https://supabase.com/dashboard/account/tokens"
  echo "   2) Add to cosmos-os/.env:  SUPABASE_ACCESS_TOKEN=sbp_xxx"
  exit 1
fi

echo "▶ Deploying cosmos-api (server-side bundle — no Docker)…"
"${SB[@]}" functions deploy cosmos-api --no-verify-jwt --use-api --project-ref "$REF"

echo "▶ Pushing secrets (values read from .env, not shown)…"
"${SB[@]}" secrets set --project-ref "$REF" \
  OPENAI_API_KEY="$OPENAI_API_KEY" \
  PROKERALA_CLIENT_ID="$PROKERALA_CLIENT_ID" \
  PROKERALA_CLIENT_SECRET="$PROKERALA_CLIENT_SECRET" \
  HMS_ACCESS_KEY="$HMS_ACCESS_KEY" \
  HMS_APP_SECRET="$HMS_APP_SECRET" \
  ${SARVAM_API_KEY:+SARVAM_API_KEY="$SARVAM_API_KEY"}

echo ""
echo "✅ Done. Verify with:  node scripts/test-keys.mjs   (and re-test the edge actions)"
