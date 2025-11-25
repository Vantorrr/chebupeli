'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

interface Package {
  id: string
  dataGB: number
  price: string
  days: number
}

export default function TariffsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { webApp } = useTelegram()
  const [countryName, setCountryName] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.BackButton.show()
      webApp.BackButton.onClick(() => router.push('/'))
    }

    const name = searchParams?.get('name')
    if (name) {
      setCountryName(decodeURIComponent(name))
    }

    return () => {
      if (webApp) {
        webApp.BackButton.hide()
      }
    }
  }, [webApp, router, searchParams])

  const packages3Days: Package[] = [
    { id: '1', dataGB: 1, price: '$4.00 USD', days: 3 },
    { id: '2', dataGB: 3, price: '$5.50 USD', days: 3 },
  ]

  const packages7Days: Package[] = [
    { id: '3', dataGB: 3, price: '$6.00 USD', days: 7 },
    { id: '4', dataGB: 5, price: '$7.00 USD', days: 7 },
  ]

  const handleBuy = () => {
    if (selectedPackage) {
      router.push(`/payment?packageId=${selectedPackage}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">{countryName}</h1>
      </div>

      {/* Provider Info - улучшенный */}
      <div className="bg-white mx-4 mt-5 rounded-3xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-start space-x-4 mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-4xl shadow-md">
            🇹🇭
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md">
                интернет 4G
              </div>
              <span className="text-xl font-extrabold text-gray-900">Maew</span>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-1">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              </div>
              <span className="text-sm font-semibold text-gray-700">AIS</span>
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">
                5G
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">Совместимо ли это устройство?</span>
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Да</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Section */}
      <div className="mx-4 mt-6">
        <div className="text-center mb-5">
          <div className="border-t-2 border-gray-300 pt-5">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Трафик</h2>
            <p className="text-sm text-gray-600 font-medium">Выберите пакет</p>
          </div>
        </div>

        {/* 3 Days Packages */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#FF6B35] rounded-full mr-2"></span>
            3 дн.
          </h3>
          <div className="space-y-3">
            {packages3Days.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  selectedPackage === pkg.id
                    ? 'border-[#FF6B35] bg-gradient-to-r from-[#FFF5F2] to-[#FFE8E0] shadow-xl'
                    : 'border-gray-200 bg-white hover:border-[#FF6B35]/50 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {selectedPackage === pkg.id && (
                    <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#FF8C69] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-xl font-extrabold text-gray-900">{pkg.dataGB} GB</span>
                </div>
                <span className="text-xl font-extrabold text-[#FF6B35]">{pkg.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 7 Days Packages */}
        <div className="mb-24">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-1 h-5 bg-[#FF6B35] rounded-full mr-2"></span>
            7 дн.
          </h3>
          <div className="space-y-3">
            {packages7Days.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  selectedPackage === pkg.id
                    ? 'border-[#FF6B35] bg-gradient-to-r from-[#FFF5F2] to-[#FFE8E0] shadow-xl'
                    : 'border-gray-200 bg-white hover:border-[#FF6B35]/50 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {selectedPackage === pkg.id && (
                    <div className="w-6 h-6 bg-gradient-to-r from-[#FF6B35] to-[#FF8C69] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-xl font-extrabold text-gray-900">{pkg.dataGB} GB</span>
                </div>
                <span className="text-xl font-extrabold text-[#FF6B35]">{pkg.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buy Button - улучшенный */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 p-4 shadow-2xl">
        <button
          onClick={handleBuy}
          disabled={!selectedPackage}
          className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all active:scale-[0.98] ${
            selectedPackage
              ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C69] text-white shadow-xl hover:shadow-2xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Купить
        </button>
      </div>
    </div>
  )
}
