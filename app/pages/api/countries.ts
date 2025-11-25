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
  'GH': 'Гана', 'VE': 'Венесуэла', 'GL': 'Гренландия', 'GH': 'Гана',
}

// Маппинг регионов
const COUNTRY_REGIONS: Record<string, string> = {
  'TH': 'Азия', 'NL': 'Европа', 'TR': 'Европа', 'AE': 'Ближний Восток', 'EG': 'Африка',
  'ES': 'Европа', 'IT': 'Европа', 'GR': 'Европа', 'JP': 'Азия', 'SG': 'Азия',
  'MV': 'Азия', 'MA': 'Африка', 'US': 'Северная Америка', 'GB': 'Европа', 'FR': 'Европа',
  'DE': 'Европа', 'CN': 'Азия', 'IN': 'Азия', 'BR': 'Южная Америка', 'AU': 'Океания',
  'ID': 'Азия', 'MY': 'Азия', 'PH': 'Азия', 'VN': 'Азия', 'KR': 'Азия',
  'PT': 'Европа', 'PL': 'Европа', 'CZ': 'Европа', 'AT': 'Европа', 'CH': 'Европа',
  'GH': 'Африка', 'VE': 'Южная Америка', 'GL': 'Северная Америка',
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Кеш для ускорения (кешируем на 5 минут)
    const CACHE_KEY = 'countries_cache'
    const CACHE_TTL = 5 * 60 * 1000 // 5 минут
    
    // Простой in-memory кеш (в продакшене лучше использовать Redis)
    if (typeof (global as any).countriesCache === 'undefined') {
      (global as any).countriesCache = { data: null, timestamp: 0 }
    }
    
    const cache = (global as any).countriesCache
    const now = Date.now()
    
    // Проверяем кеш
    if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
      console.log('Используем кешированные данные стран')
      return res.status(200).json({ countries: cache.data })
    }
    
    let countries: Array<{ code: string; name: string; region?: string; minPrice?: number; type?: 'local' | 'regional' | 'international' }> = []

    try {
      const client = getMobiMatterClient()
      
      // Получаем все продукты
      console.log('Запрос продуктов из MobiMatter API...')
      const products = await client.getProducts()
      console.log(`Получено ${products.length} продуктов`)
      
      if (products.length === 0) {
        console.warn('API вернул 0 продуктов, используем моковые данные')
        throw new Error('No products returned from API')
      }
      
      // Логируем первые несколько продуктов для отладки
      if (products.length > 0) {
        const sample = products[0]
        const externallyShown = sample.productDetails?.find((d: any) => d.name === 'EXTERNALLY_SHOWN')
        console.log('Пример продукта:', {
          productCategory: sample.productCategory,
          EXTERNALLY_SHOWN: externallyShown?.value,
          countries: sample.countries,
          wholesalePrice: sample.wholesalePrice,
          hasProductDetails: !!sample.productDetails,
        })
      }

      // Фильтруем только esim_realtime
      // EXTERNALLY_SHOWN находится в productDetails массиве!
      const realtimeProducts = products.filter((product: any) => {
        const isRealtime = product.productCategory === 'esim_realtime'
        
        // Ищем EXTERNALLY_SHOWN в productDetails
        let isShown = false
        if (product.productDetails && Array.isArray(product.productDetails)) {
          const externallyShown = product.productDetails.find((d: any) => d.name === 'EXTERNALLY_SHOWN')
          isShown = externallyShown && (externallyShown.value === '1' || externallyShown.value === 1)
        }
        
        return isRealtime && isShown
      })
      
      console.log(`Отфильтровано ${realtimeProducts.length} реальных продуктов из ${products.length}`)

      // Группируем по странам и находим минимальную цену и тип тарифа
      const countryPrices: Record<string, number> = {}
      const countryTypes: Record<string, 'local' | 'regional' | 'international'> = {}
      const countrySet = new Set<string>()

      realtimeProducts.forEach((product: any) => {
        if (product.countries && Array.isArray(product.countries) && product.countries.length > 0) {
          const countryCount = product.countries.length
          
          // Определяем тип тарифа по количеству стран
          let tariffType: 'local' | 'regional' | 'international' = 'local'
          if (countryCount === 1) {
            tariffType = 'local'
          } else if (countryCount >= 2 && countryCount <= 10) {
            tariffType = 'regional'
          } else if (countryCount > 10) {
            tariffType = 'international'
          }
          
          product.countries.forEach((code: string) => {
            if (code && code.length === 2) { // Проверяем что это валидный код страны
              countrySet.add(code)
              
              if (product.wholesalePrice) {
                const margin = parseFloat(process.env.TARIFF_MARGIN || '1.0')
                const price = product.wholesalePrice * (1 + margin)
                
                // Обновляем цену если она меньше или если тип тарифа более подходящий
                if (!countryPrices[code] || price < countryPrices[code]) {
                  countryPrices[code] = price
                  // Для местных тарифов приоритет выше
                  if (tariffType === 'local' || !countryTypes[code]) {
                    countryTypes[code] = tariffType
                  }
                }
              }
            }
          })
        }
      })
      
      console.log(`Найдено ${countrySet.size} уникальных стран`)

      // Формируем список стран
      countries = Array.from(countrySet).map(code => ({
        code,
        name: COUNTRY_NAMES[code] || code,
        region: COUNTRY_REGIONS[code] || 'Другое',
        minPrice: countryPrices[code],
        type: countryTypes[code] || 'local',
      }))

      // Сортируем: сначала по типу (local > regional > international), потом по цене
      countries.sort((a, b) => {
        const typeOrder = { local: 0, regional: 1, international: 2 }
        const typeDiff = (typeOrder[a.type || 'local'] || 0) - (typeOrder[b.type || 'local'] || 0)
        if (typeDiff !== 0) return typeDiff
        return (a.minPrice || 0) - (b.minPrice || 0)
      })

      console.log(`Сформировано ${countries.length} стран`)
      
      // Сохраняем в кеш
      cache.data = countries
      cache.timestamp = Date.now()
    } catch (apiError: any) {
      console.error('MobiMatter API Error:', {
        message: apiError.message,
        response: apiError.response?.data,
        status: apiError.response?.status,
        stack: apiError.stack,
      })
      console.warn('Используем моковые данные из-за ошибки API')
      
      // Fallback на моковые данные
      countries = [
        { code: 'TH', name: 'Таиланд', region: 'Азия', minPrice: 4.00 },
        { code: 'NL', name: 'Нидерланды', region: 'Европа', minPrice: 4.00 },
        { code: 'TR', name: 'Турция', region: 'Европа', minPrice: 5.00 },
        { code: 'AE', name: 'ОАЭ', region: 'Ближний Восток', minPrice: 6.00 },
        { code: 'EG', name: 'Египет', region: 'Африка', minPrice: 7.00 },
        { code: 'ES', name: 'Испания', region: 'Европа', minPrice: 4.50 },
        { code: 'IT', name: 'Италия', region: 'Европа', minPrice: 4.50 },
        { code: 'GR', name: 'Греция', region: 'Европа', minPrice: 5.00 },
      ]
    }

    res.status(200).json({ countries })
  } catch (error: any) {
    console.error('Ошибка загрузки стран:', error)
    res.status(500).json({ error: 'Ошибка загрузки стран', details: error.message })
  }
}
