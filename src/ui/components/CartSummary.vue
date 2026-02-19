<template>
  <div class="flex flex-col gap-3">
    <!-- Détail par entreprise -->
    <div class="space-y-2">
      <div
        v-for="(total, companyName) in cart.totalByCompanyName"
        :key="companyName"
        class="flex justify-between text-sm"
      >
        <span>{{ companyName }}</span>
        <span>
          {{ formatPrice(total) }} €
        </span>
      </div>
    </div>

    <!-- Commission -->
    <div class="flex justify-between items-center text-sm">
      <span>Commission SHAREO ({{ cart.commissionRate * 100 }}%)</span>
      <span>
        {{ formatPrice(cart.commission, 2) }} €
      </span>
    </div>

    <!-- Total général -->
    <div>
      <Divider />
      <div class="flex justify-between items-center">
        <span class="font-bold">Total</span>
        <span class="font-bold">
          {{ formatPrice(cart.totalWithCommission, 2) }} €
        </span>
      </div>
      <Divider />
    </div>

    <Button
      v-if="!small"
      label="Paiement"
      severity="warn"
      class="w-full h-11"
      @click="$emit('pay')"
    />

    <Button
      v-if="small"
      :label="showCartItems ? 'Masquer le panier' : 'Voir le panier'"
      :icon="showCartItems ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
      severity="warn"
      class="w-full h-11 mb-3"
      @click="toggleCartItems"
    />

    <!-- Items -->
    <div class="flex flex-col gap-3" v-if="showCartItems">
      <CartItemCard
        v-for="item in cart.cartItems"
        :key="item.productId"
        :item="item"
        :small="small"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import { useCartStore } from '@/stores/cartStore'
import CartItemCard from '@/ui/components/CartItemCard.vue'

export default defineComponent({
  name: 'CartSummary',

  components: {
    Divider,
    // eslint-disable-next-line vue/no-reserved-component-names
    Button,
    CartItemCard
  },

  props: {
    small: {
      type: Boolean,
      default: false
    }
  },

  emits: ['pay'],

  data() {
    return {
      showCartItems: false,
      cart: useCartStore()
    }
  },

  methods: {
    toggleCartItems() {
      this.showCartItems = !this.showCartItems
    },

    formatPrice(value: number, digits = 2): string {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      })
    }
  }
})
</script>
