// Доставка уведомлений: e-mail через payload.sendEmail (без адаптера Payload
// пишет письмо в консоль) + Telegram Bot API. Обе ветки best-effort и никогда
// не бросают исключение в вызывающую операцию.

type Recipient = {
  email?: string | null
  telegramChatId?: string | null
  name?: string | null
}

type PayloadLike = {
  sendEmail: (opts: { to: string; subject: string; text: string }) => Promise<unknown>
  logger: { info: (o: unknown) => void; error: (o: unknown) => void }
}

export async function notify(payload: PayloadLike, to: Recipient, subject: string, text: string): Promise<void> {
  if (to.email) {
    try {
      await payload.sendEmail({ to: to.email, subject, text })
    } catch (err) {
      payload.logger.error({ msg: 'notify: email failed', to: to.email, err })
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  if (to.telegramChatId && token) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: to.telegramChatId,
          text: `${subject}\n\n${text}`,
          disable_web_page_preview: true,
        }),
      })
      if (!res.ok) {
        payload.logger.error({ msg: 'notify: telegram non-2xx', status: res.status, body: await res.text() })
      }
    } catch (err) {
      payload.logger.error({ msg: 'notify: telegram failed', err })
    }
  } else if (to.telegramChatId) {
    payload.logger.info({ msg: 'notify: telegram skipped (no TELEGRAM_BOT_TOKEN)', subject })
  }

  if (!to.email && !to.telegramChatId) {
    payload.logger.info({ msg: 'notify: recipient has no channel', recipient: to.name ?? '(unknown)', subject })
  }
}

export function serverURL(): string {
  return process.env.SERVER_URL || 'http://localhost:3000'
}

export function adminLink(slug: string, id: string | number): string {
  return `${serverURL()}/admin/collections/${slug}/${id}`
}
