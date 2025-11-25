'use client'

import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import { Logo } from '@/components/Logo'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (webApp) {
      setUser(webApp.initDataUnsafe?.user)
    }
  }, [webApp])

  const menuItems = [
    {
      section: 'Аккаунт',
      items: [
        { 
          icon: '👤', 
          title: 'Мои данные', 
          action: () => webApp?.showAlert('Данные берутся из Telegram автоматически') 
        },
        { 
          icon: '💳', 
          title: 'Способы оплаты', 
          subtitle: 'Карты, Apple Pay',
          action: () => webApp?.showAlert('Оплата производится при покупке') 
        },
      ]
    },
    {
      section: 'Управление eSIM',
      items: [
        { 
          icon: '📲', 
          title: 'Мои eSIM', 
          subtitle: 'Активные и архивные',
          action: () => router.push('/my-esims')
        },
        { 
          icon: '🔧', 
          title: 'Установка eSIM', 
          subtitle: 'Инструкции по настройке',
          action: () => webApp?.showAlert('Инструкции доступны внутри купленной eSIM') 
        },
      ]
    },
    {
      section: 'Поддержка',
      items: [
        { 
          icon: '💬', 
          title: 'Центр поддержки', 
          subtitle: 'Чат с оператором',
          action: () => router.push('/support') 
        },
        { 
          icon: '❓', 
          title: 'Вопросы и ответы', 
          action: () => router.push('/faq') 
        },
      ]
    },
    {
      section: 'О приложении',
      items: [
        { 
          icon: '📄', 
          title: 'Правовая информация', 
          action: () => router.push('/legal') 
        },
        { 
          icon: '📤', 
          title: 'Поделиться с другом', 
          subtitle: 'Получите бонусы',
          action: () => {
            const url = 'https://t.me/velaro_esim_bot';
            const text = 'Попробуй Velaro для путешествий! 🌍';
            if (webApp?.openTelegramLink) {
              webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
            } else {
              window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
            }
          }
        },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F0] pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2 opacity-0">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">Airmoney</span>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo size="md" />
        </div>
        
        <div className="bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          $0.00 USD
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] rounded-full flex items-center justify-center text-3xl text-white shadow-lg border-4 border-white">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{user?.first_name?.[0] || '👤'}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.first_name || 'Гость'} {user?.last_name || ''}
            </h1>
            <p className="text-gray-500 text-sm">
              {user?.username ? `@${user.username}` : 'Путешественник'}
            </p>
          </div>
        </div>

        {/* Referral Banner */}
        <div className="bg-gradient-to-r from-[#2F3542] to-[#1A1A1A] rounded-2xl p-5 shadow-xl text-white mb-8 relative overflow-hidden group cursor-pointer active:scale-95 transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">Пригласите друга</h3>
            <p className="text-gray-300 text-sm mb-3">Получите $3 USD за каждого друга</p>
            <div className="inline-flex items-center text-[#FF6B35] font-bold text-sm bg-white/10 px-3 py-1.5 rounded-lg">
              Поделиться кодом <span className="ml-2">→</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-6">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                {section.section}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100 ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around py-3">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center w-1/3 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-500 mt-1">Магазин</span>
          </button>
          <button
            onClick={() => router.push('/my-esims')}
            className="flex flex-col items-center w-1/3 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-500 mt-1">Мои eSIM</span>
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center w-1/3 active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] flex items-center justify-center -mt-4 shadow-lg border-4 border-white">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-[#FF6B35] mt-1">Профиль</span>
          </button>
        </div>
      </div>
    </div>
  )
}
