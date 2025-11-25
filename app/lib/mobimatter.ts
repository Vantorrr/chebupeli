import axios, { AxiosInstance } from 'axios'

const MOBIMATTER_BASE_URL = 'https://api.mobimatter.com/mobimatter'

export interface MobiMatterProduct {
  id: string
  title: string
  description?: string
  countryCode?: string
  countryName?: string
  dataGB?: number
  days?: number
  wholesalePrice: number
  retailPrice?: number
  currency?: string
  category?: string
  region?: string
  productId?: string
  uniqueId?: string
  countries?: string[]
  regions?: string[]
  productCategory?: string
  EXTERNALLY_SHOWN?: string
  productDetails?: Array<{ name: string; value: string }>
  providerName?: string
  providerLogo?: string
}

export interface MobiMatterOrder {
  id: string
  productId: string
  status: string
  qrCode?: string
  activationCode?: string
  smdpAddress?: string
  iccid?: string
  createdAt?: string
  orderId?: string
}

export class MobiMatterClient {
  private api: AxiosInstance
  private merchantId: string
  private apiKey: string

  constructor(merchantId: string, apiKey: string) {
    this.merchantId = merchantId
    this.apiKey = apiKey

    this.api = axios.create({
      baseURL: MOBIMATTER_BASE_URL,
      headers: {
        'merchantId': merchantId,
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    // Добавляем interceptor для логирования
    this.api.interceptors.request.use(
      (config) => {
        console.log('MobiMatter API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
        })
        return config
      },
      (error) => {
        console.error('MobiMatter API Request Error:', error)
        return Promise.reject(error)
      }
    )

    this.api.interceptors.response.use(
      (response) => {
        console.log('MobiMatter API Response:', {
          status: response.status,
          url: response.config.url,
          dataLength: JSON.stringify(response.data).length,
        })
        return response
      },
      (error) => {
        console.error('MobiMatter API Response Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        })
        return Promise.reject(error)
      }
    )
  }

  /**
   * Получить список всех доступных продуктов
   * Правильный эндпоинт: GET /api/v2/products
   */
  async getProducts(params?: {
    countryCode?: string
    category?: string
    region?: string
  }): Promise<MobiMatterProduct[]> {
    try {
      const response = await this.api.get('/api/v2/products', { params })
      
      // Проверяем структуру ответа
      const dataType = typeof response.data
      const isArray = Array.isArray(response.data)
      const keys = response.data && typeof response.data === 'object' && !Array.isArray(response.data) ? Object.keys(response.data) : []
      
      console.log('MobiMatter getProducts response:', {
        status: response.status,
        dataType,
        isArray,
        keys: keys.slice(0, 10),
        dataLength: JSON.stringify(response.data).length,
        firstChars: JSON.stringify(response.data).substring(0, 100),
      })
      
      // API возвращает объект с ключами statusCode и result
      // Продукты находятся в result
      if (response.data.result && Array.isArray(response.data.result)) {
        console.log(`Получено ${response.data.result.length} продуктов (response.data.result)`)
        return response.data.result
      } else if (Array.isArray(response.data)) {
        console.log(`Получено ${response.data.length} продуктов (массив)`)
        return response.data
      } else if (response.data.products && Array.isArray(response.data.products)) {
        console.log(`Получено ${response.data.products.length} продуктов (response.data.products)`)
        return response.data.products
      } else if (response.data.data && Array.isArray(response.data.data)) {
        console.log(`Получено ${response.data.data.length} продуктов (response.data.data)`)
        return response.data.data
      } else {
        console.warn('Неожиданный формат ответа API:', {
          type: typeof response.data,
          isArray: Array.isArray(response.data),
          keys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'N/A',
          sample: JSON.stringify(response.data).substring(0, 200),
        })
        return []
      }
    } catch (error: any) {
      console.error('MobiMatter API Error (getProducts):', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      })
      throw new Error(`Failed to fetch products: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Получить продукт по ID
   */
  async getProduct(productId: string): Promise<MobiMatterProduct> {
    try {
      const response = await this.api.get(`/api/v2/products/${productId}`)
      return response.data.product || response.data.data || response.data
    } catch (error: any) {
      console.error('MobiMatter API Error (getProduct):', error.response?.data || error.message)
      throw new Error(`Failed to fetch product: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Создать заказ на покупку eSIM
   * Правильный эндпоинт: POST /api/v2/order
   */
  async createOrder(productId: string, metadata?: Record<string, any>): Promise<MobiMatterOrder> {
    try {
      const response = await this.api.post('/api/v2/order', {
        productId,
        label: metadata?.label || `order_${Date.now()}`,
        ...metadata,
      })
      
      // API возвращает объект заказа
      const orderData = response.data.order || response.data.data || response.data
      return {
        id: orderData.orderId || orderData.id,
        orderId: orderData.orderId || orderData.id,
        productId: orderData.productId || productId,
        status: orderData.status || 'pending',
        qrCode: orderData.qrCode,
        activationCode: orderData.activationCode || orderData.smdpAddress,
        smdpAddress: orderData.smdpAddress,
        iccid: orderData.iccid,
        createdAt: orderData.createdAt || new Date().toISOString(),
      }
    } catch (error: any) {
      console.error('MobiMatter API Error (createOrder):', error.response?.data || error.message)
      throw new Error(`Failed to create order: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Получить информацию о заказе
   * Правильный эндпоинт: GET /api/v2/order/:orderId
   */
  async getOrder(orderId: string): Promise<MobiMatterOrder> {
    try {
      const response = await this.api.get(`/api/v2/order/${orderId}`)
      
      const orderData = response.data.order || response.data.data || response.data
      return {
        id: orderData.orderId || orderData.id || orderId,
        orderId: orderData.orderId || orderData.id || orderId,
        productId: orderData.productId,
        status: orderData.status,
        qrCode: orderData.qrCode,
        activationCode: orderData.activationCode || orderData.smdpAddress,
        smdpAddress: orderData.smdpAddress,
        iccid: orderData.iccid,
        createdAt: orderData.createdAt,
      }
    } catch (error: any) {
      console.error('MobiMatter API Error (getOrder):', error.response?.data || error.message)
      throw new Error(`Failed to fetch order: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Получить список заказов пользователя
   */
  async getOrders(userId?: string): Promise<MobiMatterOrder[]> {
    try {
      const params = userId ? { userId } : {}
      const response = await this.api.get('/api/v2/orders', { params })
      
      if (Array.isArray(response.data)) {
        return response.data.map((order: any) => ({
          id: order.orderId || order.id,
          orderId: order.orderId || order.id,
          productId: order.productId,
          status: order.status,
          qrCode: order.qrCode,
          activationCode: order.activationCode || order.smdpAddress,
          smdpAddress: order.smdpAddress,
          iccid: order.iccid,
          createdAt: order.createdAt,
        }))
      } else if (response.data.orders && Array.isArray(response.data.orders)) {
        return response.data.orders
      } else if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data
      }
      return []
    } catch (error: any) {
      console.error('MobiMatter API Error (getOrders):', error.response?.data || error.message)
      throw new Error(`Failed to fetch orders: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Получить баланс кошелька
   */
  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await this.api.get('/api/v2/wallet/balance')
      return response.data
    } catch (error: any) {
      console.error('MobiMatter API Error (getWalletBalance):', error.response?.data || error.message)
      throw new Error(`Failed to fetch wallet balance: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Получить список стран (извлекаем из продуктов)
   */
  async getCountries(): Promise<Array<{ code: string; name: string; region?: string }>> {
    // Пытаемся получить продукты и извлечь из них страны
    try {
      const products = await this.getProducts()
      const countrySet = new Set<string>()
      
      products.forEach((product: any) => {
        if (product.countries && Array.isArray(product.countries)) {
          product.countries.forEach((code: string) => {
            countrySet.add(code)
          })
        }
      })

      return Array.from(countrySet).map(code => ({
        code,
        name: code, // Будет заменено на реальное название в API роуте
        region: undefined,
      }))
    } catch (error) {
      console.error('Не удалось получить страны из продуктов:', error)
      throw error
    }
  }
}

// Singleton instance
let mobimatterClient: MobiMatterClient | null = null

export function getMobiMatterClient(): MobiMatterClient {
  if (!mobimatterClient) {
    const merchantId = process.env.MOBIMATTER_MERCHANT_ID
    const apiKey = process.env.MOBIMATTER_API_KEY

    if (!merchantId || !apiKey) {
      throw new Error('MobiMatter credentials not configured. Please set MOBIMATTER_MERCHANT_ID and MOBIMATTER_API_KEY environment variables.')
    }

    mobimatterClient = new MobiMatterClient(merchantId, apiKey)
  }

  return mobimatterClient
}
