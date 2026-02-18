<template>
  <div class="container mx-auto px-4 py-8">
    <!-- HEADER -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Votre panier</h1>
    </header>

    <div v-if="cart.cartItems.length" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:hidden">
        <Button
          :label="isCartOpen ? 'Masquer le panier' : 'Voir le panier'"
          :icon="isCartOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          severity="success"
          class="w-full"
          @click="isCartOpen = !isCartOpen"
        />
      </div>
      <!-- LEFT -->
      <section
        class="
          lg:col-span-2
          space-y-4
          overflow-hidden
          transition-all duration-300
        "
        :class="{
          'max-h-0 opacity-0 lg:max-h-none lg:opacity-100': !isCartOpen,
          'max-h-750 opacity-100': isCartOpen,
        }"
      >
        <!-- ITEMS -->
        <CartItemCard
          v-for="item in cart.cartItems"
          :key="item.productId"
          :item="item"
        />
      </section>

      <!-- RIGHT -->
      <aside class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-md p-5 space-y-4">
          <h1 class="text-2xl font-bold">
            Récapitulatif
          </h1>


          <CartSummary
            @pay="$router.push('/checkout')"
          />

        </div>
      </aside>
    </div>

    <!-- EMPTY -->
    <Card v-else class="text-center py-12">
      <i class="pi pi-shopping-cart text-4xl text-gray-400 mb-4" />
      <p class="text-gray-600">Votre panier est vide</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CartItemCard from '@/ui/components/CartItemCard.vue'
import { useCartStore } from '@/stores/cartStore'
import CartSummary from '@/ui/components/CartSummary.vue'

import Card from 'primevue/card'
import Button from 'primevue/button'

const cart = useCartStore()
const isCartOpen = ref(false)
console.log(cart.cartItems[0])
</script>
