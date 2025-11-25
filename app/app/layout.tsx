import type { Metadata } from 'next'
import './globals.css'
import { TelegramProvider } from '@/components/TelegramProvider'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Velaro - Цифровые интернет-пакеты для путешествий',
  description: 'Velaro — цифровые интернет-пакеты для путешествий',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </body>
    </html>
  )
}

