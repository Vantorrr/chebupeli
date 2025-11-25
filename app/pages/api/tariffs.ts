import type { NextApiRequest, NextApiResponse } from 'next'
import { getMobiMatterClient } from '@/lib/mobimatter'

// Маппинг кодов стран на названия
const COUNTRY_NAMES: Record<string, string> = {
  'TH': 'Таиланд', 'NL': 'Нидерланды', 'TR': 'Турция', 'AE': 'ОАЭ', 'EG': 'Египет',
  'ES': 'Испания', 'IT': 'Италия', 'GR': 'Греция', 'JP': 'Япония', 'SG': 'Сингапур',
  'MV': 'Мальдивы', 'MA': 'Марокко', 'US': 'США', 'GB': 'Великобритания', 'FR': 'Франция',
  'DE': 'Германия', 'CN': 'Китай', 'IN': 'Индия', 'BR': 'Бразилия', 'AU': 'Австралия',
  'ID': 'Индонезия', 'MY': 'Малайзия', 'PH': 'Филиппины', 'VN': 'Вьетнам', 'KR': 'Южная Корея',
  'PT': 'Португалия', 'PL': 'Польша', 'CZ': 'Чехия', 'AT': 'Австрия', 'CH': 'Швейцария',
  'GH': 'Гана', 'VE': 'Венесуэла', 'GL': 'Гренландия',
}

interface Tariff {
  id: string
  country: string
  countryCode: string
  dataGB: number
  days: number
  type: 'Standard' | 'Unlimited'
  price: number
  originalPrice: number
  region?: string
  providerName?: string
  providerLogo?: string
  networkType?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const countryCode = req.query.country as string

    // Пытаемся использовать MobiMatter API
    let tariffs: Tariff[] = []

    try {
      const client = getMobiMatterClient()
      const products = await client.getProducts()

      console.log(`Получено ${products.length} продуктов из MobiMatter API`)

      // Применяем маржу (100% по умолчанию)
      const margin = parseFloat(process.env.TARIFF_MARGIN || '1.0') // 1.0 = 100%

      // Фильтруем только esim_realtime (не addon и не replacement)
      // И фильтруем по стране если указана
      const realtimeProducts = products.filter((product: any) => {
        const isRealtime = product.productCategory === 'esim_realtime'
        const isShown = product.EXTERNALLY_SHOWN !== '0'
        const matchesCountry = !countryCode || 
          (product.countries && Array.isArray(product.countries) && product.countries.includes(countryCode))
        
        return isRealtime && isShown && matchesCountry
      })

      tariffs = realtimeProducts.map((product: any) => {
        const wholesalePrice = product.wholesalePrice || 0
        const priceWithMargin = wholesalePrice * (1 + margin)

        // Парсим productDetails для извлечения данных
        const details: Record<string, any> = {}
        if (product.productDetails && Array.isArray(product.productDetails)) {
          product.productDetails.forEach((detail: any) => {
            if (detail.name && detail.value !== undefined) {
              details[detail.name] = detail.value
            }
          })
        }

        // Извлекаем данные
        const planTitle = details.PLAN_TITLE || ''
        const dataLimit = details.PLAN_DATA_LIMIT ? parseFloat(details.PLAN_DATA_LIMIT) : 0
        const validity = details.PLAN_VALIDITY ? parseFloat(details.PLAN_VALIDITY) : 0
        const isUnlimited = details.UNLIMITED === '1' || planTitle.toLowerCase().includes('unlimited')
        
        // Получаем первую страну из массива или используем переданную
        const productCountry = (product.countries && product.countries.length > 0) 
          ? product.countries[0] 
          : (countryCode || '')

        // Получаем название страны
        const countryName = COUNTRY_NAMES[productCountry] || productCountry

        return {
          id: product.productId || product.uniqueId || product.id,
          country: countryName,
          countryCode: productCountry,
          dataGB: dataLimit || 1,
          days: validity > 0 ? Math.round(validity / 24) : 7, // Конвертируем часы в дни
          type: isUnlimited ? 'Unlimited' : 'Standard',
          price: Math.round(priceWithMargin * 100) / 100, // Округляем до 2 знаков
          originalPrice: wholesalePrice,
          region: (product.regions && product.regions.length > 0) ? product.regions[0] : undefined,
          providerName: product.providerName || 'MobiMatter',
          providerLogo: product.providerLogo || 'SIM',
          networkType: details.NETWORKS_SHORT || '4G',
        }
      })

      // Сортируем по цене
      tariffs.sort((a, b) => a.price - b.price)

      console.log(`Сформировано ${tariffs.length} тарифов для страны ${countryCode || 'все'}`)
    } catch (apiError: any) {
      console.warn('MobiMatter API недоступен, используем моковые данные:', apiError.message)
      
      // Fallback на моковые данные если API недоступен
      const allTariffs: Record<string, Tariff[]> = {
        'TR': [
          { id: '1', country: 'Турция', countryCode: 'TR', dataGB: 5, days: 30, type: 'Standard', price: 990, originalPrice: 495, region: 'Европа' },
          { id: '2', country: 'Турция', countryCode: 'TR', dataGB: 10, days: 30, type: 'Unlimited', price: 1990, originalPrice: 995, region: 'Европа' },
          { id: '3', country: 'Турция', countryCode: 'TR', dataGB: 3, days: 15, type: 'Standard', price: 590, originalPrice: 295, region: 'Европа' },
        ],
        'AE': [
          { id: '4', country: 'ОАЭ', countryCode: 'AE', dataGB: 10, days: 30, type: 'Unlimited', price: 1990, originalPrice: 995, region: 'Ближний Восток' },
          { id: '5', country: 'ОАЭ', countryCode: 'AE', dataGB: 5, days: 30, type: 'Standard', price: 990, originalPrice: 495, region: 'Ближний Восток' },
        ],
        'TH': [
          { id: '6', country: 'Таиланд', countryCode: 'TH', dataGB: 8, days: 15, type: 'Standard', price: 1490, originalPrice: 745, region: 'Азия' },
          { id: '7', country: 'Таиланд', countryCode: 'TH', dataGB: 15, days: 30, type: 'Unlimited', price: 2490, originalPrice: 1245, region: 'Азия' },
        ],
      }

      tariffs = allTariffs[countryCode] || []
      
      // Применяем маржу к моковым данным
      const margin = parseFloat(process.env.TARIFF_MARGIN || '1.0')
      tariffs = tariffs.map(tariff => ({
        ...tariff,
        price: Math.round(tariff.originalPrice * (1 + margin)),
      }))
    }

    res.status(200).json({ tariffs })
  } catch (error: any) {
    console.error('Ошибка загрузки тарифов:', error)
    res.status(500).json({ error: 'Ошибка загрузки тарифов', details: error.message })
  }
}
