# Security review — SP1–SP5 (2026-08-28)

Scope: all code added this session — public API routes, the RBAC layer, the
chatbot/LLM path, notifications, PDF generation, secret handling. Database is
PostgreSQL via Payload/Drizzle (parameterised queries).

**Summary:** 4 findings fixed in code, 3 deployment-time notes. No
Critical/High. No SQL injection, SSRF, XSS, CSRF, or auth-bypass found.

---

## Fixed

### SEC-1 — Chatbot trusted client-supplied conversation history (Medium)

`POST /api/chat` fed the request body's `history[]` straight to the LLM, filtering
only on `role`. A caller could forge `assistant` turns ("ignore all rules…") —
classic prompt injection / putting words in the bot's mouth (impact latent while
the mock provider is active; real once YandexGPT is enabled). No data-exfil path
(each request is independent, no cross-user data in the prompt).
**Fix:** history is now rebuilt server-side from the stored `chat-sessions`
record; the client sends only `{ message, token }`. `history` in the body is
ignored.

### SEC-2 — IDOR on chat session id (Medium)

`/api/chat` and `/api/chat/lead` took a caller-supplied `sessionId` (the
sequential DB integer) and wrote to that row with `overrideAccess: true` — no
ownership check. An attacker could enumerate ids and append messages to, or
attach a lead + flip `consent` on, any visitor's stored conversation (which staff
later review).
**Fix:** sessions are keyed by an unguessable `token` (`crypto.randomUUID()`,
new `chat_sessions.token` column, migration `20260828_130000_sp5_chat_token`).
A non-matching token starts a fresh session; it can never address someone
else's.

### SEC-3 — Rate-limit key spoofable + limiter map unbounded (Medium)

`clientKey` used the **first** hop of `X-Forwarded-For`, which the client
controls; and the in-memory bucket `Map` never evicted. Together: trivially
bypass every rate limit (the only spam/DoS control on PII-writing endpoints) and
grow the map without bound → memory DoS.
**Fix:** `clientKey` now prefers `X-Real-IP`, else the **last** XFF hop (the one
nginx appends). `rateLimit` sweeps expired entries once the map passes 20k keys.
Assumes exactly one trusted reverse proxy (nginx) — documented in the file.

### SEC-4 — Secret in URL query string (Low)

`/api/cron/notify` accepted the `CRON_SECRET` via `?key=`, which leaks into
access/proxy logs and `Referer`.
**Fix:** header-only (`x-cron-key`).

Also tightened: `console.error` in `/api/leads` and the chat routes now logs
`error.message`, not the full error object (Drizzle errors serialise the SQL +
params, i.e. lead name/phone/email — 152-ФЗ).

---

## Deployment-time (not code)

### SEC-5 — Weak `PAYLOAD_SECRET`

Dev `.env` has a 64-bit hex `PAYLOAD_SECRET`; it signs admin session JWTs. The
production `.env` must use a long (32+ byte) random value. Same for `CRON_SECRET`.
`.env.example` already says so.

### SEC-6 — Reverse proxy must be trusted

SEC-3's fix relies on nginx (a) setting `X-Real-IP $remote_addr` and (b) being
the only hop. If the app is ever exposed directly, header-based rate limiting is
void — bind it to the socket peer instead.

### SEC-7 — No app-level security headers

`next.config.mjs` sets no CSP / `X-Frame-Options` / HSTS. Fine if nginx adds
them; otherwise add a `headers()` block. Defense-in-depth, no active vuln (Next
API routes are same-origin by default; the chat widget renders all text through
React escaping).

---

## Verified safe (no finding)

- **SQL injection** — every `payload.find` `where` is parameterised by Drizzle;
  `q` in `/api/search` uses `contains`, not raw SQL.
- **`/api/deals/[id]/kp` authorization** — `payload.auth` + `findByID(..., { user,
  overrideAccess: false })` enforces the deal's `ownedOnly` access; a manager
  cannot pull another manager's КП. `id` non-numeric → 404.
- **SSRF** — Telegram and YandexGPT URLs are constants + server env; `chat_id` /
  `modelUri` are not attacker-controlled.
- **XSS** — chat messages (incl. LLM output) render as `{text}` in React;
  no `dangerouslySetInnerHTML` anywhere. КП PDF renders data as `<Text>`, no
  markup execution.
- **CSRF** — public POST endpoints need no session, so nothing to forge; the one
  cookie-authed route is an idempotent GET whose cross-origin response is opaque.
- **Mass assignment** — public lead routes destructure a fixed field allow-list;
  `owner` / `status` / `linkedDeal` / `externalId` cannot be set by the client.
- **Prototype pollution** — no attacker-object merge; bodies are field-picked.
- **Payload REST for sensitive collections** — `audit-log`, `kb-chunks`,
  `chat-sessions`, `company-profile` (global) all fail closed for
  unauthenticated / non-staff callers.
