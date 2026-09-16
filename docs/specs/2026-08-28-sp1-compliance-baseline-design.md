# SP1 — 152-ФЗ compliance baseline (design)

_Date: 2026-08-28. Part of the [roadmap](./2026-08-28-back-office-and-ai-assistant-roadmap.md). Status: implemented and verified against the dev DB._

> **Deviations:** `Leads.phone` is now optional (was `required`) so the lead-magnet
> form can capture email-only — the API requires name + (phone **or** valid email).
> Schema shipped as migration `20260828_093500_sp1_sp2_crm` (idempotent delta;
> `npx payload migrate` / dev `push` hang in the sandbox, so it was applied via
> direct SQL and recorded — see `src/migrations/README.md`).

## Context

The public forms (`LeadForm`, `DealerForm`) show a consent checkbox but **never
send it** — the API neither checks nor stores consent, there is no timestamp or
policy version, no `/privacy` page, no audit trail on CRM records, and no rate
limiting on public endpoints. `LeadMagnetForm` is a stub that posts nowhere.

SP1 is the thin, cross-cutting baseline that must land before the CRM (SP2) or the
chatbot (SP5) handle real personal data of RU citizens.

## Scope

1. **Consent record** — real, stored, versioned.
2. **Privacy policy page** — `/privacy`, 152-ФЗ structure (needs legal review).
3. **Audit log** — who changed which CRM record, when, which fields.
4. **Rate limiting** — public endpoints (`/api/leads`, `/api/search`).
5. **Retention script** — purge abandoned leads past a cutoff (cron'd later in SP3).

**Out of scope:** RU hosting sign-off (ops), legal review of the policy text,
scheduled jobs (SP3 brings the runner), a custom "anonymize" admin action
(documented manual process for now), consent for authenticated staff.

## 1. Consent

- `src/lib/consent.ts` → `PRIVACY_POLICY_VERSION = '2026-08-28'`.
- `Leads`: add `consent` (checkbox), `consentAt` (date, `admin.readOnly`),
  `policyVersion` (text, `admin.readOnly`).
- `POST /api/leads`: reject when `consent !== true` (400,
  "Требуется согласие на обработку персональных данных"); stamp
  `consentAt = now`, `policyVersion = PRIVACY_POLICY_VERSION`.
- `LeadForm`, `DealerForm`: include `consent` in the POST body; checkbox label
  links to `/privacy`.
- `LeadMagnetForm`: add the consent checkbox and actually POST to `/api/leads`
  (`clientType: 'architect'`, comment "Запросил альбом типовых решений",
  `source: 'site'`).

## 2. Privacy policy page

`src/app/privacy/page.tsx` — «Политика обработки персональных данных» +
«Согласие на обработку»: operator identity, purposes, legal basis, data
categories, third parties, storage period, subject rights, contacts. Operator
requisites are placeholders with a visible "требует проверки юристом" banner.
Linked from `Footer.tsx`.

## 3. Audit log

- `src/collections/AuditLog.ts` — `action` (create/update/delete),
  `collectionSlug`, `documentId`, `user` (rel → users, nullable),
  `changedFields` (json), `at` (date). Read: admin only. Create/update/delete:
  denied to everyone (written only via the hook with `overrideAccess`).
  `admin.group: 'Система'`, every field `readOnly`.
- `src/lib/audit.ts` → `withAudit(config)` appends `afterChange` + `afterDelete`
  hooks that record an entry (shallow diff of `previousDoc` vs `doc`). Guarded by
  `context.disableAudit`. Applied to Leads, Companies, Deals, Activities in
  `payload.config.ts`.

## 4. Rate limiting

- `src/lib/rateLimit.ts` — in-memory sliding window, `rateLimit(key, {limit,
  windowMs}) → {ok, retryAfter}`. _ponytail: per-instance Map; swap for Redis when
  running more than one replica._
- Key = `x-forwarded-for` first hop (nginx per README), else `'local'`.
- `/api/leads`: 5 per 10 min. `/api/search`: 30 per min. Over limit → 429
  "Слишком много запросов, попробуйте позже".

## 5. Retention

`scripts/purge-personal-data.mjs` — lists (default) or, with `--apply`, deletes
`leads` older than `RETENTION_YEARS` (default 3) that are `status: 'new'` and have
no `linkedDeal`. Documented for cron; SP3 wires it to the job runner.

## Verification

- `npm run build` clean; `tsc --noEmit` clean.
- `node scripts/check-ratelimit.mjs` — window allows N then blocks, resets after
  `windowMs`.
- Manual (DB up): submit `LeadForm` with the box unchecked → blocked client-side;
  bypass client → API 400. Submit checked → Lead has `consent: true`, `consentAt`,
  `policyVersion`. Edit a Deal in `/admin` → an `audit-log` row appears with the
  changed field names; as a manager, `/admin/collections/audit-log` is hidden.
  Hammer `/api/leads` → 429 after 5. `/privacy` renders and is linked in the
  footer. `node scripts/purge-personal-data.mjs` lists candidates without
  deleting.

## Files

**New:** `src/lib/consent.ts`, `src/lib/audit.ts`, `src/lib/rateLimit.ts`,
`src/collections/AuditLog.ts`, `src/app/privacy/page.tsx`,
`scripts/purge-personal-data.mjs`, `scripts/check-ratelimit.mjs`.

**Modify:** `src/collections/Leads.ts`, `src/payload.config.ts`,
`src/app/api/leads/route.ts`, `src/app/api/search/route.ts`,
`src/components/LeadForm.tsx`, `src/components/DealerForm.tsx`,
`src/components/LeadMagnetForm.tsx`, `src/components/Footer.tsx`.
