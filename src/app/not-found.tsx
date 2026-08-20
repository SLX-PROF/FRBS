import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-graphite px-6 text-center text-white">
      <p className="text-7xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">Страница не найдена</h1>
      <p className="mt-2 text-gray-400">
        Возможно, товар переместился или ссылка устарела.
      </p>
      <Link
        href="/"
        className="mt-6 bg-accent px-6 py-3 font-semibold transition-colors hover:bg-orange-600"
      >
        На главную
      </Link>
      <Link
        href="/catalog"
        className="mt-3 text-gray-400 transition-colors hover:text-accent"
      >
        Перейти в каталог
      </Link>
    </main>
  )
}