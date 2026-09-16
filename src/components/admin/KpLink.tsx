'use client'

import { useDocumentInfo } from '@payloadcms/ui'

export function KpLink() {
  const { id } = useDocumentInfo()

  if (!id) {
    return <p style={{ color: '#6e6e73', margin: 0 }}>Сохраните сделку, чтобы сформировать КП.</p>
  }

  return (
    <a
      href={`/api/deals/${id}/kp`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ fontWeight: 600, color: '#f25a00', textDecoration: 'none' }}
    >
      Сформировать КП (PDF) →
    </a>
  )
}
