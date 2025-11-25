'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import { useCurrency } from '@/components/CurrencyProvider'
import { Logo } from '@/components/Logo'
import axios from 'axios'

interface Country {
  id: string
  name: string
  code: string
  price: string
  flag: string
  region?: string
  type?: 'local' | 'regional' | 'international'
  priceUsd?: number // Храним оригинальную цену в USD для конвертации
}

// ... (getCountryFlag остается без изменений)

export default function Home() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const { currency, formatPrice } = useCurrency()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Популярные')
  const [userName, setUserName] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  // ... (useEffect с загрузкой пользователя остается)

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/countries')
      
      const countriesData = response.data.countries || []
      
      if (countriesData.length === 0) {
        throw new Error('Список стран пуст')
      }
      
      const formattedCountries: Country[] = countriesData.map((country: any) => ({
        id: country.code,
        name: country.name,
        code: country.code,
        price: country.minPrice ? `$${country.minPrice.toFixed(2)} USD` : '$0.00 USD',
        priceUsd: country.minPrice || 0,
        flag: getCountryFlag(country.code),
        region: country.region,
        type: country.type || 'local',
      }))
      
      console.log(`Загружено ${formattedCountries.length} стран`)
      setCountries(formattedCountries)
    } catch (error: any) {
      // ... (обработка ошибок)
      // В fallback данных тоже добавим priceUsd
      setCountries([
        { id: '1', name: 'Таиланд', code: 'TH', price: '$4.00 USD', priceUsd: 4.00, flag: '🇹🇭', region: 'Азия' },
        { id: '2', name: 'Нидерланды', code: 'NL', price: '$4.00 USD', priceUsd: 4.00, flag: '🇳🇱', region: 'Европа' },
        // ... (остальные моки)
      ])
    } finally {
      setLoading(false)
    }
  }

  // ... (tabs и фильтрация остаются)

  // Рендеринг цены с учетом валюты
  const displayPrice = (country: Country) => {
    if (country.priceUsd) {
      return formatPrice(country.priceUsd)
    }
    return country.price // Fallback если нет priceUsd
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-20">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-white to-[#FFF8F5] px-4 py-3 flex justify-between items-center shadow-sm relative">
        <div className="flex items-center space-x-2 opacity-0">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">Airmoney</span>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo className="justify-center" size="md" />
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          {currency === 'USD' ? '$0.00 USD' : '0 ₽'}
        </div>
      </div>

      {/* ... (Greeting, Search, Promo, Tabs, Description) */}

      {/* Countries List */}
      <div className="px-4 py-3 pb-24">
        <div className="space-y-3">
          {filteredCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => router.push(`/tariffs?country=${country.code}&name=${encodeURIComponent(country.name)}`)}
              className="w-full group flex items-center justify-between p-5 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 active:scale-[0.98] border border-gray-100 hover:border-[#FF6B35]/30"
            >
              <div className="flex items-center space-x-4">
                {/* ... (флаг и название страны) */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {country.flag}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-gray-900 mb-0.5">{country.name}</p>
                  {country.region && (
                    <p className="text-xs text-gray-500">{country.region}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-extrabold text-[#FF6B35] mb-0.5">
                  {displayPrice(country)}
                </span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ... (Bottom Navigation) */}
    </div>
  )
}
