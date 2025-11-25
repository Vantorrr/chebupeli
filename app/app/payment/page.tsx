'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import QRCode from 'qrcode.react'
import axios from 'axios'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { webApp } = useTelegram()
  const [tariff, setTariff] = useState<any>(null)
  const [agreed, setAgreed] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'tinkoff' | 'yookassa' | 'cloudpayments' | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [esimData, setEsimData] = useState<{ qrCode?: string; activationCode?: string } | null>(null)

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.BackButton.show()
      webApp.BackButton.onClick(() => router.push('/tariffs'))
    }

    // Загрузка данных тарифа
    const tariffId = searchParams?.get('tariffId')
    if (tariffId) {
      loadTariff(tariffId)
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide()
      }
    }
  }, [webApp, router, searchParams])

  const loadTariff = async (tariffId: string) => {
    // TODO: Загрузить тариф по ID из API
    const mockTariff = {
      id: tariffId,
      country: 'Турция',
      dataGB: 5,
      days: 30,
      type: 'Standard',
      price: 990,
    }
    setTariff(mockTariff)
  }

  const handlePayment = async (method: 'tinkoff' | 'yookassa' | 'cloudpayments') => {
    if (!agreed) {
      if (webApp) {
        webApp.showAlert('Необходимо согласиться с условиями Оферты и Политики конфиденциальности')
      } else {
        alert('Необходимо согласиться с условиями Оферты и Политики конфиденциальности')
      }
      return
    }

    setPaymentMethod(method)

    try {
      const response = await axios.post('/api/payment/create', {
        tariffId: tariff.id,
        method,
        amount: tariff.price,
      })

      if (response.data.paymentUrl) {
        // Редирект на страницу оплаты
        window.location.href = response.data.paymentUrl
      } else {
        // Симуляция успешной оплаты (для тестирования)
        setTimeout(() => {
          setPaymentStatus('success')
          setEsimData({
            qrCode: 'LPA:1$your-provider.com$activation-code-here',
            activationCode: 'SM-DP+ Address: your-provider.com\nActivation Code: ABC123XYZ',
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Ошибка оплаты:', error)
      setPaymentStatus('failed')
    }
  }

  if (!tariff) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velaro-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success' && esimData) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Оплата успешна!</h2>
            <p className="text-gray-600">Ваш eSIM готов к использованию</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Инструкция по установке:</h3>
            
            {esimData.qrCode && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Отсканируйте QR-код:</p>
                <div className="bg-white p-4 rounded-lg flex justify-center">
                  <QRCode value={esimData.qrCode} size={200} />
                </div>
              </div>
            )}

            {esimData.activationCode && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Или используйте код активации:</p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm font-mono break-all">{esimData.activationCode}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Откройте Настройки → Сотовая связь</p>
              <p>2. Нажмите «Добавить сотовый тариф»</p>
              <p>3. Отсканируйте QR-код или введите код вручную</p>
              <p>4. Следуйте инструкциям на экране</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/my-esims')}
              className="w-full bg-velaro-gradient text-white py-4 px-6 rounded-xl font-semibold text-lg"
            >
              Мои eSIM
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка оплаты</h2>
          <p className="text-gray-600 mb-6">Попробуйте еще раз или выберите другой способ оплаты</p>
          <button
            onClick={() => setPaymentStatus('pending')}
            className="w-full bg-velaro-gradient text-white py-4 px-6 rounded-xl font-semibold text-lg"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold gradient-text text-center mb-6">Оплата</h1>

        {/* Информация о тарифе */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-lg mb-3">{tariff.country}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Данные:</span>
              <span className="font-semibold">{tariff.dataGB} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Срок:</span>
              <span className="font-semibold">{tariff.days} дней</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Тип:</span>
              <span className="font-semibold">{tariff.type}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Итого:</span>
                <span className="text-2xl font-bold text-velaro-orange">{tariff.price} ₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Чекбокс согласия */}
        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-velaro-orange border-gray-300 rounded focus:ring-velaro-orange"
            />
            <span className="text-sm text-gray-700">
              Покупая пакет, вы соглашаетесь с условиями{' '}
              <a href="/offer" className="text-velaro-orange underline">Оферты</a> и{' '}
              <a href="/privacy" className="text-velaro-orange underline">Политики конфиденциальности</a> Velaro.
            </span>
          </label>
        </div>

        {/* Способы оплаты */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handlePayment('tinkoff')}
            disabled={!agreed || paymentMethod !== null}
            className="w-full bg-white border-2 border-gray-300 hover:border-velaro-orange py-4 px-6 rounded-xl font-semibold text-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 Тинькофф
          </button>
          <button
            onClick={() => handlePayment('yookassa')}
            disabled={!agreed || paymentMethod !== null}
            className="w-full bg-white border-2 border-gray-300 hover:border-velaro-orange py-4 px-6 rounded-xl font-semibold text-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 ЮKassa
          </button>
          <button
            onClick={() => handlePayment('cloudpayments')}
            disabled={!agreed || paymentMethod !== null}
            className="w-full bg-white border-2 border-gray-300 hover:border-velaro-orange py-4 px-6 rounded-xl font-semibold text-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💳 CloudPayments
          </button>
        </div>

        {paymentMethod && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-velaro-orange mx-auto mb-2"></div>
            <p className="text-gray-600">Обработка платежа...</p>
          </div>
        )}
      </div>
    </div>
  )
}

