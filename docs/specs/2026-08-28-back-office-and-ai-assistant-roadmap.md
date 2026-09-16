# FORBSA — back-office + AI assistant: decomposition roadmap

_Date: 2026-08-28. Status: roadmap agreed on scope; each sub-project still needs its own design spec._

## Context

The FORBSA site (Next.js 16 + Payload CMS 3 + Postgres, self-hosted via Docker)
needs a sales back-office and an on-site chatbot. The ask was framed as "a CMS
with Bitrix-level breadth." This document scopes that down to what was actually
chosen in Q&A and splits it into independently buildable sub-projects.

## What this is / is not

- **Is:** a custom back-office built on the existing Payload stack, plus a
  retrieval-based AI assistant. Self-hosted, 152-ФЗ-aligned.
- **Is not:** a Bitrix clone. No portal/intranet, no BPM engine, no telephony, no
  e-commerce, no dealer self-service portal (explicitly dropped), no operator
  live-chat. Those are not in scope and should be pushed back on if they resurface.

## Decisions locked (from Q&A)

| Topic | Decision |
|---|---|
| Back-office platform | Custom, on Payload — not Bitrix24 integration |
| CRM UI | Payload admin panel for now; managers' real tool is a custom 1C, integrate later |
| 1C integration | Not now. Data model must carry sync fields so it's additive later |
| Capabilities in scope | CRM pipeline, document generation, team tasks + notifications |
| Dropped | Dealer portal, analytics dashboards (revisit later if needed) |
| Chatbot | AI assistant grounded on catalog + docs; no human handoff |
| LLM | RU API — YandexGPT or GigaChat (final pick in SP5) |
| Compliance | 152-ФЗ required (RU data residency, consent, retention, erasure) |
| Back-office users | 1–5. Simple role model (manager / admin), no real-time collaboration |

## Sub-projects

### SP1 — Compliance & hosting baseline  _(do first; ~few days)_

Thin, cross-cutting. Unblocks everything that touches personal data.

- Consent capture (checkbox + timestamp + policy version) on every PII entry
  point: `LeadForm`, `DealerForm`, `LeadMagnetForm`, and the chatbot. Store a
  consent record.
- `AuditLog` collection + a Payload `afterChange`/`afterDelete` hook: actor,
  entity, action, diff, timestamp — for CRM records.
- Data-retention job: anonymize non-converted leads / chat sessions older than N
  years. Admin action for on-request erasure (152-ФЗ right to deletion).
- Rate limiting + strict input validation on public API routes
  (`/api/leads`, chatbot endpoint); same-origin checks; secrets stay in the
  server secret store, never the repo.
- Privacy policy page + processing notice; confirm Postgres + uploads + LLM
  calls all stay on RU infrastructure.

### SP2 — CRM pipeline  _(foundation for SP3/SP4; ~1–1.5 wk)_

All in Payload admin — collections + access functions + list-view customization.

- Extend `Leads`: `stage` (new / qualified / proposal / won / lost), `owner`
  (→ Users), `company` (→ Companies), `nextActionAt`, `lostReason`.
- New `Companies`: name, ИНН, city, kind (dealer / architect / developer /
  end-customer), notes.
- New `Deals`: title, company, owner, stage, amount, products (→ Products),
  expectedCloseAt, lostReason.
- New `Activities`: kind (call / email / meeting / note), related deal/lead,
  author, dueAt, doneAt, body.
- RBAC: `role` on Users (`admin` / `manager`). Managers: own + unassigned;
  admins: all. Payload access functions.
- **1C-readiness:** `externalId` (unique, nullable), `source`
  (site / 1c / manual), `syncedAt` on Companies, Deals, Leads.
- Admin UX: custom list columns, filter by stage/owner, a "my open deals" view.
  Kanban board deferred — the list view is enough for ≤5 users.

### SP3 — Team tasks + notifications  _(after SP2; ~1 wk)_

- `Tasks`: title, assignee, related deal/lead, dueAt, status, priority. (May
  merge with `Activities` — decide at spec time.)
- Job runner: Payload 3 jobs/queues if mature in 3.88, else node cron.
- Triggers: new lead → notify owner (round-robin if unassigned); deal stuck past
  SLA → remind owner; task due → remind assignee; optional daily digest.
- Channels: email (Payload email adapter + RU SMTP) and Telegram (bot API, per-user
  chat IDs). Both RU-friendly.

### SP4 — Document generation  _(after SP2; ~1 wk)_

- `DocumentTemplates`: type (КП / invoice / contract), body with placeholders,
  header assets.
- Generate from a Deal → PDF via `@react-pdf/renderer` (no headless browser in
  prod). Store as Media / `GeneratedDocuments` linked to the Deal; downloadable
  from admin.
- `DocumentCounters`: atomic per-type, per-year numbering; scheme compatible with
  a future 1C hand-off.

### SP5 — AI assistant chatbot  _(parallel with SP2–SP4, after SP1; ~1.5–2 wk)_

- **Ingestion:** knowledge base from Products (all fields) + Documents + key site
  copy. Chunk + embed with YandexGPT / GigaChat embeddings (data stays in RU).
  Store vectors in Postgres via `pgvector` (adds the extension; reuses the
  existing DB).
- **Answer:** embed the query → top-k from pgvector → prompt the RU LLM with
  retrieved context + guardrails (answer only from context; otherwise offer to
  take contact details). Stream responses.
- **Widget:** client component, floating launcher, RU UI, respects
  `prefers-reduced-motion`. Conversations stored in `ChatSessions` (consent-gated
  if PII).
- **Lead capture:** contact shared / quote requested → create a `Lead`
  (`source: chatbot`) → SP2 pipeline.
- **Re-index:** Payload `afterChange` on Products/Documents enqueues a re-embed
  job.
- **Compliance:** consent line before first message, retention policy on
  `ChatSessions`, no PII in logs, rate limiting + token-budget caps on the
  endpoint.

## Sequencing

```
SP1 ──┬── SP2 ──┬── SP3
      │         └── SP4
      └── SP5 (joins SP2 only at lead hand-off)
```

Rough order of magnitude: ~5–7 weeks of focused work total — not a Bitrix.

## Open questions (resolve when spec'ing each sub-project)

- SP3: RU SMTP provider; Telegram bot registration.
- SP4: `@react-pdf/renderer` vs HTML→PDF; exact КП/invoice layouts.
- SP5: YandexGPT vs GigaChat (pricing, RU technical-text quality); `pgvector`
  availability on the production Postgres.
- SP2: merge `Tasks` into `Activities` or keep separate.

## Status (2026-08-28)

All five sub-projects implemented and verified against the dev DB:

- **SP1** ✅ consent records, `/privacy`, audit log, rate limiting, retention script
- **SP2** ✅ Companies / Deals / Activities, roles + RBAC, 1C-ready fields
- **SP3** ✅ tasks (assignee/priority on Activities), instant + scheduled
  notifications, `/api/cron/notify`
- **SP4** ✅ КП PDF from a Deal (`@react-pdf/renderer`), `CompanyProfile` global,
  `/api/deals/[id]/kp`
- **SP5** ✅ chatbot — YandexGPT adapter + offline mock, product KB with JS cosine,
  `/api/chat` + `/api/chat/lead`, floating widget, `ChatSessions`

Each has a design doc in this folder. Schema ships as migrations
`20260828_*` (`src/migrations/`).

### Before production

- Set `db.push: false`; run `npx payload migrate` in the deploy step.
- Add `@payloadcms/email-nodemailer` + RU SMTP (SP3 email is console-only now).
- Fill `CompanyProfile` with real ООО «Форбса» requisites (SP4).
- Set `YANDEX_API_KEY` / `YANDEX_FOLDER_ID` (SP5; runs in demo/mock without them).
- Legal review of `/privacy` text (SP1).
- Wire a host cron to `GET /api/cron/notify` with `CRON_SECRET` (SP3).
- Set `TELEGRAM_BOT_TOKEN` + per-user `telegramChatId` for Telegram alerts (SP3).
