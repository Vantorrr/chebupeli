'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

export default function PaymentFailPage() {
  const router = useRouter()
  const { webApp } = useTelegram()

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
    }
  }, [webApp])

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✕</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка оплаты</h2>
        <p className="text-gray-600 mb-6">
          К сожалению, оплата не была завершена. Попробуйте еще раз или выберите другой способ оплаты.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/tariffs')}
            className="w-full bg-velaro-gradient text-white py-4 px-6 rounded-xl font-semibold text-lg"
          >
            Вернуться к тарифам
          </button>
          <button
            onClick={() => router.push('/support')}
            className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg"
          >
            Связаться с поддержкой
          </button>
        </div>
      </div>
    </div>
  )
}

