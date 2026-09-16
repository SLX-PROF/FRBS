import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer'
import path from 'node:path'
import {
  kpNumber,
  computeTotals,
  lineSum,
  formatRub,
  formatDate,
  type Position,
} from './number'

// Пути от cwd, а не через new URL(import.meta.url) — иначе webpack пытается
// «зарезолвить» их как модуль на сборке. Файлы шрифтов кладутся в standalone
// через outputFileTracingIncludes в next.config.mjs.
const fontDir = path.join(process.cwd(), 'src', 'lib', 'pdf', 'fonts')
Font.register({
  family: 'PTSans',
  fonts: [
    { src: path.join(fontDir, 'PTSans-Regular.ttf') },
    { src: path.join(fontDir, 'PTSans-Bold.ttf'), fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'PTSans', fontSize: 10, color: '#1d1d1f', lineHeight: 1.4 },
  h1: { fontSize: 15, fontWeight: 'bold' },
  muted: { color: '#6e6e73' },
  accent: { color: '#f25a00' },
  block: { marginTop: 14 },
  label: { fontSize: 8, color: '#6e6e73', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  th: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f7',
    borderBottomWidth: 1,
    borderColor: '#d2d2d7',
    paddingVertical: 5,
    fontWeight: 'bold',
  },
  td: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eeeeee', paddingVertical: 5 },
  cNo: { width: '7%' },
  cName: { width: '48%' },
  cQty: { width: '13%', textAlign: 'right' },
  cPrice: { width: '16%', textAlign: 'right' },
  cSum: { width: '16%', textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },
})

type Args = { deal: any; company: any; profile: any; date?: Date }

function KpDocument({ deal, company, profile, date }: Required<Args>) {
  const positions: Position[] = Array.isArray(deal.positions) ? deal.positions : []
  const rows: Position[] = positions.length
    ? positions
    : [{ label: 'Поставка по договорённости', qty: 1, unitPrice: deal.amount ?? 0 }]
  const totals = computeTotals(positions, deal.amount, Boolean(deal.vatIncluded))
  const num = kpNumber(deal.id, date)
  const seller = profile?.legalName || 'ООО «Форбса»'

  return (
    <Document title={num}>
      <Page size="A4" style={s.page}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={s.h1}>{seller}</Text>
            {profile?.address ? <Text style={s.muted}>{profile.address}</Text> : null}
            <Text style={s.muted}>{[profile?.phone, profile?.email].filter(Boolean).join(' · ')}</Text>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={[s.h1, s.accent]}>{num}</Text>
            <Text style={s.muted}>от {formatDate(date)}</Text>
          </View>
        </View>

        <View style={s.block}>
          <Text style={s.label}>Продавец</Text>
          <Text>
            {seller}
            {profile?.inn ? `, ИНН ${profile.inn}` : ''}
            {profile?.kpp ? ` / КПП ${profile.kpp}` : ''}
            {profile?.ogrn ? `, ОГРН ${profile.ogrn}` : ''}
          </Text>
        </View>

        <View style={s.block}>
          <Text style={s.label}>Покупатель</Text>
          <Text>
            {company?.name || '—'}
            {company?.inn ? `, ИНН ${company.inn}` : ''}
          </Text>
          {company?.contactPerson ? (
            <Text style={s.muted}>
              Контакт: {company.contactPerson}
              {company?.phone ? `, ${company.phone}` : ''}
            </Text>
          ) : null}
        </View>

        <View style={s.block}>
          <Text style={[s.muted, { marginBottom: 4 }]}>
            Предмет предложения{deal.title ? `: ${deal.title}` : ''}
          </Text>
          <View style={s.th}>
            <Text style={s.cNo}>№</Text>
            <Text style={s.cName}>Наименование</Text>
            <Text style={s.cQty}>Кол-во</Text>
            <Text style={s.cPrice}>Цена</Text>
            <Text style={s.cSum}>Сумма</Text>
          </View>
          {rows.map((p, i) => (
            <View style={s.td} key={i}>
              <Text style={s.cNo}>{i + 1}</Text>
              <Text style={s.cName}>{p.label || '—'}</Text>
              <Text style={s.cQty}>{Number(p.qty ?? 1)}</Text>
              <Text style={s.cPrice}>{formatRub(Number(p.unitPrice ?? 0))}</Text>
              <Text style={s.cSum}>{formatRub(lineSum(p))}</Text>
            </View>
          ))}
        </View>

        <View style={s.totalRow}>
          <Text style={{ width: 160 }}>Итого:</Text>
          <Text style={{ width: 120, textAlign: 'right', fontWeight: 'bold' }}>{formatRub(totals.total)}</Text>
        </View>
        <View style={s.totalRow}>
          <Text style={[s.muted, { width: 280, textAlign: 'right' }]}>{totals.vatNote}</Text>
        </View>

        <View style={s.block}>
          {deal.validUntil ? (
            <Text>Предложение действительно до {formatDate(new Date(deal.validUntil))}.</Text>
          ) : null}
          <Text style={s.muted}>
            Производство от 1 дня · ресурс 1 000 000 циклов · сертификат РОСТЕСТ.
          </Text>
        </View>

        {profile?.signerName ? (
          <View style={[s.block, { marginTop: 28 }]}>
            <Text>
              {profile.signerTitle || 'Генеральный директор'} ________________ / {profile.signerName} /
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}

export async function renderKpPdf({ deal, company, profile, date }: Args): Promise<Buffer> {
  return renderToBuffer(
    <KpDocument deal={deal} company={company} profile={profile} date={date ?? new Date()} />,
  )
}
