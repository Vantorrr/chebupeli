import type { NextApiRequest, NextApiResponse } from 'next'
import { getMobiMatterClient } from '@/lib/mobimatter'

// Маппинг кодов стран на названия (полный список)
const COUNTRY_NAMES: Record<string, string> = {
  'AF': 'Афганистан', 'AL': 'Албания', 'DZ': 'Алжир', 'AS': 'Американское Самоа', 'AD': 'Андорра',
  'AO': 'Ангола', 'AI': 'Ангилья', 'AG': 'Антигуа и Барбуда', 'AR': 'Аргентина', 'AM': 'Армения',
  'AW': 'Аруба', 'AU': 'Австралия', 'AT': 'Австрия', 'AZ': 'Азербайджан', 'BS': 'Багамы',
  'BH': 'Бахрейн', 'BD': 'Бангладеш', 'BB': 'Барбадос', 'BY': 'Беларусь', 'BE': 'Бельгия',
  'BZ': 'Белиз', 'BJ': 'Бенин', 'BM': 'Бермуды', 'BT': 'Бутан', 'BO': 'Боливия',
  'BA': 'Босния и Герцеговина', 'BW': 'Ботсвана', 'BR': 'Бразилия', 'VG': 'Британские Виргинские о-ва',
  'BN': 'Бруней', 'BG': 'Болгария', 'BF': 'Буркина-Фасо', 'BI': 'Бурунди', 'KH': 'Камбоджа',
  'CM': 'Камерун', 'CA': 'Канада', 'CV': 'Кабо-Верде', 'KY': 'Каймановы о-ва', 'CF': 'ЦАР',
  'TD': 'Чад', 'CL': 'Чили', 'CN': 'Китай', 'CO': 'Колумбия', 'KM': 'Коморы',
  'CG': 'Конго', 'CD': 'ДР Конго', 'CK': 'О-ва Кука', 'CR': 'Коста-Рика', 'HR': 'Хорватия',
  'CU': 'Куба', 'CW': 'Кюрасао', 'CY': 'Кипр', 'CZ': 'Чехия', 'DK': 'Дания',
  'DJ': 'Джибути', 'DM': 'Доминика', 'DO': 'Доминиканская Республика', 'EC': 'Эквадор', 'EG': 'Египет',
  'SV': 'Сальвадор', 'GQ': 'Экваториальная Гвинея', 'ER': 'Эритрея', 'EE': 'Эстония', 'ET': 'Эфиопия',
  'FK': 'Фолклендские о-ва', 'FO': 'Фарерские о-ва', 'FJ': 'Фиджи', 'FI': 'Финляндия', 'FR': 'Франция',
  'GF': 'Французская Гвиана', 'PF': 'Французская Полинезия', 'GA': 'Габон', 'GM': 'Гамбия', 'GE': 'Грузия',
  'DE': 'Германия', 'GH': 'Гана', 'GI': 'Гибралтар', 'GR': 'Греция', 'GL': 'Гренландия',
  'GD': 'Гренада', 'GP': 'Гваделупа', 'GU': 'Гуам', 'GT': 'Гватемала', 'GG': 'Гернси',
  'GN': 'Гвинея', 'GW': 'Гвинея-Бисау', 'GY': 'Гайана', 'HT': 'Гаити', 'HN': 'Гондурас',
  'HK': 'Гонконг', 'HU': 'Венгрия', 'IS': 'Исландия', 'IN': 'Индия', 'ID': 'Индонезия',
  'IR': 'Иран', 'IQ': 'Ирак', 'IE': 'Ирландия', 'IM': 'Остров Мэн', 'IL': 'Израиль',
  'IT': 'Италия', 'CI': 'Кот-д’Ивуар', 'JM': 'Ямайка', 'JP': 'Япония', 'JE': 'Джерси',
  'JO': 'Иордания', 'KZ': 'Казахстан', 'KE': 'Кения', 'KI': 'Кирибати', 'XK': 'Косово',
  'KW': 'Кувейт', 'KG': 'Киргизия', 'LA': 'Лаос', 'LV': 'Латвия', 'LB': 'Ливан',
  'LS': 'Лесото', 'LR': 'Либерия', 'LY': 'Ливия', 'LI': 'Лихтенштейн', 'LT': 'Литва',
  'LU': 'Люксембург', 'MO': 'Макао', 'MK': 'Северная Македония', 'MG': 'Мадагаскар', 'MW': 'Малави',
  'MY': 'Малайзия', 'MV': 'Мальдивы', 'ML': 'Мали', 'MT': 'Мальта', 'MH': 'Маршалловы о-ва',
  'MQ': 'Мартиника', 'MR': 'Мавритания', 'MU': 'Маврикий', 'YT': 'Майотта', 'MX': 'Мексика',
  'FM': 'Микронезия', 'MD': 'Молдова', 'MC': 'Монако', 'MN': 'Монголия', 'ME': 'Черногория',
  'MS': 'Монтсеррат', 'MA': 'Марокко', 'MZ': 'Мозамбик', 'MM': 'Мьянма', 'NA': 'Намибия',
  'NR': 'Науру', 'NP': 'Непал', 'NL': 'Нидерланды', 'NC': 'Новая Каледония', 'NZ': 'Новая Зеландия',
  'NI': 'Никарагуа', 'NE': 'Нигер', 'NG': 'Нигерия', 'NU': 'Ниуэ', 'NF': 'Норфолк',
  'MP': 'Северные Марианские о-ва', 'NO': 'Норвегия', 'OM': 'Оман', 'PK': 'Пакистан', 'PW': 'Палау',
  'PS': 'Палестина', 'PA': 'Панама', 'PG': 'Папуа — Новая Гвинея', 'PY': 'Парагвай', 'PE': 'Перу',
  'PH': 'Филиппины', 'PL': 'Польша', 'PT': 'Португалия', 'PR': 'Пуэрто-Рико', 'QA': 'Катар',
  'RE': 'Реюньон', 'RO': 'Румыния', 'RU': 'Россия', 'RW': 'Руанда', 'BL': 'Сен-Бартелеми',
  'SH': 'Остров Святой Елены', 'KN': 'Сент-Китс и Невис', 'LC': 'Сент-Люсия', 'MF': 'Сен-Мартен', 'PM': 'Сен-Пьер и Микелон',
  'VC': 'Сент-Винсент и Гренадины', 'WS': 'Самоа', 'SM': 'Сан-Марино', 'ST': 'Сан-Томе и Принсипи', 'SA': 'Саудовская Аравия',
  'SN': 'Сенегал', 'RS': 'Сербия', 'SC': 'Сейшелы', 'SL': 'Сьерра-Леоне', 'SG': 'Сингапур',
  'SX': 'Синт-Мартен', 'SK': 'Словакия', 'SI': 'Словения', 'SB': 'Соломоновы о-ва', 'SO': 'Сомали',
  'ZA': 'ЮАР', 'KR': 'Южная Корея', 'SS': 'Южный Судан', 'ES': 'Испания', 'LK': 'Шри-Ланка',
  'SD': 'Судан', 'SR': 'Суринам', 'SJ': 'Шпицберген и Ян-Майен', 'SZ': 'Эсватини', 'SE': 'Швеция',
  'CH': 'Швейцария', 'SY': 'Сирия', 'TW': 'Тайвань', 'TJ': 'Таджикистан', 'TZ': 'Танзания',
  'TH': 'Таиланд', 'TL': 'Тимор-Лесте', 'TG': 'Того', 'TK': 'Токелау', 'TO': 'Тонга',
  'TT': 'Тринидад и Тобаго', 'TN': 'Тунис', 'TR': 'Турция', 'TM': 'Туркменистан', 'TC': 'Теркс и Кайкос',
  'TV': 'Тувалу', 'UG': 'Уганда', 'UA': 'Украина', 'AE': 'ОАЭ', 'GB': 'Великобритания',
  'US': 'США', 'UY': 'Уругвай', 'UZ': 'Узбекистан', 'VU': 'Вануату', 'VE': 'Венесуэла',
  'VN': 'Вьетнам', 'WF': 'Уоллис и Футуна', 'YE': 'Йемен', 'ZM': 'Замбия', 'ZW': 'Зимбабве'
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
  'RU': 'Европа', 'UA': 'Европа', 'KZ': 'Азия', 'BY': 'Европа', 'UZ': 'Азия',
  'TJ': 'Азия', 'KG': 'Азия', 'AM': 'Азия', 'AZ': 'Азия', 'GE': 'Азия',
  'MD': 'Европа', 'TM': 'Азия', 'LV': 'Европа', 'LT': 'Европа', 'EE': 'Европа'
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
