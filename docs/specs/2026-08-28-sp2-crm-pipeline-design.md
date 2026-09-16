# SP2 — CRM pipeline (design)

_Date: 2026-08-28. Part of the [back-office roadmap](./2026-08-28-back-office-and-ai-assistant-roadmap.md). Status: approved; implemented._

> **Implementation deviation (lower risk):** `Leads.status` keeps its existing
> enum values (`new` / `progress` / `done` / `spam`) — only the admin labels
> changed (`progress` → "В работе", `done` → "В сделке", `spam` → "Отклонена /
> спам"). This removes the destructive enum migration and its data backfill
> entirely; all SP2 schema changes are now additive. `isSpam` + `rejectedReason`
> are replaced by a single `triageNote` text field.

## Context

The site has a single `Leads` collection (raw inbound from the site forms) with a
lightweight `status` field. There is no notion of a company, a sales opportunity,
an owner, or activity history. `Users` is bare (`auth: true`, no fields), so every
logged-in user sees every lead.

SP2 turns this into a small CRM the 1–5 sales staff run **from the Payload admin
panel**, designed so a future 1C sync is additive, not a rewrite.

## Goal / non-goals

**Goal:** Companies, Deals, Activities, an owner model, and role-based visibility —
enough to work inbound leads through a pipeline and keep a history.

**Non-goals (deferred):** one-click lead→deal conversion UI, kanban board, separate
Contacts collection, deal line-items with qty/price (comes with SP4), analytics,
real-time updates, the actual 1C sync (SP2 only adds the fields it needs).

## Approach

**Chosen: Leads + Deals split.** `Leads` stays the raw inbox with a short triage
lifecycle. A qualified lead is linked to a `Company` and a `Deal`; the `Deal`
carries the real pipeline. `Activities` attach to a lead or a deal.

Alternatives considered:
- _Everything on `Leads`_ (add stage/owner/amount, no Companies/Deals) — fastest,
  but no company-level history, "won/lost" mixed with "spam/new", awkward 1C
  mapping. Rejected: repeat-dealer manufacturer needs company-level tracking.
- _Full entity model now_ (Companies + Contacts + Leads + Deals + Activities +
  Tasks + line-items) — closest to 1C/Bitrix, overkill for ≤5 users pre-1C.
  Contacts fold into Company; line-items belong with SP4.

## Data model

All CRM collections get `admin.group: 'CRM'` so they cluster in the sidebar.
Every business entity carries the same **1C-readiness triple**:
`externalId` (text, unique, nullable, admin read-only), `source`
(select, e.g. `site` / `chatbot` / `manual` / `1c`), `syncedAt` (date, admin
read-only).

### `Users` — extend

| field | type | notes |
|---|---|---|
| `name` | text, required | |
| `role` | select `admin` \| `manager`, default `manager`, required | editable only by `admin` |
| `telegramChatId` | text | optional; consumed by SP3 |
| `active` | checkbox, default `true` | inactive users keep history but can't log in (enforce in SP1/auth) |

Access: `admin` creates/updates any user; a user may read/update self; only
`admin` may change `role`.

### `Companies` — new (`companies`, Компания / Компании)

`name` (text, required, `useAsTitle`), `inn` (text), `kind` (select:
dealer / architect / developer / installer / endCustomer), `city` (text),
`website` (text), `contactPerson` (text), `phone` (text), `email` (text),
`notes` (textarea), `owner` (relationship → users) + 1C triple.

### `Leads` — evolve (keep slug `leads`)

- **Keep:** name, company (free-text from the form), phone, email, city,
  clientType, businessType, volume, comment.
- **Change `status`** options → triage lifecycle:
  `new` (Новая) / `qualified` (Квалифицирована) / `converted` (В сделке) /
  `rejected` (Отклонена). Default `new`.
- **Add:** `isSpam` (checkbox, separate from status), `owner` (relationship →
  users, nullable = unassigned), `linkedCompany` (relationship → companies),
  `linkedDeal` (relationship → deals, admin read-only), `rejectedReason` (text,
  shown when `status = rejected`).
- **Add 1C triple** with `source` default `site`.
- **Hook:** `beforeChange` — when `linkedDeal` becomes set, flip `status` to
  `converted`. `beforeChange` on create — default `source` if absent.

### `Deals` — new (`deals`, Сделка / Сделки)

`title` (text, required, `useAsTitle`), `company` (relationship → companies,
required), `owner` (relationship → users, required, defaults to current user),
`stage` (select: `proposal` КП отправлено / `negotiation` Переговоры / `won`
Выиграна / `lost` Проиграна, default `proposal`), `amount` (number, ₽),
`products` (relationship → products, hasMany), `expectedCloseAt` (date),
`lostReason` (text, shown when `stage = lost`), `sourceLead` (relationship →
leads, admin read-only), `notes` (textarea) + 1C triple.

List columns: `title, company, stage, amount, owner, expectedCloseAt`.

### `Activities` — new (`activities`, Активность / Активности)

`kind` (select: call / email / meeting / note), `subject` (text, required),
`body` (textarea), `deal` (relationship → deals), `lead` (relationship → leads),
`author` (relationship → users, default current user, admin read-only),
`dueAt` (date, optional), `doneAt` (date, optional — null = planned/open).

`beforeValidate` hook: require at least one of `deal` / `lead`.

_SP3 may merge Tasks into this (a Task = Activity with `dueAt`, no `doneAt`).
SP3's spec decides._

## Access control (RBAC)

`src/lib/access.ts` — pure helpers, unit-checked like `src/lib/recommend.ts`:
`isAdmin(user)`, `isStaff(user)`, and `where`-builders.

| collection | read / update | create | delete |
|---|---|---|---|
| Leads | admin → all; manager → `owner == me OR owner not set` | anyone (public form) | admin |
| Companies | admin → all; manager → `owner == me OR owner not set` | staff | admin |
| Deals | admin → all; manager → `owner == me` | staff | admin |
| Activities | admin → all; manager → `author == me OR deal.owner == me` | staff | admin |

Field-level: `Users.role` update guarded by `isAdmin`. 1C fields
(`externalId`, `syncedAt`) are `admin.readOnly` in the UI (writable only by the
future sync via the local API).

## Lead → Deal conversion (v1 = manual)

1. Manager reviews a `new` lead, sets `status = qualified`.
2. Creates or picks a `Company`; sets `Leads.linkedCompany`.
3. Creates a `Deal` (company prefilled), sets `Leads.linkedDeal` → hook flips
   `status` to `converted` and copies `sourceLead` onto the deal.

A one-click "Конвертировать" admin action is a fast-follow, not v1.

## 1C-readiness (fields only, no sync)

Every entity has `externalId` / `source` / `syncedAt`. Enum values and the
Company/Deal split mirror 1C's Контрагенты / Сделки so a later exchange maps
1:1. No sync code, no scheduled job in SP2.

## Migration / rollout

- Production must move off `postgresAdapter({ push: true })` to Payload
  migrations (flag for SP1). For SP2: `payload migrate:create` for the new
  collections **and** the `Leads.status` enum change.
- The `status` enum change needs a data migration for existing rows:
  `progress → qualified`, `done → converted`, `spam → rejected` + `isSpam = true`,
  `new → new`.
- New fields on `Leads` are all nullable/defaulted — no backfill needed beyond
  the above.
- Run `payload generate:types` after; `payload-types.ts` is committed.

## Verification

- `npm run build` compiles (DB up); `tsc --noEmit` clean; `payload generate:types`
  produces no diff-after-commit surprises.
- `node scripts/check-access.mjs` — asserts on the `where`-builders (admin sees
  all; manager query scoped to owner/unassigned; delete refused for manager).
- Manual, DB up: seed one `admin` + two `manager` users. As manager A: create
  Company + Deal + Activity; confirm manager B cannot see them; admin sees both.
  Submit the public lead form → Lead lands `source: site`, `status: new`,
  unassigned. Assign owner, link a Deal → `status` auto-flips to `converted`,
  `sourceLead` set on the deal. Set Deal `stage = lost` → `lostReason` appears.

## Files

**Modify:** `src/collections/Users.ts`, `src/collections/Leads.ts`,
`src/payload.config.ts` (register new collections), `src/app/api/leads/route.ts`
(set `source: 'site'`, `status: 'new'` explicitly).

**New:** `src/collections/Companies.ts`, `src/collections/Deals.ts`,
`src/collections/Activities.ts`, `src/lib/access.ts`, `scripts/check-access.mjs`,
`src/migrations/<generated>_crm_pipeline.ts`.

**Reuse:** existing collection-config patterns, the `getPayload` route pattern,
the `scripts/check-*.mjs` self-check pattern, `payload-types.ts` generation.

## Open questions (confirm or correct; otherwise implemented as written)

1. Deal stages — `proposal / negotiation / won / lost` enough, or is there an
   earlier "qualification" stage on the Deal (vs. on the Lead)?
2. `Deal.amount` — with or without VAT? (matters for SP4 doc-gen.)
3. Company visibility — managers see own + unassigned (assumed), or a shared
   company book everyone can read?
