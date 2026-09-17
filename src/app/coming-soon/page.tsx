import Reveal from '@/components/motion/Reveal'
import Tag from '@/components/ui/Tag'

export const metadata = {
  title: 'FORBSA — сайт в разработке',
  robots: { index: false, follow: false },
}

export default function ComingSoon() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-graphite px-6 text-center text-white">
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] animate-drift-b rounded-full bg-accent/4 blur-3xl" />

      <div className="relative">
        <Reveal>
          <Tag tone="dark">FORBSA</Tag>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
            Сайт в разработке
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            Мы готовим новый сайт FORBSA. Скоро здесь появится каталог
            автоматических дверных порогов и вся информация о компании.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-8 text-sm text-white/40">
            По вопросам: <a href="mailto:sales@forbsa.ru" className="text-accent hover:underline">sales@forbsa.ru</a>
          </p>
        </Reveal>
      </div>
    </main>
  )
}
