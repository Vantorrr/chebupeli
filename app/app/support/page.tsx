'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

export default function SupportPage() {
  const router = useRouter()
  const { webApp } = useTelegram()

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.BackButton.show()
      webApp.BackButton.onClick(() => router.push('/'))
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide()
      }
    }
  }, [webApp, router])

  const supportBot = process.env.NEXT_PUBLIC_SUPPORT_BOT_USERNAME || 'support_bot'
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'velaroite@gmail.com'

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold gradient-text text-center mb-6">Поддержка</h1>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="font-semibold text-lg mb-3">Свяжитесь с нами</h2>
            <div className="space-y-3">
              <a
                href={`https://t.me/${supportBot}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-white border-2 border-velaro-orange text-velaro-orange py-3 px-4 rounded-lg font-semibold hover:bg-velaro-orange hover:text-white transition-smooth"
              >
                <span>💬</span>
                <span>Связаться с поддержкой</span>
              </a>
              <a
                href={`mailto:${supportEmail}`}
                className="flex items-center space-x-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-smooth"
              >
                <span>✉️</span>
                <span>{supportEmail}</span>
              </a>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h2 className="font-semibold text-lg mb-3">Быстрые решения</h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/faq?category=payment')}
                className="w-full text-left bg-white border border-gray-200 hover:border-velaro-orange py-3 px-4 rounded-lg transition-smooth"
              >
                💳 Проблема с оплатой
              </button>
              <button
                onClick={() => router.push('/faq?category=installation')}
                className="w-full text-left bg-white border border-gray-200 hover:border-velaro-orange py-3 px-4 rounded-lg transition-smooth"
              >
                📲 Ошибка при установке eSIM
              </button>
              <button
                onClick={() => router.push('/faq?category=refund')}
                className="w-full text-left bg-white border border-gray-200 hover:border-velaro-orange py-3 px-4 rounded-lg transition-smooth"
              >
                💰 Возврат средств
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h2 className="font-semibold text-lg mb-2">Часто задаваемые вопросы</h2>
            <button
              onClick={() => router.push('/faq')}
              className="text-velaro-orange font-semibold underline"
            >
              Открыть FAQ →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

