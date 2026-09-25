import { draftMode } from 'next/headers'
import { getPageContent } from '@/lib/pageContent'
import PreviewListener from '@/components/PreviewListener'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import CatalogClient from './CatalogClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { isEnabled } = await draftMode()
  const c = await getPageContent('catalog-page', isEnabled)
  return { title: c.seoTitle, description: c.seoDescription }
}

export default async function CatalogPage() {
  const { isEnabled: isDraft } = await draftMode()
  const c = await getPageContent('catalog-page', isDraft)
  const payload = await getPayload({ config: configPromise })

  // Порядок как в админке (поле «Порядок сортировки»), затем по названию.
  const { docs } = await payload.find({
    collection: 'products',
    limit: 100,
    sort: ['sortOrder', 'title'],
    draft: isDraft,
  })

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      {isDraft && <PreviewListener />}
      <Header />

      {/* HERO КАТАЛОГА */}
      <section className="bg-graphite pt-8 pb-14 text-white md:pt-10 md:pb-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal delay={100}>
            <h1 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
              {c.heroTitle}{' '}
              <span className="text-accent">
                {c.heroAccent}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70">
              {c.heroLead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ФИЛЬТРЫ + СЕТКА */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <CatalogClient products={docs} />
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="bg-graphite py-14 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              dark
              center
              title={c.ctaTitle}
              subtitle={c.ctaSubtitle}
            />
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/contacts" size="lg">
                {c.ctaButton}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}