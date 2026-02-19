import api from './api'

export function confirmPayment(paymentId: string) {
  return api.post(`/payment/${paymentId}/confirm`)
}
