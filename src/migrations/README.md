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

## `20260917_140000_products_images_gallery`

`Products.images` changed from a single upload relation to a gallery
(`hasMany: true`). Payload moves hasMany relations into a `<collection>_rels`
join table (same shape as `deals_rels` from sp1/sp2) — creates `products_rels`,
copies any existing `products.images_id` value into it as the first image,
then drops the old `images_id` column/FK/index. `down()` reverses this
(rebuilds `images_id` from the first `path = 'images'` row, drops
`products_rels`).

**`scripts/bootstrap-schema.sql` is now stale** — it's a `pg_dump` snapshot
predating this migration and still has the old `products.images_id` column.
It only matters for bootstrapping a brand-new prod DB from scratch (see repo
root README/CLAUDE notes); an already-running prod DB should apply this
migration via `npx payload migrate` instead. Regenerate the snapshot from a
dev DB that has this migration applied before bootstrapping a new environment.

## `20260917_150000_users_role_owner_tier`

`users.role` went from two tiers (`admin` = full access, `manager` = scoped
CRM access) to three: `owner` (full access, renamed from the old `admin`),
`admin` (new, narrow — only Товары/Медиа, see `src/lib/access.ts`), `manager`
(unchanged). Enum values can't be renamed in place safely, so this recreates
`enum_users_role` (rename old → create new with all 3 values → cast the
column through `CASE ... WHEN 'admin' THEN 'owner'` → drop the old type).
Every existing `role = 'admin'` row becomes `'owner'`, so nobody's access is
silently downgraded — the new `'admin'` value starts unused, free to assign
to whoever should be restricted to managing products. Idempotent (checks
whether `'owner'` is already a valid enum label before touching anything).
`scripts/bootstrap-schema.sql` is stale for this too (same caveat as above —
it predates this migration and only matters for a from-scratch bootstrap).

## `20260924_120000_media_image_sizes`

`Media` got `imageSizes` (`card` 640px, `large` 1600px, WebP). Payload stores each
size in `media.sizes_<name>_{url,width,height,mime_type,filesize,filename}` —
the migration adds those 12 columns plus a filename index per size. **Apply
`scripts/manual-migrate-media-image-sizes.sql` on prod BEFORE rebuilding the
container** — new code selects these columns on every media query. Idempotent.
Existing files get their WebP versions via
`POST /api/cron/regenerate-media` (header `x-cron-key: $CRON_SECRET`), which
writes `<name>-card.webp` / `<name>-large.webp` next to the originals and fills
`sizes.*`; safe to re-run (skips media that already have sizes).
