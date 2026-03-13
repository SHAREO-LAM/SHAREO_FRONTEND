import apiClient from './api'
import type { OrderStatus } from '@/types/orderStatus'

export const getOrderStatuses = async (): Promise<OrderStatus[]> => {
  const { data } = await apiClient.get<OrderStatus[]>('/order-status')
  return data
}
