import { defineStore } from 'pinia'
import type { CartItem } from '@/types/cartItem'

const CART_KEY = 'cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[],
    commissionRate: 0.01
  }),

  getters: {
    totalByCompanyName: (state) => {
      const totals: Record<string, number> = {}

      state.cartItems.forEach((item) => {
        const companyName = item.company?.name ?? 'Prestataire inconnu'
        const quantity = Number(item.quantity) || 1
        const price = Number(item.unitPrice) || 0

        totals[companyName] = (totals[companyName] ?? 0) + price * quantity
      })

      return totals
    },

    cartTotal: (state) => {
      return state.cartItems.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 1
        const price = Number(item.unitPrice) || 0
        return sum + price * quantity
      }, 0)
    },

    commission(): number {
      return this.cartTotal * this.commissionRate
    },

    totalWithCommission(): number {
      return this.cartTotal * (1 + this.commissionRate)
    }
  },

  actions: {
    save() {
      localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems))
    },

    addItem(cartItem: CartItem) {
      cartItem.cartItemId = crypto.randomUUID()

      const itemAlreadyInCart = this.cartItems.find(
        (item) =>
          item.productId === cartItem.productId &&
          item.companyId === cartItem.companyId
      )

      if (cartItem.type === 'equipment' && itemAlreadyInCart) {
        this.increaseQuantity(itemAlreadyInCart.cartItemId!)
      } else {
        this.cartItems.push(cartItem)
        this.save()
      }

      this.sortByCompany()
    },

    removeItem(cartItemId: string) {
      this.cartItems = this.cartItems.filter(
        (item) => item.cartItemId !== cartItemId
      )
      this.save()
      this.sortByCompany()
    },

    increaseQuantity(cartItemId: string) {
      const item = this.cartItems.find(
        (item) => item.cartItemId === cartItemId
      )
      if (item) {
        item.quantity = ((Number(item.quantity) || 1) + 1).toString()
        this.save()
      }
    },

    decreaseQuantity(cartItemId: string) {
      const item = this.cartItems.find(
        (item) => item.cartItemId === cartItemId
      )

      if (item && item.quantity && Number(item.quantity) > 1) {
        item.quantity = (Number(item.quantity) - 1).toString()
        this.save()
      } else if (item && item.quantity === '1') {
        this.removeItem(cartItemId)
      }
    },

    sortByCompany() {
      this.cartItems.sort((a, b) => {
        const nameA = a.company?.name ?? ''
        const nameB = b.company?.name ?? ''
        return nameA.localeCompare(nameB)
      })
    },

    clear() {
      this.cartItems = []
      this.save()
    }
  }
})
