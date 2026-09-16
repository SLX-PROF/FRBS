import Reveal from '@/components/motion/Reveal'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-graphite px-6 text-center text-white">
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] animate-drift-b rounded-full bg-accent/4 blur-3xl" />

      <div className="relative">
        <Reveal>
          <Tag tone="dark">Ошибка 404</Tag>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-6 font-mono text-8xl font-bold leading-none text-accent md:text-9xl">
            404
          </p>
        </Reveal>

        <Reveal delay={200}>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">Страница не найдена</h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Возможно, товар переместился или ссылка устарела. Попробуйте
            вернуться на главную или найти нужную модель в каталоге.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" size="lg">
              На главную
            </Button>
            <Button href="/catalog" variant="ghost" size="lg">
              Перейти в каталог
            </Button>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
