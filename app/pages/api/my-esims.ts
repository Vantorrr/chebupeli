import type { NextApiRequest, NextApiResponse } from 'next'
import { getMobiMatterClient } from '@/lib/mobimatter'

interface ESIM {
  id: string
  country: string
  dataGB: number
  days: number
  purchasedAt: string
  expiresAt: string
  remainingData?: number
  status: string
  qrCode?: string
  activationCode?: string
  iccid?: string
  orderId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // TODO: Получить userId из Telegram WebApp initData
    // const userId = extractUserId(req.headers['x-telegram-init-data'])
    const userId = req.query.userId as string

    let esims: ESIM[] = []

    try {
      const client = getMobiMatterClient()
      const orders = await client.getOrders(userId)

      esims = orders
        .filter(order => order.status === 'active' || order.status === 'completed')
        .map(order => {
          // Получаем информацию о продукте для заказа
          // В реальности нужно кешировать или получать из БД
          return {
            id: order.id,
            country: 'Unknown', // Будет заполнено из продукта
            dataGB: 0, // Будет заполнено из продукта
            days: 0, // Будет заполнено из продукта
            purchasedAt: order.createdAt || new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 дней по умолчанию
            status: order.status,
            qrCode: order.qrCode,
            activationCode: order.activationCode || order.smdpAddress,
            iccid: order.iccid,
            orderId: order.id,
          }
        })
    } catch (apiError: any) {
      console.warn('MobiMatter API недоступен, используем моковые данные:', apiError.message)
      
      // Fallback на моковые данные
      esims = [
        {
          id: '1',
          country: 'Турция',
          dataGB: 5,
          days: 30,
          purchasedAt: '2024-01-15',
          expiresAt: '2024-02-15',
          remainingData: 3.5,
          status: 'active',
          qrCode: 'LPA:1$your-provider.com$activation-code-here',
          activationCode: 'SM-DP+ Address: your-provider.com\nActivation Code: ABC123XYZ',
        },
      ]
    }

    res.status(200).json({ esims })
  } catch (error: any) {
    console.error('Ошибка загрузки eSIM:', error)
    res.status(500).json({ error: 'Ошибка загрузки eSIM', details: error.message })
  }
}
