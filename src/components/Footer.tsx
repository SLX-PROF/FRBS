import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-graphite text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold tracking-wide">
            FORBSA<span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-sm text-gray-400">
            Российский производитель автоматических порогов для алюминиевых,
            стальных, ПВХ и деревянных дверей, включая противопожарные.
          </p>
        </div>

        <nav>
          <p className="mb-3 font-bold">Разделы</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><Link href="/catalog" className="transition-colors hover:text-accent">Каталог</Link></li>
            <li><Link href="/partners" className="transition-colors hover:text-accent">Для партнёров</Link></li>
            <li><Link href="/docs" className="transition-colors hover:text-accent">Документация</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-accent">О компании</Link></li>
            <li><Link href="/contacts" className="transition-colors hover:text-accent">Контакты</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-3 font-bold">Контакты</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li>г. Екатеринбург, ул. Производственная, 1</li>
            <li><a href="tel:+73430000000" className="transition-colors hover:text-accent">+7 (343) 000-00-00</a></li>
            <li><a href="mailto:info@forbsa.ru" className="transition-colors hover:text-accent">info@forbsa.ru</a></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-bold">Документы</p>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><Link href="/docs" className="transition-colors hover:text-accent">Политика конфиденциальности</Link></li>
            <li><Link href="/docs" className="transition-colors hover:text-accent">Согласие на обработку данных</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ООО «Форбса». Все права защищены.
      </div>
    </footer>
  )
}