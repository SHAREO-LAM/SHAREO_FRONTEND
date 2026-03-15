import apiClient from './api'
import type { Order } from '@/types/order'

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get<Order[]>('/order')
  return data
}

export const getOrder = async (id: string): Promise<Order> => {
  const { data } = await apiClient.get<Order>(`/order/${id}`)
  return data
}

export const updateOrder = async (id: string, payload: Partial<Order>): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`/order/${id}`, payload)
  return data
}

export const deleteOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/order/${id}`)
}
