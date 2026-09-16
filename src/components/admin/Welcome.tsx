// Панель быстрого доступа над дашбордом админки.

const links = [
  { href: '/admin/collections/leads', label: 'Заявки' },
  { href: '/admin/collections/deals', label: 'Сделки' },
  { href: '/admin/collections/activities', label: 'Задачи' },
  { href: '/admin/collections/companies', label: 'Компании' },
  { href: '/admin/collections/chat-sessions', label: 'Диалоги с ботом' },
  { href: '/admin/globals/company-profile', label: 'Реквизиты' },
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
