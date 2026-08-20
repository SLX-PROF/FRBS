'use client'

import { trackGoal } from '@/lib/metrika'

export default function DownloadButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      download
      onClick={() => trackGoal('doc_download')}
      className="shrink-0 bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600"
    >
      Скачать
    </a>
  )
}