import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { rateLimit, clientKey } from '@/lib/rateLimit'
import { getProvider, isMock, type ChatMsg } from '@/lib/ai/provider'
import { retrieve } from '@/lib/ai/kb'

export const dynamic = 'force-dynamic'

const MAX_MESSAGE = 2000
const HISTORY_TURNS = 6
const MAX_SESSION_MESSAGES = 60

const FACTS = `Автоматический порог FORBSA — опускающийся уплотнитель, который перекрывает зазор под дверью без порога на полу. Питание и электричество не нужны.
Устройство: алюминиевый П-образный корпус (врезной или накладной), резиновая или силиконовая уплотнительная планка, пружинно-рычажный механизм, торцевая кнопка-штифт (у моделей FORBSA ALUMA — нажимная кнопка из нержавеющей стали AISI 304).
Принцип работы: при открытой двери пружина удерживает планку внутри корпуса. При закрытии двери кнопка упирается в дверную коробку со стороны петель и вдавливается, механизм опускает планку вниз параллельно полу, резина прижимается к покрытию и перекрывает зазор. При открытии двери кнопка освобождается, пружина возвращает планку в корпус.
Регулировка: величина опускания (до 18 мм) настраивается шестигранным ключом в торце корпуса.
Назначение: защита от шума, запахов, света, пыли и дыма; применяется на противопожарных, медицинских и офисных дверях.
Ресурс механизма — 1 000 000 циклов, есть сертификат РОСТЕСТ. Производство в России, изготовление от 1 рабочего дня.
Контакты: +7 (495) 798-52-25 (пн–пт, 9:00–18:00 МСК), sales@forbsa.ru.`

const SYSTEM = (context: string) =>
  `Ты — консультант FORBSA, российского производителя автоматических дверных порогов. Общаешься с проектировщиками, монтажниками и закупщиками.

Стиль: деловой, по существу. Отвечай на русском, 2–4 предложения, без восклицаний, эмодзи, оценочных эпитетов и рекламных оборотов. Называй конкретные параметры (размеры, ресурс, материалы), если они есть в данных. Пиши обычным текстом без markdown.

Источники: используй ТОЛЬКО блоки ФАКТЫ и КОНТЕКСТ. Не придумывай характеристики, размеры, цены, сроки, сертификаты и совместимость. Если точного ответа в данных нет, скажи об этом одной фразой и предложи связать с инженером.

Цены не называй, сроки поставки конкретного заказа не обещай, коммерческие предложения не составляй — для этого предложи связать с инженером. Конкурентов не называй и не сравнивай.

Когда нужен инженер (цена, наличие, срок заказа, КП, нестандартная дверь, вопрос без ответа в данных), в самом конце ответа добавь маркер [[LEAD]] на отдельной строке. В остальных случаях маркер не добавляй.

ФАКТЫ:
${FACTS}

КОНТЕКСТ (модели из каталога):
${context || '(нет подходящих фрагментов каталога)'}`

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'chat'), { limit: 20, windowMs: 5 * 60_000 })
  if (!limit.ok) {
    return NextResponse.json({ error: 'Слишком много сообщений, попробуйте позже.' }, { status: 429 })
  }

  let body: { message?: unknown; token?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message || message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: 'Введите вопрос (до 2000 символов)' }, { status: 400 })
  }
  const token =
    typeof body.token === 'string' && /^[a-f0-9-]{10,64}$/i.test(body.token) ? body.token : null

  try {
    const payload = await getPayload({ config })

    // История берётся ТОЛЬКО из сохранённой сессии по непредсказуемому токену —
    // клиенту не доверяем (иначе можно подделать реплики ассистента).
    let session: { id: number | string; messages?: unknown } | null = null
    if (token) {
      session =
        (await payload.find({ collection: 'chat-sessions', where: { token: { equals: token } }, limit: 1, depth: 0 })).docs[0] ??
        null
    }
    const stored: { role: string; content: string }[] = Array.isArray(session?.messages)
      ? (session!.messages as any[]).filter((m) => m && typeof m.content === 'string')
      : []
    const history: ChatMsg[] = stored
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-HISTORY_TURNS)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: String(m.content).slice(0, MAX_MESSAGE) }))

    const hits = await retrieve(payload, message, 4)
    const context = hits.map((h, i) => `${i + 1}. ${h.text}`).join('\n')

    const provider = getProvider()
    const raw = await provider.chat(
      [{ role: 'system', content: SYSTEM(context) }, ...history, { role: 'user', content: message }],
      { maxTokens: 700 },
    )
    const wantsLead = raw.includes('[[LEAD]]')
    const reply = raw.replace(/\[\[LEAD\]\]/g, '').trim()

    const now = new Date().toISOString()
    const turn = [
      { role: 'user', content: message, at: now },
      { role: 'assistant', content: reply, at: now },
    ]

    let outToken = token
    try {
      if (session) {
        const merged = [...stored, ...turn].slice(-MAX_SESSION_MESSAGES)
        await payload.update({
          collection: 'chat-sessions',
          id: session.id,
          overrideAccess: true,
          data: { messages: merged, lastAt: now },
        })
      } else {
        outToken = crypto.randomUUID()
        await payload.create({
          collection: 'chat-sessions',
          overrideAccess: true,
          data: { token: outToken, messages: turn, startedAt: now, lastAt: now, consent: false },
        })
      }
    } catch (err) {
      console.error('chat session persist failed:', err instanceof Error ? err.message : 'error')
    }

    return NextResponse.json({ reply, offerLead: wantsLead, token: outToken, demo: isMock() })
  } catch (err) {
    console.error('chat failed:', err instanceof Error ? err.message : 'error')
    return NextResponse.json({ error: 'Не удалось получить ответ. Попробуйте позже.' }, { status: 500 })
  }
}
