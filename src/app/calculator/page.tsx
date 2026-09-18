import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Reveal from '@/components/motion/Reveal'
import Tag from '@/components/ui/Tag'
import { getAllProducts } from '@/lib/products'
import type { RecoProduct } from '@/lib/recommend'
import CalculatorClient from './CalculatorClient'

// Интерактивный инструмент — рендерим на запрос: список моделей всегда свежий
// из CMS, а сборка не зависит от доступности БД на этапе пререндера.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Подбор автоматического порога FORBSA по ширине двери',
  description:
    'Калькулятор подбора: укажите ширину двери и тип монтажа — покажем подходящие модели автоматических порогов FORBSA и производимую длину.',
}

export default async function CalculatorPage() {
  const docs = await getAllProducts()
  const products: RecoProduct[] = docs.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    type: p.type,
    series: p.series ?? null,
    minDoorWidth: p.minDoorWidth ?? null,
    features: p.features ?? null,
    sortOrder: p.sortOrder ?? null,
    images: p.images,
  }))

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      <section className="bg-graphite py-20 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">Калькулятор подбора</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Какой порог подойдёт <span className="text-accent">вашей двери</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70">
              Укажите ширину дверного полотна и тип монтажа — подберём модель из линейки и посчитаем
              производимую длину. Точный подбор подтвердит инженер.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <CalculatorClient products={products} />
        </div>
      </section>

      <Footer />
    </main>
  )
}
