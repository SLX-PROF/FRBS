// Подбор модели порога по ширине двери и типу монтажа.
// Чистая функция без зависимостей — принимает простые объекты товаров,
// поэтому проверяется в scripts/check-recommend.mjs без сборки.

export type Mount = 'врезной' | 'накладной' | 'unknown'

export type RecoProduct = {
  id: number
  slug: string
  title: string
  type: 'врезной' | 'накладной'
  series?: string | null
  minDoorWidth?: number | null
  features?: string | null
  sortOrder?: number | null
}

export type Reco = {
  primary: RecoProduct | null
  alternates: RecoProduct[]
}

export function recommendModels(
  products: RecoProduct[],
  { doorWidth, mount }: { doorWidth: number; mount: Mount },
): Reco {
  const fit = products
    .filter((p) => p.minDoorWidth == null || p.minDoorWidth <= doorWidth)
    .filter((p) => mount === 'unknown' || p.type === mount)
    .sort((a, b) => {
      // Меньший запас по минимальной ширине = точнее попадание под дверь.
      const slackA = a.minDoorWidth == null ? Infinity : doorWidth - a.minDoorWidth
      const slackB = b.minDoorWidth == null ? Infinity : doorWidth - b.minDoorWidth
      if (slackA !== slackB) return slackA - slackB
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    })

  return { primary: fit[0] ?? null, alternates: fit.slice(1, 4) }
}

// Пороги производятся с шагом 200 мм и укорачиваются на объекте до 220 мм.
// Возвращаем ближайшую производимую длину не меньше ширины двери и подрез.
export function producibleLength(doorWidth: number): { nominal: number; trim: number } {
  const nominal = Math.ceil(doorWidth / 200) * 200
  return { nominal, trim: nominal - doorWidth }
}
