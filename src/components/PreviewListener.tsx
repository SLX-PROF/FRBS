'use client'

import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'

const subscribe = () => () => {}

// Только в режиме предпросмотра: обновляет страницу в окне админки, когда правка сохранена.
export default function PreviewListener() {
  const router = useRouter()
  const origin = useSyncExternalStore(subscribe, () => window.location.origin, () => '')
  if (!origin) return null
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />
}
