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
      cartItem.cartItemId = crypto.randomUUID();
      const itemAlreadyInCart = this.cartItems.find(item => item.productId === cartItem.productId && item.companyId === cartItem.companyId);
      if (cartItem.type === 'equipment' && itemAlreadyInCart) {
        this.increaseQuantity(itemAlreadyInCart.cartItemId!);
      } else {
        this.cartItems.push(cartItem);
        this.save();
      }
    },
    removeItem(cartItemId: string) {
      this.cartItems = this.cartItems.filter(
        item => item.cartItemId !== cartItemId
      );
      this.save();
    },
    increaseQuantity(cartItemId: string) {
      const item = this.cartItems.find(item => item.cartItemId === cartItemId);
      if (item) {
        item.quantity = ((Number(item.quantity) || 1) + 1).toString();
        this.save();
      }
    },
    decreaseQuantity(cartItemId: string) {
      const item = this.cartItems.find(item => item.cartItemId === cartItemId);
      if (item && item.quantity && Number(item.quantity) > 1) {
        item.quantity = (Number(item.quantity) - 1).toString();
        this.save();
      }else if (item && item.quantity === '1') {
        this.removeItem(cartItemId);
      }
    },
    clear() {
      this.cartItems = [];
      this.save();
    },
  },
});
