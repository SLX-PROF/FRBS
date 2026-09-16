// Удаление брошенных заявок по истечении срока хранения (152-ФЗ).
// Пробный запуск:   node scripts/purge-personal-data.mjs
// Удаление:         node scripts/purge-personal-data.mjs --apply
// Срок:             RETENTION_YEARS=3 (по умолчанию)
//
// Под критерий попадают заявки старше срока, со статусом "new" и без
// привязанной сделки. Удаление проходит через Local API, поэтому фиксируется
// в журнале аудита. Планировщик добавит SP3.
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const YEARS = Number(process.env.RETENTION_YEARS || 3)
const apply = process.argv.includes('--apply')

const cutoff = new Date()
cutoff.setFullYear(cutoff.getFullYear() - YEARS)

const payload = await getPayload({ config })
const { docs, totalDocs } = await payload.find({
  collection: 'leads',
  where: {
    and: [
      { status: { equals: 'new' } },
      { linkedDeal: { exists: false } },
      { createdAt: { less_than: cutoff.toISOString() } },
    ],
  },
  limit: 1000,
  depth: 0,
})

console.log(
  `Кандидатов: ${totalDocs} (старше ${YEARS} лет, статус "new", без сделки, до ${cutoff.toISOString().slice(0, 10)})`,
)
for (const d of docs) console.log(`  #${d.id}  ${String(d.createdAt).slice(0, 10)}  ${d.name}`)

if (!apply) {
  console.log('\nПробный запуск. Повторите с --apply, чтобы удалить.')
  process.exit(0)
}

let done = 0
for (const d of docs) {
  await payload.delete({ collection: 'leads', id: d.id })
  done += 1
}
console.log(`\nУдалено: ${done}`)
process.exit(0)
