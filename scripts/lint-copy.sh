#!/usr/bin/env bash
# Fails if banned marketing filler appears in app source (see DECISIONS.md / Fletch pass).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAT="unlock|supercharge|empower|revolutionize|game-changer|synergy"
# ripgrep preferred
if command -v rg >/dev/null 2>&1; then
  if rg -n --glob '!node_modules/**' --glob '!.next/**' --glob '!*.tsbuildinfo' "$PAT" \
    "$ROOT/lib" "$ROOT/components" "$ROOT/app" 2>/dev/null; then
    echo "lint-copy: banned phrase pattern matched (^). Remove or rephrase."
    exit 1
  fi
else
  if grep -rEn --include='*.ts' --include='*.tsx' --include='*.md' "$PAT" \
    "$ROOT/lib" "$ROOT/components" "$ROOT/app" 2>/dev/null | grep -v node_modules | grep -v .next; then
    echo "lint-copy: banned phrase pattern matched."
    exit 1
  fi
fi
echo "lint-copy: OK"
exit 0
