# SP4 — document generation (design)

_Date: 2026-08-28. Part of the [roadmap](./2026-08-28-back-office-and-ai-assistant-roadmap.md). Status: implemented and verified against the dev DB._

## Scope (v1)

Generate a **КП (коммерческое предложение)** PDF from a Deal, on demand, from the
Payload admin. КП is not a strict RU accounting document, so no stored archive and
no sequential numbering in v1 — the number is derived (`КП-{dealId}-{YYYYMMDD}`).

**Deferred:** invoices / contracts, a `GeneratedDocuments` archive + sequential
counter, emailing the КП to the client, itemised discounts.

## Pieces

- **`@react-pdf/renderer`** (new dep) + bundled **PT Sans** TTFs
  (`src/lib/pdf/fonts/`, OFL) for Cyrillic. `next.config.mjs`:
  `serverExternalPackages: ['@react-pdf/renderer']` and
  `outputFileTracingIncludes` for the font files. Font paths are `process.cwd()`-
  based, not `new URL(import.meta.url)` (webpack tries to resolve the latter).
- **`src/lib/pdf/number.ts`** — pure: `kpNumber`, `lineSum`, `computeTotals`
  (VAT-in-price → extracts 20% for the reference line; otherwise "без НДС"),
  `formatRub`, `formatDate`. Checked by `scripts/check-kp.mjs`.
- **`src/lib/pdf/kp.tsx`** — `renderKpPdf({ deal, company, profile })` →
  `Buffer`. A4, seller/buyer blocks, positions table, totals, validity, signer.
- **`Deals`** fields added: `positions` (array: label / qty / unitPrice),
  `validUntil`, `vatIncluded` (default true), and a `ui` field `kpDocument`
  rendering `src/components/admin/KpLink.tsx` — a link to the route (importmap
  regenerated).
- **`CompanyProfile` global** (`src/globals/CompanyProfile.ts`) — seller
  requisites (legalName / ИНН / КПП / ОГРН / address / phone / email / bank /
  signer). Read: staff; update: admin. Placeholder defaults — **need real data**.
- **`GET /api/deals/[id]/kp`** — `payload.auth` (401 if no session);
  `findByID(..., { user, overrideAccess: false })` enforces the Deal's
  ownership access (404 otherwise); streams `application/pdf` inline.
- **Migration** `20260828_110000_sp4_kp` — `deals.valid_until` /
  `deals.vat_included`, `deals_positions` table, `company_profile` table.

## Verification

- `npm run build` clean; `tsc --noEmit` clean; `node scripts/check-kp.mjs` OK.
- Direct render of a fixture Deal → valid PDF; visual check confirmed correct
  Cyrillic, table math (12×4200 + 4×5600 + 16×350 = 78 400; НДС 20% = 13 066,67),
  КП number, validity date, signer block.
- End-to-end (Local API): created admin + company + deal with positions, logged
  in, `GET /api/deals/{id}/kp` with the `payload-token` cookie → **200
  application/pdf**. No cookie → **401**. Test data cleaned up.

## Notes / caveats

- КП link in the admin: open a saved Deal → "Сформировать КП (PDF) →".
- Fill `CompanyProfile` with real ООО «Форбса» requisites before sending КП to
  clients.
- No archive of what was sent — regenerating reflects the Deal's current state.
  Add `GeneratedDocuments` + a counter if an audit trail of sent КП is needed.
