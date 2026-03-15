import apiClient from './api'
import type { OrderItem } from '@/types/orderItem'

export const getOrderItems = async (): Promise<OrderItem[]> => {
  const { data } = await apiClient.get<OrderItem[]>('/order-item')
  return data
}
