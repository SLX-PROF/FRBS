# SP3 — team tasks + notifications (design)

_Date: 2026-08-28. Part of the [roadmap](./2026-08-28-back-office-and-ai-assistant-roadmap.md). Status: implemented and verified against the dev DB._

> **Notes:** pure selectors live in `src/lib/notification-selectors.ts` (so the
> `node`-run self-check needs no bundler); orchestration + transport in
> `src/lib/notifications.ts` / `src/lib/notify.ts`. Schema shipped as migration
> `20260828_100000_sp3_tasks`. Email verified via Payload's console fallback
> ("Email attempted without being configured. To: …, Subject: Новая заявка …");
> real delivery needs a nodemailer adapter + SMTP in prod. Telegram path is
> code-complete but untested (no bot token in the sandbox).

## Context

SP2 gave Leads / Companies / Deals / Activities and an owner model. Nothing tells
the 1–5 sales staff when something needs them: a new lead sits unseen, a deal
goes stale, a planned call is overdue.

## Decisions

- **Tasks = Activities, extended.** No new collection. Add `assignee`
  (relationship → users) and `priority` (low/normal/high) to `Activities`. A
  "task" is an Activity with `dueAt` set; "open" = `dueAt` set and `doneAt` null;
  "overdue" = `dueAt < now` and `doneAt` null. Status is computed in views, not
  stored. Rationale: Activities already has subject/body/deal/lead/dueAt/doneAt;
  a parallel Tasks collection would duplicate RBAC + migration surface for ≤5
  users.
- **Scheduling = external cron → protected route.** `GET /api/cron/notify`,
  authenticated by `CRON_SECRET`. Runs the SLA scan + daily digest. No dependency
  on Payload's jobs queue. Instant events use collection hooks, not cron.
- **Transport = best-effort email + Telegram.** `payload.sendEmail` (console
  transport until a nodemailer adapter is added for prod) + Telegram Bot API
  (`fetch`, per-user `telegramChatId`). Missing creds → log only. Never throws
  into the triggering CRUD op.

## Triggers

| Event | Source | Recipient |
|---|---|---|
| New lead | `Leads` afterChange, `create` | lead `owner` if set, else all active admins |
| Lead assigned | `Leads` afterChange, `owner` changed → set | new owner (skip if self-assigned) |
| Deal stage changed | `Deals` afterChange, `update`, `stage` changed | deal `owner` (skip if they made the change) |
| Task assigned | `Activities` afterChange, `dueAt` set + `assignee` set/changed | assignee (skip if self) |
| Stale deal | cron | deal `owner` — deals not `won`/`lost`, untouched > `SLA_DAYS` (default 5) |
| Overdue task | cron | assignee — `dueAt < now`, `doneAt` null |
| Daily digest | cron | each active user — count of their open tasks + deals needing attention |

No dedup columns: cron runs once daily, one nudge per stale item per day is
acceptable at this scale.

## Files

**New:** `src/lib/notify.ts` (transport), `src/lib/notifications.ts`
(trigger logic + pure `selectStaleDeals` / `buildDigest`),
`src/app/api/cron/notify/route.ts`, `scripts/check-notifications.mjs`,
`src/migrations/20260828_100000_sp3_tasks.ts` (+ `index.ts`).

**Modify:** `src/collections/Activities.ts` (fields + assign hook),
`src/collections/Leads.ts` (new-lead + assign hook),
`src/collections/Deals.ts` (stage-change hook), `.env.example`
(`CRON_SECRET`, `TELEGRAM_BOT_TOKEN`, `SERVER_URL`, SMTP notes),
`src/payload.config.ts` if an email adapter is wired (deferred — console for now).

## Env

- `CRON_SECRET` — required for `/api/cron/notify`.
- `SERVER_URL` — base for admin links in messages (default `http://localhost:3000`).
- `TELEGRAM_BOT_TOKEN` — optional; without it Telegram sends are skipped.
- SMTP for real email — add `@payloadcms/email-nodemailer` in prod (documented, not installed).

## Verification

- `npm run build` clean; `tsc --noEmit` clean.
- `node scripts/check-notifications.mjs` — `selectStaleDeals` picks only
  non-closed deals past the cutoff; `buildDigest` groups per user.
- Manual (DB up, no creds): create a lead via the public form → server log shows
  a "would notify" line for admins. `curl` `/api/cron/notify` without the secret
  → 401; with it → 200 + JSON summary, log lines for any stale deals. Set a
  `telegramChatId` + `TELEGRAM_BOT_TOKEN` to see a real message (out of sandbox).
