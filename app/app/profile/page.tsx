'use client'

import { useRouter } from 'next/navigation'
import { useTelegram } from '@/components/TelegramProvider'
import { Logo } from '@/components/Logo'
import { useEffect, useState } from 'react'

// Иконки (SVG Components)
const Icons = {
  User: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  Card: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
  ),
  Sim: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
  ),
  Support: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
  ),
  Doc: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  ),
  Share: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
  ),
  Currency: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [user, setUser] = useState<any>(null)
  const [currency, setCurrency] = useState('USD')

  useEffect(() => {
    if (webApp) {
      setUser(webApp.initDataUnsafe?.user)
    }
    // Загружаем сохраненную валюту
    const savedCurrency = localStorage.getItem('velaro_currency')
    if (savedCurrency) setCurrency(savedCurrency)
  }, [webApp])

  const toggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'RUB' : 'USD'
    setCurrency(newCurrency)
    localStorage.setItem('velaro_currency', newCurrency)
    // Здесь можно добавить логику обновления цен во всем приложении через Context или Event
  }

  const menuSections = [
    {
      title: 'Аккаунт',
      items: [
        { 
          icon: Icons.User, 
          title: 'Мои данные', 
          subtitle: 'Имя, email, телефон',
          action: () => webApp?.showAlert('Данные берутся из Telegram') 
        },
        { 
          icon: Icons.Card, 
          title: 'Сохраненные карты', 
          subtitle: 'Управление методами оплаты',
          action: () => webApp?.showAlert('Управление картами доступно при оплате') 
        },
      ]
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: Icons.Currency,
          title: 'Валюта',
          subtitle: 'Выберите валюту отображения',
          value: currency === 'USD' ? '$ USD' : '₽ RUB',
          action: toggleCurrency,
          isToggle: true
        }
      ]
    },
    {
      title: 'Управление eSIM',
      items: [
        { 
          icon: Icons.Sim, 
          title: 'Мои eSIM',
          subtitle: 'Управление установленными eSIM',
          action: () => router.push('/my-esims')
        },
      ]
    },
    {
      title: 'Информация',
      items: [
        { 
          icon: Icons.Support, 
          title: 'Поддержка',
          subtitle: 'FAQ и связь с командой',
          action: () => router.push('/support') 
        },
        { 
          icon: Icons.Doc, 
          title: 'Правовая информация',
          subtitle: 'Оферта и конфиденциальность',
          action: () => router.push('/legal') 
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
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] rounded-full flex items-center justify-center text-3xl text-white shadow-lg border-4 border-white overflow-hidden">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
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
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
                {section.title}
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100 group ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-400 group-hover:text-[#FF6B35] transition-colors">
                        <item.icon />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-xs text-gray-500">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Отображение значения (например для валюты) */}
                      {item.value && (
                        <span className="text-sm font-bold text-[#FF6B35] bg-[#FF6B35]/10 px-2 py-1 rounded-md">
                          {item.value}
                        </span>
                      )}
                      
                      {/* Стрелочка или иконка смены */}
                      <div className="text-gray-300">
                        {item.isToggle ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        ) : (
                          <Icons.ChevronRight />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-2xl z-50">
        <div className="flex justify-around py-2.5">
          <button
            onClick={() => router.push('/')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform w-1/3"
          >
            <svg className="w-6 h-6 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-[10px] font-medium text-gray-500 mt-1">Магазин</span>
          </button>
          <button
            onClick={() => router.push('/my-esims')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform w-1/3"
          >
            <svg className="w-6 h-6 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
            <span className="text-[10px] font-medium text-gray-500 mt-1">Мои eSIM</span>
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="flex flex-col items-center py-1 active:scale-95 transition-transform w-1/3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C69] flex items-center justify-center shadow-lg -mt-4 border-4 border-white">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-[#FF6B35] mt-1">Профиль</span>
          </button>
        </div>
      </div>
    </div>
  )
}
