'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import QRCode from 'qrcode.react'
import axios from 'axios'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { webApp } = useTelegram()
  const [esimData, setEsimData] = useState<{ qrCode?: string; activationCode?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
    }

    const paymentId = searchParams.get('paymentId')
    const tariffId = searchParams.get('tariffId')

    if (paymentId && tariffId) {
      // Получение данных eSIM после успешной оплаты
      loadESIMData(paymentId, tariffId)
    } else {
      setLoading(false)
    }
  }, [webApp, searchParams])

  const loadESIMData = async (paymentId: string, tariffId: string) => {
    try {
      // TODO: Получить eSIM данные из API
      // const response = await axios.get(`/api/esim/${tariffId}?paymentId=${paymentId}`)
      // setEsimData(response.data)

      // Моковые данные
      setEsimData({
        qrCode: 'LPA:1$your-provider.com$activation-code-here',
        activationCode: 'SM-DP+ Address: your-provider.com\nActivation Code: ABC123XYZ',
      })
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки eSIM:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velaro-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных eSIM...</p>
        </div>
      </div>
    )
  }

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

        {esimData && (
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
        )}

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

