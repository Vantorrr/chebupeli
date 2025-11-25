import type { NextApiRequest, NextApiResponse } from 'next'
import { getMobiMatterClient } from '@/lib/mobimatter'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tariffId, method, amount, userId } = req.body

  if (!tariffId) {
    return res.status(400).json({ error: 'Missing tariffId' })
  }

  try {
    // Создаем заказ через MobiMatter API
    // Оплата происходит автоматически через кошелек MobiMatter
    let orderId = ''
    let qrCode = ''
    let activationCode = ''

    try {
      const client = getMobiMatterClient()
      
      // Создаем заказ
      const order = await client.createOrder(tariffId, {
        userId: userId || 'telegram_user',
        paymentMethod: method || 'wallet',
      })

      orderId = order.id
      qrCode = order.qrCode || ''
      activationCode = order.activationCode || order.smdpAddress || ''

      // Если заказ создан успешно, возвращаем данные eSIM
      if (order.status === 'active' || order.status === 'completed') {
        return res.status(200).json({
          success: true,
          orderId: order.id,
          qrCode: order.qrCode,
          activationCode: order.activationCode || order.smdpAddress,
          iccid: order.iccid,
          status: order.status,
          // Для совместимости со старым кодом
          paymentUrl: null,
          paymentId: order.id,
        })
      }

      // Если заказ в процессе, возвращаем orderId для проверки статуса
      return res.status(200).json({
        success: true,
        orderId: order.id,
        status: order.status,
        paymentUrl: null,
        paymentId: order.id,
      })
    } catch (apiError: any) {
      console.error('MobiMatter API Error:', apiError.response?.data || apiError.message)
      
      // Fallback: симуляция для тестирования
      if (process.env.NODE_ENV === 'development') {
        return res.status(200).json({
          success: true,
          orderId: `mock_order_${Date.now()}`,
          paymentUrl: null,
          paymentId: `mock_payment_${Date.now()}`,
          qrCode: 'LPA:1$your-provider.com$activation-code-here',
          activationCode: 'SM-DP+ Address: your-provider.com\nActivation Code: ABC123XYZ',
        })
      }

      throw apiError
    }
  } catch (error: any) {
    console.error('Ошибка создания платежа:', error)
    res.status(500).json({ 
      error: 'Ошибка создания платежа', 
      details: error.message 
    })
  }
}
