import api from '@/services/api'

export const getOrdersByUser = (userId: string | number) => {
  return api.get(`/order/user/${userId}`)
}
