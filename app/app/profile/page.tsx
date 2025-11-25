'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import { Logo } from '@/components/Logo'

export default function ProfilePage() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [userName, setUserName] = useState('')

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

  const menuItems = [
    { name: 'Информация об аккаунте', icon: '📝' },
    { name: 'Доверенные устройства', icon: '📱' },
    { name: 'Airmoney и участие в программе', icon: '💰' },
    { name: 'Сохраненные карты', icon: '💳' },
    { name: 'Приглашайте и зарабатывайте', icon: '🤝' },
    { name: 'Заказы', icon: '📦' },
    { name: 'Airalo для бизнеса', icon: '💼' },
    { name: 'Языки', icon: '🌐' },
    { name: 'Валюта: Доллар США (USD) $', icon: '💲' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-20">
      {/* Top Bar with Airmoney and Logo */}
      <div className="bg-gradient-to-r from-white to-[#FFF8F5] px-4 py-3 flex justify-between items-center shadow-sm relative">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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

      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-3xl font-extrabold text-gray-900">Профиль</h1>
      </div>

      {/* Promo Banner - улучшенный */}
      <div className="px-4 py-3">
        <button className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 rounded-2xl p-5 flex items-center justify-between shadow-xl active:scale-[0.98] transition-transform overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-base font-bold text-white">
              Получайте Airmoney за каждого реферала
            </span>
          </div>
          <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* User Profile - улучшенный */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] via-[#FF8C69] to-[#FFA07A] rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl font-extrabold text-white">
                  {userName ? userName[0].toUpperCase() : 'П'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div>
              <p className="text-xl font-extrabold text-gray-900 mb-1">{userName || 'Пользователь'}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Путешественник</span>
                <span className="text-lg">✈️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items - улучшенные */}
      <div className="px-4 py-2 pb-24">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-md hover:shadow-xl transition-all mb-2 active:scale-[0.98] border border-gray-100 hover:border-[#FF6B35]/30 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-base font-semibold text-gray-900">{item.name}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-2xl">
        <div className="flex justify-around py-2.5">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs text-gray-500 mt-1">Магазин</span>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-[#FF6B35] mt-1">Профиль</span>
          </button>
        </div>
      </div>
    </div>
  )
}
