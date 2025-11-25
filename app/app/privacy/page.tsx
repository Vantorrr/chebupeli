'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

export default function PrivacyPage() {
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto space-y-6 text-sm text-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Политика конфиденциальности</h1>
        
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Общие положения</h2>
          <p className="mb-2">
            Настоящая Политика конфиденциальности определяет порядок обработки информации, 
            получаемой при использовании сервиса Velaro.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">2. Сбор информации</h2>
          <p className="mb-2">
            При использовании сервиса мы получаем минимально необходимую информацию для 
            выполнения заказа: данные Telegram-аккаунта, информация о выбранном тарифе.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">3. Использование информации</h2>
          <p className="mb-2">
            Полученная информация используется исключительно для обработки заказов и 
            передачи данных провайдеру eSIM и платёжным партнёрам.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">4. Защита данных</h2>
          <p className="mb-2">
            Мы применяем меры по минимизации и анонимизации передаваемых данных в 
            соответствии с требованиями ФЗ-152.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">5. Контакты</h2>
          <p className="mb-2">
            По вопросам конфиденциальности обращайтесь: velaroite@gmail.com
          </p>
        </section>
      </div>
    </div>
  )
}

