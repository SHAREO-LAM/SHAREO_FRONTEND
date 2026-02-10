<template>
  <div class="container p-[3rem] py-8">
    <!-- HEADER -->
    <header class="mb-6">
      <h1 class="text-2xl font-bold">Votre panier</h1>
    </header>

    <div v-if="cart.cartItems.length" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- LEFT -->
      <section class="lg:col-span-2 space-y-4">
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

          <div class="flex justify-between items-center">
            <span>Commission SHAREO (1%)</span>
            <span>
              {{ (cartTotal * 0.01).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }} €
            </span>
          </div>
          <div>
            <Divider />
            <div class="flex justify-between items-center">
              <span>Total</span>
              <span>
                {{ (cartTotal * 1.01).toLocaleString('fr-FR', { minimumFractionDigits: 1 }) }} €
              </span>
            </div>
            <Divider />

            <Button
              label="Paiement"
              severity="warn"
              class="w-full h-11 text-base font-medium"
            />
          </div>

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
import { computed } from 'vue'
import CartItemCard from '@/ui/components/CartItemCard.vue'
import { useCartStore } from '@/stores/cartStore'

import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'

const cart = useCartStore()
console.log(cart.cartItems[0])

const groupedByCompany = computed(() => {
  const map = new Map()

  cart.cartItems.forEach(item => {
    if (!map.has(item.companyId)) {
      map.set(item.companyId, {
        companyId: item.companyId,
        companyName: "Test",
        items: [],
        total: 0
      })
    }

    const group = map.get(item.companyId)
    group.items.push(item)
    group.total += item.type === 'equipment'
      ? item.unitPrice * ((item.quantity as unknown as number) || 1)
      : item.unitPrice
  })

  return Array.from(map.values())
})

const cartTotal = computed(() =>
  groupedByCompany.value.reduce((sum, g) => sum + g.total, 0)
)
</script>
