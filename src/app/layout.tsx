import ScrollProgress from '@/components/motion/ScrollProgress'
import Preloader from '@/components/motion/Preloader'
import ChatWidget from '@/components/chat/ChatWidget'
import type { Metadata } from 'next'
import './globals.css'
import Metrika from '@/components/Metrika'

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
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Metrika />
        <Preloader />
        <ScrollProgress />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
