import type { Metadata } from 'next'
import { Manrope, Golos_Text } from 'next/font/google'
import './globals.css'
import Metrika from '@/components/Metrika'

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const golos = Golos_Text({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FORBSA — автоматические пороги для дверей',
  description:
    'Производитель автоматических порогов для противопожарных и акустических дверей. 1 000 000 циклов, нержавеющая сталь A2, шумоизоляция до 48 дБ.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${golos.variable} antialiased`}>
        <Metrika />
        {children}
      </body>
    </html>
  )
}