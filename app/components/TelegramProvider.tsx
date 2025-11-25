'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  showAlert: (message: string) => void
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text: string }> }) => void
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive: boolean) => void
    hideProgress: () => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
  }
}

interface TelegramContextType {
  webApp: TelegramWebApp | null
}

const TelegramContext = createContext<TelegramContextType>({ webApp: null })

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp
      if (tg) {
        setWebApp(tg)
      }
    }
  }, [])

  return (
    <TelegramContext.Provider value={{ webApp }}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  return useContext(TelegramContext)
}

