# Decisions (demo.intentsignal.ai)

## Enrichment

- **No Apollo** (per product decision). IP enrichment is **IPinfo** (Bearer) only; fields like `technologies` and `recentNews` are often empty or heuristics.
- **Middleware does not use Vercel KV** — the `@vercel/kv@3` bundle pulled Node/Upstash code into the Edge build. Identity for SSR is set only via `x-identity` and cookies. **Node** API routes call `enrich` + `setStoredIdentity` on cache miss (e.g. `/api/personalize` when KV has no row).

## Real-time updates

- **No Pusher** — the client polls `/api/identify-status` for ~45s. On `version` bump, **`reStream` triggers a new** `/api/personalize` **EventSource** so copy can update after RB2B merges a person.
- **RB2B event names** are listened for under several aliases (`rb2b-identified`, `rb2b:identified`, etc.); the vendor’s actual event should be confirmed in their UI/docs.

## How it works diagram

- **No vendor names** in node labels; abstract stages only.

## Claude

- **Default model** `claude-sonnet-4-5-20250929` (override with `ANTHROPIC_MODEL`). JSON-only output; `lib/claude.ts` parses; failure falls back to an archetype.
- Streaming: tokens are forwarded over **SSE**; the hero **delete-then-type** runs on the final parsed JSON, not on raw partial JSON, so we never show half a JSON to users.

## Fonts

- `next/font` **Newsreader** hit “Failed to find font override values” in this toolchain; a single `weight: "400"` is used. If you need 300/600, load extra weights or self-host a variable file.

## Security

- **Rotate** any API tokens that may have been pasted into chat, docs, or CI logs. Never commit `.env.local`.

## Calendly

- Default public URL: `https://calendly.com/d/ck72-7g6-q66` in code when `NEXT_PUBLIC_CALENDLY_URL` is unset (override in Vercel for production).

## Git / Vercel

- The original brief listed `vercel env add ... APOLLO_API_KEY` — **omit**; Apollo is not used.

## DNS (production)

- CNAME: **demo** → `cname.vercel-dns.com` (or the target Vercel shows after `vercel domains add`).
