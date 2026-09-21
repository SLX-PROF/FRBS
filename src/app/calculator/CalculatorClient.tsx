'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import ProfileGlyph from '@/components/ui/ProfileGlyph'
import { recommendModels, producibleLength, type Mount, type RecoProduct } from '@/lib/recommend'

const mountOptions: { key: Mount; label: string }[] = [
  { key: 'врезной', label: 'Врезной' },
  { key: 'накладной', label: 'Накладной' },
  { key: 'unknown', label: 'Не знаю' },
]

type TaskKey = 'residential' | 'acoustic' | 'fire' | 'industrial'

const tasks: { key: TaskKey; label: string; note: string }[] = [
  {
    key: 'residential',
    label: 'Жилое',
    note: 'Базовая герметизация от сквозняка, шума и пыли — подойдёт любая модель под ширину двери.',
  },
  {
    key: 'acoustic',
    label: 'Акустика',
    note: 'Для студий и переговорных берите модель с максимальным прижимом и проверьте акустический профиль полотна.',
  },
  {
    key: 'fire',
    label: 'Противопожарная',
    note: 'Для дверей EI нужен порог в противопожарном исполнении — подтвердите маркировку у инженера.',
  },
  {
    key: 'industrial',
    label: 'Промышленное',
    note: 'Высокая интенсивность открываний — важен ресурс 1 000 000 циклов и нержавеющая сталь A2.',
  },
]

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { key: string; label: string }[]
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o.key ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function ModelCard({ p, primary = false }: { p: RecoProduct; primary?: boolean }) {
  return (
    <Link
      href={`/catalog/${p.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 ${
        primary
          ? 'border-accent/30 bg-gradient-to-br from-white to-accent-light/60'
          : 'border-line bg-white hover:border-accent/30'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface transition-transform duration-500 group-hover:scale-105">
        {typeof p.images?.[0] === 'object' && p.images[0]?.url ? (
          <img
            src={p.images[0].url}
            alt={p.images[0].alt || p.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <ProfileGlyph variant={((p.id ?? 0) % 3) as 0 | 1 | 2} />
        )}
        {p.series && (
          <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white">
            {p.series}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold transition-colors group-hover:text-accent">{p.title}</h3>
        {p.minDoorWidth != null && (
          <div className="mt-2 text-sm text-ink-muted">
            Мин. ширина двери: <span className="font-mono font-semibold text-ink">{p.minDoorWidth} мм</span>
          </div>
        )}
        {p.features && <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink-muted">{p.features}</p>}
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
          Открыть карточку →
        </div>
      </div>
    </Link>
  )
}

export default function CalculatorClient({ products }: { products: RecoProduct[] }) {
  const [width, setWidth] = useState(900)
  const [mount, setMount] = useState<Mount>('unknown')
  const [task, setTask] = useState<TaskKey>('residential')

  const reco = useMemo(() => recommendModels(products, { doorWidth: width, mount }), [products, width, mount])
  const len = useMemo(() => producibleLength(width), [width])
  const taskNote = tasks.find((t) => t.key === task)!.note

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
      {/* ПАРАМЕТРЫ */}
      <div className="h-fit rounded-panel border border-line bg-white p-6 lg:sticky lg:top-24">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Параметры двери</div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label htmlFor="doorWidth" className="text-sm font-medium">
              Ширина полотна
            </label>
            <div className="flex items-center gap-1">
              <input
                id="doorWidth"
                type="number"
                min={200}
                max={1400}
                value={width}
                onChange={(e) => setWidth(Math.max(200, Math.min(1400, Number(e.target.value) || 0)))}
                className="w-20 rounded-field border border-line px-2 py-1.5 text-right font-mono text-sm focus:border-accent focus:outline-none"
              />
              <span className="text-sm text-ink-muted">мм</span>
            </div>
          </div>
          <input
            type="range"
            min={200}
            max={1400}
            step={10}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="mt-3 w-full accent-accent"
            aria-label="Ширина полотна, мм"
          />
          <div className="mt-1 flex justify-between font-mono text-xs text-ink-muted">
            <span>200</span>
            <span>1400</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium">Тип монтажа</div>
          <div className="mt-2">
            <Segmented value={mount} onChange={(v) => setMount(v as Mount)} options={mountOptions} />
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium">Задача</div>
          <div className="mt-2">
            <Segmented value={task} onChange={(v) => setTask(v as TaskKey)} options={tasks} />
          </div>
        </div>
      </div>

      {/* РЕЗУЛЬТАТ */}
      <div>
        <div className="rounded-panel border border-line bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Производимая длина</div>
          <div className="mt-1 font-display text-2xl font-bold">
            {len.nominal} мм
            {len.trim > 0 ? (
              <span className="ml-2 text-base font-medium text-ink-muted">· подрез на объекте {len.trim} мм</span>
            ) : (
              <span className="ml-2 text-base font-medium text-ink-muted">· точно по размеру</span>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-muted">Шаг длины 200 мм, укорочение на объекте — до 220 мм.</p>
        </div>

        {reco.primary ? (
          <Reveal className="mt-6" variant="fade">
            <div className="flex items-center gap-2">
              <Tag>Рекомендуем</Tag>
              <span className="text-sm text-ink-muted">
                {mount === 'unknown' ? 'по ширине двери' : `${mount} монтаж`}
              </span>
            </div>
            <div className="mt-3">
              <ModelCard p={reco.primary} primary />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href="/#contact">Запросить КП по «{reco.primary.title}»</Button>
              <Button href={`/catalog/${reco.primary.slug}`} variant="outline">
                Характеристики
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="mt-6 rounded-panel border border-line bg-white p-8 text-center">
            <h3 className="font-display text-xl font-bold">Точного совпадения нет</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
              Под такую ширину и тип монтажа в линейке нет готовой позиции — инженер подберёт решение
              индивидуально.
            </p>
            <div className="mt-5">
              <Button href="/contacts">Получить консультацию →</Button>
            </div>
          </div>
        )}

        {reco.alternates.length > 0 && (
          <div className="mt-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Ещё подходят</div>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {reco.alternates.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ModelCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-panel border-l-4 border-accent bg-accent-light p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            {tasks.find((t) => t.key === task)!.label}
          </div>
          <p className="mt-1 text-sm text-ink">{taskNote}</p>
        </div>
      </div>
    </div>
  )
}
