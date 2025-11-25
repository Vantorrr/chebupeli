'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import { Logo } from '@/components/Logo'
import axios from 'axios'

interface Country {
  id: string
  name: string
  code: string
  price: string
  flag: string
  region?: string
  type?: 'local' | 'regional' | 'international' // Тип тарифа
}

// Функция для получения флага по коду страны (автоматическая генерация)
const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '🌍'
  
  try {
    // Конвертируем код страны в эмодзи флаг
    const codePoints = code
      .toUpperCase()
      .split('')
      .map((char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  } catch (e) {
    return '🌍'
  }
}

export default function Home() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Популярные')
  const [userName, setUserName] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
      const user = webApp.initDataUnsafe?.user
      if (user?.first_name) {
        setUserName(user.first_name)
      }
    } else {
      if (typeof window !== 'undefined') {
        const testName = localStorage.getItem('testUserName') || ''
        if (testName) {
          setUserName(testName)
        }
      }
    }
  }, [webApp])

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
        flag: getCountryFlag(country.code),
        region: country.region,
        type: country.type || 'local',
      }))
      
      setCountries(formattedCountries)
    } catch (error: any) {
      console.error('Ошибка загрузки стран:', error)
      console.error('Детали ошибки:', error.response?.data || error.message)
      // Fallback на моковые данные
      setCountries([
        { id: '1', name: 'Таиланд', code: 'TH', price: '$4.00 USD', flag: '🇹🇭', region: 'Азия' },
        { id: '2', name: 'Нидерланды', code: 'NL', price: '$4.00 USD', flag: '🇳🇱', region: 'Европа' },
        { id: '3', name: 'Турция', code: 'TR', price: '$5.00 USD', flag: '🇹🇷', region: 'Европа' },
        { id: '4', name: 'ОАЭ', code: 'AE', price: '$6.00 USD', flag: '🇦🇪', region: 'Ближний Восток' },
        { id: '5', name: 'Египет', code: 'EG', price: '$7.00 USD', flag: '🇪🇬', region: 'Африка' },
        { id: '6', name: 'Испания', code: 'ES', price: '$4.50 USD', flag: '🇪🇸', region: 'Европа' },
        { id: '7', name: 'Италия', code: 'IT', price: '$4.50 USD', flag: '🇮🇹', region: 'Европа' },
        { id: '8', name: 'Греция', code: 'GR', price: '$5.00 USD', flag: '🇬🇷', region: 'Европа' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const tabs = ['Популярные', 'Местные', 'Региональный', 'Международный']

  // Фильтрация по поиску и типу тарифа
  let filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false
    
    // Фильтрация по типу тарифа
    if (activeTab === 'Популярные') {
      return true // Показываем все для популярных
    } else if (activeTab === 'Местные') {
      return country.type === 'local'
    } else if (activeTab === 'Региональный') {
      return country.type === 'regional'
    } else if (activeTab === 'Международный') {
      return country.type === 'international'
    }
    
    return true
  })
  
  // Для популярных сортируем по цене и берем топ-200
  if (activeTab === 'Популярные') {
    filteredCountries = filteredCountries
      .sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
        return priceA - priceB
      })
      .slice(0, 200)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-20">
      {/* Top Bar with Airmoney and Logo - более стильный */}
      <div className="bg-gradient-to-r from-white to-[#FFF8F5] px-4 py-3 flex justify-between items-center shadow-sm relative">
        <div className="flex items-center space-x-2 opacity-0">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">Airmoney</span>
        </div>
        
        {/* Logo по центру */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo className="justify-center" size="md" />
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          $0.00 USD
        </div>
      </div>

      {/* Greeting - более выразительное */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          Здравствуйте,<br />
          <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C69] bg-clip-text text-transparent">
            {userName || 'пользователь'}!
          </span>
        </h1>
      </div>

      {/* Search Bar - улучшенный */}
      <div className="px-4 py-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Где вам нужна eSIM?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 shadow-sm text-base font-medium transition-all"
          />
        </div>
      </div>

      {/* Promo Card - КРАСИВЫЙ с градиентом */}
      <div className="px-4 pb-5">
        <div className="relative bg-gradient-to-br from-[#FF6B35] via-[#FF8C69] to-[#FFA07A] rounded-3xl p-6 shadow-xl overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex-1 pr-4 z-10">
              <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">
                Более удобный способ<br />оставаться на связи
              </h2>
              <p className="text-white/95 text-sm leading-relaxed mb-4">
                Пакет eSIM — это экономная и надежная связь по всему миру. К вашим услугам — 200+ стран и регионов.
              </p>
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span className="text-white text-xs font-semibold">🌍 200+ стран</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <span className="text-white text-xs font-semibold">⚡ Мгновенная активация</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 z-10">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - улучшенные */}
      <div className="px-4 pb-3">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 whitespace-nowrap font-bold text-sm transition-all ${
                activeTab === tab
                  ? 'text-[#FF6B35] border-b-3 border-[#FF6B35]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-600 leading-relaxed">
          Познакомьтесь с нашими самыми популярными eSIM (указаны минимальные цены на пакеты).
        </p>
      </div>

      {/* Countries List - КРАСИВЫЕ карточки */}
      <div className="px-4 py-3 pb-24">
        <div className="space-y-3">
          {filteredCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => router.push(`/tariffs?country=${country.code}&name=${encodeURIComponent(country.name)}`)}
              className="w-full group flex items-center justify-between p-5 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 active:scale-[0.98] border border-gray-100 hover:border-[#FF6B35]/30"
            >
              <div className="flex items-center space-x-4">
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
                <span className="text-lg font-extrabold text-[#FF6B35] mb-0.5">{country.price}</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - улучшенный */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-2xl">
        <div className="flex justify-around py-2.5">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-[#FF6B35] mt-1">Магазин</span>
          </button>
          <button
            onClick={() => router.push('/my-esims')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span className="text-xs text-gray-500 mt-1">Мои eSIM</span>
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs text-gray-500 mt-1">Профиль</span>
          </button>
        </div>
      </div>
    </div>
  )
}
