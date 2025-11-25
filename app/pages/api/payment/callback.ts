import type { NextApiRequest, NextApiResponse } from 'next'
import { getMobiMatterClient } from '@/lib/mobimatter'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { orderId, status, tariffId, userId } = req.body

  if (!orderId) {
    return res.status(400).json({ error: 'Missing orderId' })
  }

  try {
    // Проверяем статус заказа через MobiMatter API
    if (orderId) {
      try {
        const client = getMobiMatterClient()
        const order = await client.getOrder(orderId)

        // Если заказ активен, сохраняем данные eSIM
        if (order.status === 'active' || order.status === 'completed') {
          // TODO: Сохранение в БД
          // await saveESIM({
          //   userId,
          //   tariffId,
          //   orderId: order.id,
          //   qrCode: order.qrCode,
          //   activationCode: order.activationCode || order.smdpAddress,
          //   iccid: order.iccid,
          //   status: 'active'
          // })

          return res.status(200).json({
            success: true,
            order: {
              id: order.id,
              status: order.status,
              qrCode: order.qrCode,
              activationCode: order.activationCode || order.smdpAddress,
              iccid: order.iccid,
            },
          })
        }

        return res.status(200).json({
          success: true,
          order: {
            id: order.id,
            status: order.status,
          },
        })
      } catch (apiError: any) {
        console.error('MobiMatter API Error:', apiError.response?.data || apiError.message)
        // Продолжаем обработку даже если API недоступен
      }
    }

    // Fallback для старых платежных систем
    if (status === 'success' || status === 'succeeded') {
      // TODO: Интеграция с платежными системами и создание заказа через MobiMatter
      // const client = getMobiMatterClient()
      // const order = await client.createOrder(tariffId, { userId })
    }

    res.status(200).json({ success: true })
  } catch (error: any) {
    console.error('Ошибка обработки callback:', error)
    res.status(500).json({ error: 'Ошибка обработки callback', details: error.message })
  }
}
