'use client'

import { trackGoal } from '@/lib/metrika'

export default function DownloadButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      download
      onClick={() => trackGoal('doc_download')}
      className="inline-flex shrink-0 items-center justify-center rounded-btn bg-accent px-4 py-2 font-display font-bold text-white transition-colors hover:bg-accent-dark"
    >
      Скачать
    </a>
  )
}