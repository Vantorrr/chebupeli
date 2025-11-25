'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

export default function LegalPage() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [activeTab, setActiveTab] = useState<'offer' | 'privacy'>('offer')

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
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('offer')}
            className={`flex-1 py-4 px-4 font-semibold ${
              activeTab === 'offer'
                ? 'border-b-2 border-velaro-orange text-velaro-orange'
                : 'text-gray-500'
            }`}
          >
            Публичная оферта
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 px-4 font-semibold ${
              activeTab === 'privacy'
                ? 'border-b-2 border-velaro-orange text-velaro-orange'
                : 'text-gray-500'
            }`}
          >
            Политика конфиденциальности
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'offer' ? (
          <div className="max-w-2xl mx-auto space-y-6 text-sm text-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Публичная оферта</h1>
            
            <section>
              <h2 className="font-semibold text-lg mb-2">1. Общие положения</h2>
              <p className="mb-2">
                Настоящая публичная оферта (далее — «Оферта») определяет условия предоставления услуг 
                по продаже цифровых интернет-пакетов (eSIM) через сервис Velaro.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">2. Предмет договора</h2>
              <p className="mb-2">
                Агент обязуется предоставить Пользователю услуги по оформлению и передаче заказа 
                на приобретение eSIM у провайдера, а Пользователь обязуется оплатить указанные услуги.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">3. Порядок оказания услуг</h2>
              <p className="mb-2">
                3.1. Пользователь выбирает тариф eSIM в интерфейсе приложения.<br/>
                3.2. Производит оплату выбранного тарифа.<br/>
                3.3. Получает QR-код или активационные данные для установки eSIM.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">4. Оплата</h2>
              <p className="mb-2">
                Оплата производится через платёжные системы: Тинькофф, ЮKassa, CloudPayments.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">5. Ответственность</h2>
              <p className="mb-2">
                5.1. Агент несёт ответственность только за корректность оформления и передачи заказа провайдеру.<br/>
                5.2. Качество интернет-соединения обеспечивается оператором связи, предоставившим интернет-доступ.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">6. Конфиденциальность</h2>
              <p className="mb-2">
                6.1. Агент не осуществляет обработку персональных данных в понимании ФЗ-152.<br/>
                6.2. Все сведения передаются напрямую платёжным и техническим партнёрам.
              </p>
            </section>

            <section>
              <h2 className="font-semibold text-lg mb-2">7. Реквизиты Агента</h2>
              <p className="mb-2">
                Индивидуальный предприниматель:<br/>
                Хамзатханов Саид-Хамзат Салахович<br/>
                ИНН: 200301503109<br/>
                ОГРНИП: 325200000065051<br/>
                Адрес: 366000, Чеченская Республика, г. Грозный, ул. Могилевская, д. 8, кв. 18<br/>
                Email: velaroite@gmail.com
              </p>
            </section>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}

