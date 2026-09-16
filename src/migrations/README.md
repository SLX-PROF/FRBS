# Migrations

The DB was originally built with `postgresAdapter({ push: true })` (dev auto-sync),
so `payload_migrations` only had the synthetic `dev` row. Migrations start from
`20260828_093500_sp1_sp2_crm`.

## `20260828_093500_sp1_sp2_crm`

SP1 (152-ФЗ baseline) + SP2 (CRM pipeline). Written as an **idempotent delta**
(`IF NOT EXISTS` / `EXCEPTION WHEN duplicate_object`) because it runs against a
DB that already had the base tables. Adds:

- new enums + tables: `companies`, `deals`, `deals_rels`, `activities`, `audit_log`
- new columns on `users` (`name`, `role`, `telegram_chat_id`, `active`) and `leads`
  (consent trio, CRM links, 1C sync trio), and `phone` made nullable
- FK columns on `payload_locked_documents_rels`

Already applied and recorded on the dev DB (`npx payload migrate:status` → Ran: Yes).

## `20260828_100000_sp3_tasks`

SP3 — adds `assignee_id` + `priority` (enum) to `activities`. Idempotent delta,
applied and recorded the same way.

## `20260828_110000_sp4_kp`

SP4 — `deals.valid_until` + `deals.vat_included`, the `deals_positions` array
table, and the `company_profile` global table. Idempotent delta, applied and
recorded the same way.

## Applying elsewhere

```bash
npx payload migrate         # normal path
npx payload migrate:status   # verify
```

**Known issue in the current sandbox:** `npx payload migrate` and dev `push` hang
on adapter init (likely a TTY prompt with `push: true` still set). Workaround used
here — run the migration's `up()` SQL directly and record it:

```bash
node --env-file=.env -e "/* execute up() sql, then INSERT INTO payload_migrations */"
```

## Production

Set `push: false` in `payload.config.ts` for production and rely solely on
`npx payload migrate` in the deploy step (flagged in the SP1 spec).
Run `npx payload generate:types` after any schema change and commit
`src/payload-types.ts`.

## `20260828_120000_sp5_chat`

SP5 — `kb_chunks` (bot knowledge index) + `chat_sessions` tables, plus their
`payload_locked_documents_rels` FK columns. Idempotent delta.

## `20260828_130000_sp5_chat_token`

SP5 hardening — `chat_sessions.token` (unguessable session handle) + unique index.
