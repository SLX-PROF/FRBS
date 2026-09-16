import { notify, adminLink, serverURL } from './notify'
import { selectStaleDeals, buildDigest, relId } from './notification-selectors'

export { selectStaleDeals, buildDigest, relId }
export type { StaleDealInput, DigestRow } from './notification-selectors'

type PayloadLike = {
  sendEmail: (o: { to: string; subject: string; text: string }) => Promise<unknown>
  logger: { info: (o: unknown) => void; error: (o: unknown) => void }
  find: (o: unknown) => Promise<{ docs: any[] }>
  findByID: (o: unknown) => Promise<any>
}

async function resolveUser(payload: PayloadLike, id: number | null) {
  if (!id) return null
  try {
    return await payload.findByID({ collection: 'users', id, depth: 0 })
  } catch {
    return null
  }
}

// ---- instant triggers (из хуков коллекций) ----

export async function notifyNewLead(payload: PayloadLike, lead: any): Promise<void> {
  const text =
    `Имя: ${lead.name}\n` +
    `Телефон: ${lead.phone || '—'}\n` +
    `Email: ${lead.email || '—'}\n` +
    `Комментарий: ${lead.comment || '—'}\n\n` +
    adminLink('leads', lead.id)

  const ownerId = relId(lead.owner)
  if (ownerId) {
    const u = await resolveUser(payload, ownerId)
    if (u) return notify(payload, u, 'Новая заявка', text)
  }
  const { docs } = await payload.find({
    collection: 'users',
    where: { and: [{ role: { equals: 'admin' } }, { active: { equals: true } }] },
    limit: 20,
    depth: 0,
  })
  await Promise.all(docs.map((u) => notify(payload, u, 'Новая заявка (не назначена)', text)))
}

export async function notifyLeadAssigned(payload: PayloadLike, lead: any, actingUserId?: number): Promise<void> {
  const ownerId = relId(lead.owner)
  if (!ownerId || ownerId === actingUserId) return
  const u = await resolveUser(payload, ownerId)
  if (u) {
    await notify(
      payload,
      u,
      'Вам назначена заявка',
      `${lead.name} — ${lead.phone || lead.email || ''}\n\n${adminLink('leads', lead.id)}`,
    )
  }
}

export async function notifyStageChange(payload: PayloadLike, deal: any, actingUserId?: number): Promise<void> {
  const ownerId = relId(deal.owner)
  if (!ownerId || ownerId === actingUserId) return
  const u = await resolveUser(payload, ownerId)
  if (u) {
    await notify(
      payload,
      u,
      `Сделка: этап «${deal.stage}»`,
      `${deal.title}\n\n${adminLink('deals', deal.id)}`,
    )
  }
}

export async function notifyTaskAssigned(payload: PayloadLike, activity: any, actingUserId?: number): Promise<void> {
  const assigneeId = relId(activity.assignee)
  if (!assigneeId || assigneeId === actingUserId) return
  const u = await resolveUser(payload, assigneeId)
  if (u) {
    const due = activity.dueAt ? ` (до ${String(activity.dueAt).slice(0, 10)})` : ''
    await notify(
      payload,
      u,
      'Вам назначена задача',
      `${activity.subject}${due}\n\n${adminLink('activities', activity.id)}`,
    )
  }
}

// ---- scheduled (из /api/cron/notify) ----

export async function runScheduledNotifications(
  payload: PayloadLike,
  { now = new Date(), slaDays = Number(process.env.SLA_DAYS || 5) }: { now?: Date; slaDays?: number } = {},
): Promise<{ staleDeals: number; overdueTasks: number; digests: number }> {
  const dealsRes = await payload.find({ collection: 'deals', limit: 500, depth: 0 })
  const stale = selectStaleDeals(
    dealsRes.docs.map((d) => ({
      id: d.id,
      stage: d.stage,
      updatedAt: d.updatedAt,
      owner: relId(d.owner) ?? undefined,
      title: d.title,
    })),
    { now, slaDays },
  )
  for (const d of stale) {
    const u = await resolveUser(payload, d.owner ?? null)
    if (u) {
      await notify(
        payload,
        u,
        'Сделка без движения',
        `${d.title} — этап «${d.stage}», без изменений более ${slaDays} дн.\n\n${adminLink('deals', d.id)}`,
      )
    }
  }

  const tasksRes = await payload.find({
    collection: 'activities',
    where: { and: [{ dueAt: { less_than: now.toISOString() } }, { doneAt: { exists: false } }] },
    limit: 500,
    depth: 0,
  })
  const overdue = tasksRes.docs.map((t) => ({
    id: t.id,
    subject: t.subject,
    assignee: relId(t.assignee),
    dueAt: t.dueAt,
  }))
  for (const t of overdue) {
    const u = await resolveUser(payload, t.assignee)
    if (u) {
      await notify(
        payload,
        u,
        'Просроченная задача',
        `${t.subject} — срок ${String(t.dueAt).slice(0, 10)}\n\n${adminLink('activities', t.id)}`,
      )
    }
  }

  const usersRes = await payload.find({ collection: 'users', where: { active: { equals: true } }, limit: 50, depth: 0 })
  const openTasksRes = await payload.find({
    collection: 'activities',
    where: { and: [{ dueAt: { exists: true } }, { doneAt: { exists: false } }] },
    limit: 1000,
    depth: 0,
  })
  const digest = buildDigest(
    usersRes.docs.map((u) => ({ id: u.id })),
    openTasksRes.docs.map((t) => ({ assignee: relId(t.assignee) ?? undefined })),
    stale.map((d) => ({ owner: d.owner })),
  )
  for (const row of digest) {
    const u = usersRes.docs.find((x) => x.id === row.userId)
    if (u) {
      await notify(
        payload,
        u,
        'Сводка на сегодня',
        `Открытых задач: ${row.openTasks}\nСделок требуют внимания: ${row.staleDeals}\n\n${serverURL()}/admin`,
      )
    }
  }

  return { staleDeals: stale.length, overdueTasks: overdue.length, digests: digest.length }
}
