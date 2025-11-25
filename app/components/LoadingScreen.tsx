'use client'

import { useEffect, useState } from 'react'
import { Logo } from './Logo'

export const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // Функция скрытия заставки
    const hideLoader = () => {
      setIsVisible(false)
      setTimeout(() => setShouldRender(false), 500)
    }

    // Ждём минимум 1.2 секунды, потом скрываем
    const minTimer = setTimeout(hideLoader, 1200)

    // Максимум 3 секунды на случай если что-то зависло
    const maxTimer = setTimeout(hideLoader, 3000)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [])

  if (!shouldRender) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#F5F5F0] flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Фоновое свечение */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FF8C69] blur-2xl opacity-20 animate-pulse rounded-full scale-150"></div>
        
        {/* Логотип с анимацией появления */}
        <div className="relative z-10 animate-fade-in-up">
          <Logo size="lg" />
        </div>

        {/* Текст или слоган */}
        <div className="mt-6 relative z-10">
          <h2 className="text-gray-800 font-bold text-xl tracking-wide">Velaro</h2>
        </div>

        {/* Индикатор загрузки (точки) */}
        <div className="mt-4 flex space-x-2 z-10">
          <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 bg-[#FF6B35]/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 bg-[#FF6B35]/60 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Нижний копирайт (опционально, для стиля) */}
      <div className="absolute bottom-8 text-gray-400 text-xs font-medium tracking-wider uppercase opacity-60">
        Digital Connectivity
      </div>
    </div>
  )
}

