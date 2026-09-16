// YandexGPT: эмбеддинги text-search-doc / text-search-query + чат yandexgpt-lite.
// Данные не покидают РФ. Авторизация — статический Api-Key.

const BASE = 'https://llm.api.cloud.yandex.net/foundationModels/v1'

type Msg = { role: 'system' | 'user' | 'assistant'; content: string }

function cfg() {
  const key = process.env.YANDEX_API_KEY
  const folder = process.env.YANDEX_FOLDER_ID
  if (!key || !folder) throw new Error('YANDEX_API_KEY / YANDEX_FOLDER_ID не заданы')
  return { key, folder, model: process.env.YANDEX_GPT_MODEL || 'yandexgpt-lite' }
}

async function post(path: string, body: unknown, key: string) {
  const res = await fetch(`${BASE}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Api-Key ${key}` },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    throw new Error(`Yandex ${path} ${res.status}: ${(await res.text()).slice(0, 300)}`)
  }
  return res.json()
}

export const YandexProvider = {
  name: 'yandex' as const,

  async embed(texts: string[], kind: 'doc' | 'query' = 'doc'): Promise<number[][]> {
    const { key, folder } = cfg()
    const modelUri = `emb://${folder}/text-search-${kind}/latest`
    // API принимает один text за вызов.
    const out: number[][] = []
    for (const text of texts) {
      const json = await post('textEmbedding', { modelUri, text }, key)
      out.push((json.embedding as number[]) ?? [])
    }
    return out
  },

  async chat(messages: Msg[], opts?: { temperature?: number; maxTokens?: number }): Promise<string> {
    const { key, folder, model } = cfg()
    const json = await post(
      'completion',
      {
        modelUri: `gpt://${folder}/${model}/latest`,
        completionOptions: {
          stream: false,
          temperature: opts?.temperature ?? 0.3,
          maxTokens: String(opts?.maxTokens ?? 800),
        },
        messages: messages.map((m) => ({ role: m.role, text: m.content })),
      },
      key,
    )
    return json?.result?.alternatives?.[0]?.message?.text ?? ''
  },
}
