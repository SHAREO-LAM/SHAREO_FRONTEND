import { defineStore } from 'pinia';
import type { CartItem } from '@/types/cartItem';

const CART_KEY = 'cart';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[],
  }),
  actions: {
    save() {
      localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
    },
    addItem(cartItem: CartItem) {
      this.cartItems.push(cartItem);
      this.save();
    },
    removeItem(productId: string) {
      this.cartItems = this.cartItems.filter(
        item => item.productId !== productId
      )
      this.save();
    },
    clear() {
      this.cartItems = [];
      this.save();
    },
  },
});
