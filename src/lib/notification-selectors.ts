// Чистые селекторы для уведомлений — без зависимостей, проверяются в
// scripts/check-notifications.mjs.

/** Реляционные поля в хук-`doc` бывают и id, и populated-объектом. */
export const relId = (v: unknown): number | null => {
  if (v == null) return null
  if (typeof v === 'object') return (v as { id?: number }).id ?? null
  return typeof v === 'number' ? v : Number(v) || null
}

export type StaleDealInput = {
  id: number
  stage: string
  updatedAt: string
  owner?: number | null
  title: string
}

export function selectStaleDeals(
  deals: StaleDealInput[],
  { now, slaDays }: { now: Date; slaDays: number },
): StaleDealInput[] {
  const cutoff = now.getTime() - slaDays * 86_400_000
  return deals.filter(
    (d) => d.stage !== 'won' && d.stage !== 'lost' && new Date(d.updatedAt).getTime() < cutoff,
  )
}

export type DigestRow = { userId: number; openTasks: number; staleDeals: number }

export function buildDigest(
  users: { id: number }[],
  openTasks: { assignee?: number | null }[],
  staleDeals: { owner?: number | null }[],
): DigestRow[] {
  return users
    .map((u) => ({
      userId: u.id,
      openTasks: openTasks.filter((t) => t.assignee === u.id).length,
      staleDeals: staleDeals.filter((d) => d.owner === u.id).length,
    }))
    .filter((r) => r.openTasks > 0 || r.staleDeals > 0)
}
