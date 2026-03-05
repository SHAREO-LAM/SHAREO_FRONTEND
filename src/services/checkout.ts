import api from './api'
import type { CreateCheckout, } from '@/types/checkout'

/* A décommenter si on veut stocker les adresses paiement et info de facturation
export type CheckoutPayload = {
  billing: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    postcode: string
    city: string
  }
  payment: {
    cardNumber: string
    expiry: string
    cvc: string
  }
  cartItems: CartItem[]
  total: number
}
*/

export function createCheckoutSession(payload: CreateCheckout) {
  return api.post('/checkout', payload)
}
