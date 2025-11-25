'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Currency = 'USD' | 'RUB'

interface CurrencyContextType {
  currency: Currency
  toggleCurrency: () => void
  formatPrice: (priceInUsd: number) => string
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  toggleCurrency: () => {},
  formatPrice: () => '',
})

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD')

  useEffect(() => {
    // Загружаем сохраненную валюту при старте
    const saved = localStorage.getItem('velaro_currency') as Currency
    if (saved && (saved === 'USD' || saved === 'RUB')) {
      setCurrency(saved)
    }
  }, [])

  const toggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'RUB' : 'USD'
    setCurrency(newCurrency)
    localStorage.setItem('velaro_currency', newCurrency)
  }

  const formatPrice = (priceInUsd: number) => {
    if (currency === 'RUB') {
      // Примерный курс, в реальности можно брать из API или константы
      const rate = 90 
      return `${Math.round(priceInUsd * rate)} ₽`
    }
    return `$${priceInUsd.toFixed(2)} USD`
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

