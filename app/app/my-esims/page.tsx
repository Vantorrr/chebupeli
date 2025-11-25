'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'

export default function MyESimsPage() {
  const router = useRouter()
  const { webApp } = useTelegram()

  useEffect(() => {
    if (webApp) {
      webApp.ready()
      webApp.expand()
    }
  }, [webApp])

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">Мои eSIM</h1>
      </div>

      {/* Empty State - улучшенный */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">📲</span>
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">У вас пока нет eSIM</h2>
        <p className="text-sm text-gray-600 text-center mb-8 max-w-xs leading-relaxed">
          Купите свой первый пакет eSIM, чтобы начать путешествовать с интернетом
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C69] text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl hover:shadow-2xl active:scale-95 transition-all"
        >
          Купить eSIM
        </button>
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <span className="text-xs font-bold text-[#FF6B35] mt-1">Мои eSIM</span>
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
