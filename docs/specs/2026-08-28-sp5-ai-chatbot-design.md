# SP5 — AI chatbot (design)

_Date: 2026-08-28. Part of the [roadmap](./2026-08-28-back-office-and-ai-assistant-roadmap.md). Status: implemented and verified against the dev DB (mock provider)._

## Decisions

- **Provider: YandexGPT** (`yandexgpt-lite` + `text-search-doc`/`-query`
  embeddings). Static Api-Key auth, data stays in RU. A **mock provider** runs
  when `YANDEX_API_KEY` / `YANDEX_FOLDER_ID` are unset — bag-of-words embeddings +
  a canned reply, so the whole flow is testable offline.
- **KB: products only.** One chunk per product (all significant fields as text).
  ~11 chunks → **brute-force cosine in JS**, no `pgvector`.
- **Fallback: offer engineer + capture contact.** The model appends `[[LEAD]]`
  when it can't answer or the user asks price/КП; the widget then shows an inline
  name/phone/email + consent form → creates a `source: 'chatbot'` Lead → SP3
  notifications fire.

## Components

| Path | Role |
|---|---|
| `src/lib/ai/similarity.ts` | pure `cosine` / `rankChunks` (checked by `scripts/check-ai.mjs`) |
| `src/lib/ai/mock.ts` | offline provider — deterministic keyword embeddings + canned reply |
| `src/lib/ai/yandex.ts` | YandexGPT adapter (`textEmbedding`, `completion`) |
| `src/lib/ai/provider.ts` | `getProvider()` — Yandex if keys present, else mock |
| `src/lib/ai/kb.ts` | `productChunkText`, `reindexProducts` (full), `reindexOneProduct` (hook), `retrieve` (lazy-inits an empty index) |
| `src/collections/KbChunks.ts` | index storage (`source`/`refId`/`refSlug`/`text`/`embedding` jsonb); admin-read only, code-written |
| `src/collections/ChatSessions.ts` | transcripts (`messages` jsonb, `lead`, `consent`, timestamps); staff-read, admin-delete |
| `src/collections/Products.ts` | `afterChange` → `reindexOneProduct`; `afterDelete` → drop its chunk |
| `src/app/api/chat/route.ts` | rate-limited (20/5min), retrieves top-4, builds a grounded system prompt, calls the provider, persists the session, returns `{ reply, offerLead, sessionId, demo }` |
| `src/app/api/chat/lead/route.ts` | SP1 consent + validation; creates a chatbot Lead, links the session |
| `src/components/chat/ChatWidget.tsx` | floating launcher + panel + inline lead form; hidden on `/admin`; session id in `localStorage` |
| `src/app/layout.tsx` | renders `<ChatWidget/>` |
| migration `20260828_120000_sp5_chat` | `kb_chunks` + `chat_sessions` tables |

## Guardrails

System prompt: answer only from the retrieved product context, in Russian, no
invented specs; on a miss or a price/КП ask → offer an engineer + emit `[[LEAD]]`.
Message ≤ 2000 chars, history trimmed to 6 turns, chat endpoint rate-limited,
lead endpoint shares the `/api/leads` limiter. Transcripts store PII only after
the visitor submits contact (then `consent = true` + linked lead); SP1's
retention script covers cleanup.

## Verification (mock provider, dev DB)

- `npm run build` clean; `tsc --noEmit` clean; `node scripts/check-ai.mjs` OK
  (cosine identities, mock determinism, keyword retrieval).
- Live: `POST /api/chat` → `demo:true` reply citing a real product chunk;
  `kb_chunks` lazily populated (11 rows). Price question → `offerLead:true`.
  `POST /api/chat/lead` no consent → 400; with consent → 200, creates a
  `source:'chatbot'` lead, links `chat_sessions.lead`, SP3 notification logged.
  Widget launcher present on `/`, absent on `/admin`.

## To go live

1. Yandex Cloud: create a folder + service account with `ai.languageModels.user`,
   issue an **Api-Key**. Set `YANDEX_API_KEY`, `YANDEX_FOLDER_ID` (and optionally
   `YANDEX_GPT_MODEL`).
2. First chat request re-indexes automatically; or trigger a full rebuild by
   editing any product (fires `reindexOneProduct`) — for a clean full pass, add a
   one-off script calling `reindexProducts` if needed.
3. Real embeddings give semantic retrieval (mock is keyword-only, so ranking
   among near-identical product texts is weak until the key is set).
