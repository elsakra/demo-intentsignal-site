#!/usr/bin/env bash
# Push variables from .env.local to Vercel Production (sensitive, not printed).
# Usage: from repo root, run: bash scripts/vercel-sync-env.sh
set -euo pipefail
cd "$(dirname "$0")/.."
ENV_FILE="${1:-.env.local}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Copy from .env.example, fill in secrets, save as .env.local, then re-run."
  exit 1
fi
# Skip: CLI tokens that must never live in Next.js runtime
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line//$'\r'/}"
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  [[ -z "${line//[[:space:]]/}" ]] && continue
  if [[ ! "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
    continue
  fi
  key="${BASH_REMATCH[1]}"
  val="${line#*=}"
  case "$key" in
    VERCEL_TOKEN|GITHUB_TOKEN) continue ;;
  esac
  # Strip optional surrounding quotes
  if [[ "$val" == \"*\" ]]; then
    val="${val#\"}"; val="${val%\"}"
  elif [[ "$val" == \'*\' ]]; then
    val="${val#\'}"; val="${val%\'}"
  fi
  [[ -z "$val" ]] && continue
  echo "Pushing $key to Vercel production…"
  printf '%s' "$val" | /usr/local/bin/vercel env add "$key" production --sensitive --force
done < "$ENV_FILE"
echo "Done. Redeploy from Vercel dashboard or: vercel --prod --yes"
exit 0
