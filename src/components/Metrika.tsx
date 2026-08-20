import Script from 'next/script'
import { METRIKA_ID } from '@/lib/metrika'

export default function Metrika() {
  if (!METRIKA_ID) return null
  return (
    <>
      <Script id="metrika-loader" strategy="afterInteractive" src="https://mc.yandex.ru/metrika/tag.js" />
      <Script id="metrika-init" strategy="afterInteractive">
        {`
          window.ym = window.ym || function(){ (window.ym.a = window.ym.a || []).push(arguments) };
          window.ym(${METRIKA_ID}, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          });
        `}
      </Script>
    </>
  )
}