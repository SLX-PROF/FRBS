// Панель быстрого доступа над дашбордом админки.

const links = [
  { href: '/cp-7k2f9x/collections/leads', label: 'Заявки' },
  { href: '/cp-7k2f9x/collections/deals', label: 'Сделки' },
  { href: '/cp-7k2f9x/collections/activities', label: 'Задачи' },
  { href: '/cp-7k2f9x/collections/companies', label: 'Компании' },
  { href: '/cp-7k2f9x/collections/chat-sessions', label: 'Диалоги с ботом' },
  { href: '/cp-7k2f9x/globals/company-profile', label: 'Реквизиты' },
]

export function Welcome() {
  return (
    <div className="forbsa-welcome">
      <h2>CRM FORBSA</h2>
      <p>Заявки с сайта и чат-бота, сделки, задачи и документы — в одном месте.</p>
      <div className="forbsa-welcome__links">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
