import { MockProvider } from './mock'
import { YandexProvider } from './yandex'

export type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string }

export type AiProvider = {
  name: string
  embed: (texts: string[], kind?: 'doc' | 'query') => Promise<number[][]>
  chat: (messages: ChatMsg[], opts?: { temperature?: number; maxTokens?: number }) => Promise<string>
}

/** YandexGPT, если заданы ключи; иначе — мок (работает без внешних вызовов). */
export function getProvider(): AiProvider {
  if (process.env.YANDEX_API_KEY && process.env.YANDEX_FOLDER_ID) return YandexProvider
  return MockProvider
}

export const isMock = () => !(process.env.YANDEX_API_KEY && process.env.YANDEX_FOLDER_ID)
