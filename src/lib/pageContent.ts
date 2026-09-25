import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

// Тексты страниц, которые редактируются в админке («Содержимое сайта»).
// default — текущий текст сайта: он и подставляется в форму админки, и служит запасным
// значением, если поле пустое или запись ещё не создавалась. Поэтому пока никто ничего
// не менял, сайт выглядит как раньше.
// optional: пустое поле означает «не показывать блок» (а не «взять текст по умолчанию»).

export type FieldDef = { label: string; default: string; multiline?: boolean; optional?: boolean; hint?: string }
export type SectionDef = { label: string; keys: string[] }

const f = (label: string, def: string, o: Partial<FieldDef> = {}): FieldDef => ({ label, default: def, ...o })

const SEO_HINT = 'Показывается в поисковой выдаче и во вкладке браузера'

const HOME = {
  heroEyebrow: f('Надпись над заголовком', 'Производство · Россия'),
  heroTitle: f('Заголовок', 'Автоматические пороги'),
  heroAccent: f('Заголовок: выделенное слово', 'FORBSA', { hint: 'Показывается оранжевым после заголовка' }),
  heroLead: f('Подзаголовок', 'Герметизация двери за 1 секунду. Защита от дыма, шума, холода, света, пыли и насекомых. 1 000 000 циклов. Сертификат РОСТЕСТ.', { multiline: true }),
  heroCta: f('Кнопка', 'Смотреть каталог'),
  problemTitle: f('Проблема: заголовок', 'Щель под дверью —'),
  problemAccent: f('Проблема: серая часть заголовка', 'источник 6 проблем'),
  numbersTitle: f('Цифры: заголовок', 'Цифры, которые'),
  numbersAccent: f('Цифры: выделенная часть', 'говорят сами'),
  audienceTitle: f('Роли: заголовок', 'Выберите вашу роль'),
  audienceSubtitle: f('Роли: подзаголовок', 'Мы говорим на одном языке с каждым участником строительного процесса'),
  catalogTitle: f('Линейка: заголовок', 'Линейка продукции'),
  catalogSubtitle: f('Линейка: подзаголовок', '{count} моделей под любые задачи — от жилых объектов до противопожарных дверей', {
    hint: '{count} заменится числом моделей в каталоге. Уберите его, если число показывать не нужно.',
  }),
  techTitle: f('Технологии: заголовок', 'Инженерное превосходство'),
  techLead: f('Технологии: подзаголовок', 'Ни одного пластикового узла. Только металл, закалённая сталь и точная механика.'),
  trustTitle: f('Доверие: заголовок', 'Нам доверяют'),
  trustLead: f('Доверие: подзаголовок', 'Сертифицированная продукция, проверенная миллионами циклов'),
  ctaTitle: f('Финальный блок: заголовок', 'Обсудим ваш проект?'),
  ctaLead: f('Финальный блок: текст', 'Оставьте заявку — инженер свяжется в течение рабочего дня, подберёт модель и подготовит коммерческое предложение.', { multiline: true }),
  seoTitle: f('Заголовок страницы (title)', 'FORBSA — автоматические пороги для дверей. Производство от 1 дня', { hint: SEO_HINT }),
  seoDescription: f('Описание страницы (description)', 'Российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, {count} моделей. Для архитекторов и монтажников.', {
    multiline: true,
    hint: '{count} заменится числом моделей.',
  }),
} satisfies Record<string, FieldDef>

const ABOUT = {
  heroEyebrow: f('Надпись над заголовком', 'О компании'),
  heroTitle: f('Заголовок', 'Мы делаем двери'),
  heroAccent: f('Заголовок: выделенное слово', 'защищёнными'),
  heroLead: f('Подзаголовок', 'FORBSA — российский производитель автоматических порогов. Наша миссия — герметизация каждого дверного проёма: без дыма, шума, пыли, сквозняков и насекомых.', { multiline: true }),
  historyTitle: f('История: заголовок', 'История и путь развития'),
  historyText: f('История: текст', 'Мы выросли из производства дверной фурнитуры в полноценного производителя автоматических порогов полного цикла: собственный цех, контроль качества, складская программа и отгрузки по России и СНГ.', { multiline: true }),
  historyNote: f('История: служебная пометка', '* Точные даты и вехи истории добавит директор — скелет блока готов к наполнению.', {
    optional: true,
    hint: 'Очистите поле, чтобы пометка не показывалась на сайте',
  }),
  productionTitle: f('Производство: заголовок', 'Производство'),
  productionNote: f('Производство: служебная пометка', '* Фото и видео цеха появятся после фотосессии — бюджет согласован.', {
    optional: true,
    hint: 'Очистите поле, чтобы пометка не показывалась на сайте',
  }),
  ctaTitle: f('Финальный блок: заголовок', 'Связаться с нами'),
  ctaText: f('Финальный блок: текст', 'Ответим на вопросы, поможем подобрать модель и подготовим коммерческое предложение.', { multiline: true }),
  ctaButton: f('Финальный блок: кнопка', 'Связаться с нами'),
  seoTitle: f('Заголовок страницы (title)', 'О компании — FORBSA', { hint: SEO_HINT }),
  seoDescription: f('Описание страницы (description)', 'FORBSA — российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, производство от 1 дня.', { multiline: true }),
} satisfies Record<string, FieldDef>

const CONTACTS = {
  heroEyebrow: f('Надпись над заголовком', 'Офис · Производство'),
  heroTitle: f('Заголовок', 'Свяжитесь'),
  heroAccent: f('Заголовок: выделенная часть', 'с нами'),
  heroLead: f('Подзаголовок', 'Отвечаем в течение рабочего дня. Поможем подобрать модель, подготовим КП или проконсультируем по монтажу.', { multiline: true }),
  hoursEyebrow: f('Режим работы: надпись', 'Когда мы работаем'),
  hoursTitle: f('Режим работы: заголовок', 'Режим работы'),
  hoursWeekdays: f('Пн–Пт', '9:00 – 18:00'),
  hoursSaturday: f('Суббота', 'По договорённости'),
  hoursSunday: f('Воскресенье', 'Выходной'),
  fastReplyTitle: f('Плашка: заголовок', 'Отвечаем быстро'),
  fastReplyText: f('Плашка: текст', 'Заявки с сайта обрабатываются в течение 1 рабочего дня.', { multiline: true }),
  formTitle: f('Форма: заголовок', 'Напишите нам'),
  formSubtitle: f('Форма: подзаголовок', 'Заполните форму — менеджер свяжется с вами в течение рабочего дня и ответит на все вопросы.', { multiline: true }),
  seoTitle: f('Заголовок страницы (title)', 'Контакты FORBSA — офис и производство в Москве', { hint: SEO_HINT }),
  seoDescription: f('Описание страницы (description)', 'Свяжитесь с FORBSA: офис и производство в Москве. Телефон, email, форма обратной связи, реквизиты ООО «Форбса». Отвечаем в течение рабочего дня.', { multiline: true }),
} satisfies Record<string, FieldDef>

const DOCS = {
  heroEyebrow: f('Надпись над заголовком', 'Для архитекторов и проектировщиков'),
  heroTitle: f('Заголовок', 'Документация'),
  heroAccent: f('Заголовок: выделенное слово', 'FORBSA'),
  heroLead: f('Подзаголовок', 'Сертификаты, альбом типовых технических решений, BIM-модели и инструкции по монтажу. Все файлы доступны для скачивания без регистрации.', { multiline: true }),
  ctaTitle: f('Финальный блок: заголовок', 'Нужна консультация инженера?'),
  ctaText: f('Финальный блок: текст', 'Поможем подобрать модель, подготовим узел под ваш проект, проконсультируем по госэкспертизе.', { multiline: true }),
  ctaButton: f('Финальный блок: кнопка', 'Связаться с инженером →'),
  seoTitle: f('Заголовок страницы (title)', 'Документация FORBSA — сертификаты, альбом узлов, инструкции', { hint: SEO_HINT }),
  seoDescription: f('Описание страницы (description)', 'Сертификаты РОСТЕСТ, альбом типовых технических решений, BIM-модели, инструкции по монтажу. Всё для архитекторов, проектировщиков и монтажников.', { multiline: true }),
} satisfies Record<string, FieldDef>

const CATALOG = {
  heroTitle: f('Заголовок', 'Каталог продукции'),
  heroAccent: f('Заголовок: выделенное слово', 'FORBSA'),
  heroLead: f('Подзаголовок', 'Автоматические пороги для герметизации дверей любого типа. Шаг длины 200 мм — подбираем под любую ширину полотна.', { multiline: true }),
  ctaTitle: f('Финальный блок: заголовок', 'Не знаете, какая модель подходит?'),
  ctaSubtitle: f('Финальный блок: текст', 'Сообщите ширину двери и тип монтажа — инженер подберёт подходящую модель.', { multiline: true }),
  ctaButton: f('Финальный блок: кнопка', 'Консультация инженера →'),
  seoTitle: f('Заголовок страницы (title)', 'Каталог автоматических порогов FORBSA', { hint: SEO_HINT }),
  seoDescription: f('Описание страницы (description)', 'Врезные и накладные автоматические пороги FORBSA для алюминиевых, стальных, ПВХ и деревянных дверей. Шаг длины 200 мм.', { multiline: true }),
} satisfies Record<string, FieldDef>

export const PAGES = {
  'home-page': {
    label: 'Главная',
    path: '/',
    fields: HOME,
    sections: [
      { label: 'Первый экран', keys: ['heroEyebrow', 'heroTitle', 'heroAccent', 'heroLead', 'heroCta'] },
      { label: 'Разделы', keys: ['problemTitle', 'problemAccent', 'numbersTitle', 'numbersAccent', 'audienceTitle', 'audienceSubtitle', 'catalogTitle', 'catalogSubtitle', 'techTitle', 'techLead', 'trustTitle', 'trustLead'] },
      { label: 'Финальный блок', keys: ['ctaTitle', 'ctaLead'] },
      { label: 'Для поисковиков', keys: ['seoTitle', 'seoDescription'] },
    ],
  },
  'about-page': {
    label: 'О компании',
    path: '/about',
    fields: ABOUT,
    sections: [
      { label: 'Первый экран', keys: ['heroEyebrow', 'heroTitle', 'heroAccent', 'heroLead'] },
      { label: 'История и производство', keys: ['historyTitle', 'historyText', 'historyNote', 'productionTitle', 'productionNote'] },
      { label: 'Финальный блок', keys: ['ctaTitle', 'ctaText', 'ctaButton'] },
      { label: 'Для поисковиков', keys: ['seoTitle', 'seoDescription'] },
    ],
  },
  'contacts-page': {
    label: 'Контакты',
    path: '/contacts',
    fields: CONTACTS,
    sections: [
      { label: 'Первый экран', keys: ['heroEyebrow', 'heroTitle', 'heroAccent', 'heroLead'] },
      { label: 'Режим работы', keys: ['hoursEyebrow', 'hoursTitle', 'hoursWeekdays', 'hoursSaturday', 'hoursSunday', 'fastReplyTitle', 'fastReplyText'] },
      { label: 'Форма', keys: ['formTitle', 'formSubtitle'] },
      { label: 'Для поисковиков', keys: ['seoTitle', 'seoDescription'] },
    ],
  },
  'docs-page': {
    label: 'Документация',
    path: '/docs',
    fields: DOCS,
    sections: [
      { label: 'Первый экран', keys: ['heroEyebrow', 'heroTitle', 'heroAccent', 'heroLead'] },
      { label: 'Финальный блок', keys: ['ctaTitle', 'ctaText', 'ctaButton'] },
      { label: 'Для поисковиков', keys: ['seoTitle', 'seoDescription'] },
    ],
  },
  'catalog-page': {
    label: 'Каталог (тексты страницы)',
    path: '/catalog',
    fields: CATALOG,
    sections: [
      { label: 'Первый экран', keys: ['heroTitle', 'heroAccent', 'heroLead'] },
      { label: 'Финальный блок', keys: ['ctaTitle', 'ctaSubtitle', 'ctaButton'] },
      { label: 'Для поисковиков', keys: ['seoTitle', 'seoDescription'] },
    ],
  },
} as const

export type PageSlug = keyof typeof PAGES
export type PageContent<K extends PageSlug> = Record<keyof (typeof PAGES)[K]['fields'], string>

/** Тексты страницы: значения из админки, а где пусто или записи нет, текущие тексты по умолчанию. */
async function loadPageContent<K extends PageSlug>(slug: K, draft: boolean): Promise<PageContent<K>> {
  const defs = PAGES[slug].fields as Record<string, FieldDef>
  let doc: Record<string, unknown> | null = null
  try {
    const payload = await getPayload({ config })
    doc = (await payload.findGlobal({ slug, draft, depth: 0 })) as unknown as Record<string, unknown>
  } catch {
    doc = null
  }
  const exists = Boolean(doc && doc.createdAt)
  const out: Record<string, string> = {}
  for (const [key, def] of Object.entries(defs)) {
    const raw = doc?.[key]
    const text = typeof raw === 'string' ? raw : null
    out[key] = def.optional ? (exists ? (text ?? '') : def.default) : text && text.trim() ? text : def.default
  }
  return out as PageContent<K>
}

/** Подставляет {count} (число моделей) в текст. */
export const withCount = (text: string, count: number) => text.replaceAll('{count}', String(count))

// Одна выборка на запрос: generateMetadata и сама страница берут тексты из одного кэша.
export const getPageContent = cache(loadPageContent) as <K extends PageSlug>(slug: K, draft?: boolean) => Promise<PageContent<K>>
