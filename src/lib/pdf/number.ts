// Чистые расчёты для КП. Проверяются в scripts/check-kp.mjs.

export type Position = { label?: string | null; qty?: number | null; unitPrice?: number | null }

/** Номер КП: стабильный, уникальный по сделке и дате. КП не строгий бухдокумент,
 *  сквозная нумерация не требуется. */
export function kpNumber(dealId: number | string, date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `КП-${dealId}-${y}${m}${d}`
}

export function lineSum(p: Position): number {
  const qty = Number(p.qty ?? 1) || 0
  const price = Number(p.unitPrice ?? 0) || 0
  return Math.round(qty * price * 100) / 100
}

export type Totals = { subtotal: number; vat: number; total: number; vatNote: string }

/**
 * Если позиций нет — берём общую сумму сделки. `vatIncluded` означает, что цены
 * уже включают НДС 20% (выделяем его справочно), иначе — «без НДС».
 */
export function computeTotals(
  positions: Position[],
  amount: number | null | undefined,
  vatIncluded: boolean,
): Totals {
  const fromPositions = positions.reduce((s, p) => s + lineSum(p), 0)
  const total = positions.length ? Math.round(fromPositions * 100) / 100 : Number(amount ?? 0) || 0
  if (vatIncluded) {
    const vat = Math.round((total - total / 1.2) * 100) / 100
    return { subtotal: total, vat, total, vatNote: `В том числе НДС 20%: ${formatRub(vat)}` }
  }
  return { subtotal: total, vat: 0, total, vatNote: 'НДС не облагается' }
}

export function formatRub(n: number): string {
  return `${n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('ru-RU')
}
