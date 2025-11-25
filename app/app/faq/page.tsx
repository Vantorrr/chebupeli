'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
}

export default function FAQPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { webApp } = useTelegram()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.BackButton.show()
      webApp.BackButton.onClick(() => router.push('/support'))
    }

    const category = searchParams?.get('category')
    if (category) {
      setSelectedCategory(category)
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide()
      }
    }
  }, [webApp, router, searchParams])

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'payment',
      question: 'Как оплатить тариф?',
      answer: 'Оплата производится через платёжные системы Тинькофф, ЮKassa или CloudPayments. Выберите тариф, нажмите "Купить", выберите способ оплаты и следуйте инструкциям.',
    },
    {
      id: '2',
      category: 'payment',
      question: 'Что делать, если оплата не прошла?',
      answer: 'Проверьте баланс карты и правильность введённых данных. Если проблема сохраняется, свяжитесь с поддержкой через раздел "Поддержка" в приложении.',
    },
    {
      id: '3',
      category: 'installation',
      question: 'Как установить eSIM?',
      answer: 'После оплаты вы получите QR-код. Откройте Настройки → Сотовая связь → Добавить сотовый тариф, отсканируйте QR-код и следуйте инструкциям.',
    },
    {
      id: '4',
      category: 'installation',
      question: 'eSIM не активируется, что делать?',
      answer: 'Убедитесь, что ваше устройство поддерживает eSIM и у вас есть доступ к интернету. Если проблема сохраняется, обратитесь в поддержку.',
    },
    {
      id: '5',
      category: 'refund',
      question: 'Можно ли вернуть деньги?',
      answer: 'Возврат средств возможен в течение 14 дней с момента покупки, если eSIM не был активирован. Обратитесь в поддержку для оформления возврата.',
    },
    {
      id: '6',
      category: 'general',
      question: 'На каких устройствах работает eSIM?',
      answer: 'eSIM поддерживается на iPhone XS и новее, Google Pixel 3 и новее, а также на некоторых моделях Samsung и других производителей.',
    },
  ]

  const categories = [
    { id: '', name: 'Все вопросы' },
    { id: 'payment', name: 'Оплата' },
    { id: 'installation', name: 'Установка' },
    { id: 'refund', name: 'Возврат' },
    { id: 'general', name: 'Общие' },
  ]

  const filteredItems = selectedCategory
    ? faqItems.filter(item => item.category === selectedCategory)
    : faqItems

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold gradient-text text-center mb-4">FAQ</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-smooth ${
                selectedCategory === cat.id
                  ? 'bg-velaro-gradient text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-smooth"
            >
              <span className="font-semibold pr-4">{item.question}</span>
              <span className="text-velaro-orange text-xl flex-shrink-0">
                {expandedId === item.id ? '−' : '+'}
              </span>
            </button>
            {expandedId === item.id && (
              <div className="px-4 pb-4 text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

