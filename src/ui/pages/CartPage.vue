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
          @click="toggleCart"
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
            @pay="goToCheckout"
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

<script lang="ts">
import { defineComponent } from 'vue'
import CartItemCard from '@/ui/components/CartItemCard.vue'
import CartSummary from '@/ui/components/CartSummary.vue'
import { useCartStore } from '@/stores/cartStore'

import Card from 'primevue/card'
import Button from 'primevue/button'
import { checkDomainAvailability } from '@/services/domain'
import { checkEquipmentAvailability } from '@/services/equipementCompany'
import { useAuthStore } from '@/stores/authStore'

export default defineComponent({
  name: 'CartPage',

  components: {
    CartItemCard,
    CartSummary,
    Card,
    // eslint-disable-next-line vue/no-reserved-component-names
    Button
  },

  data() {
    return {
      isCartOpen: false,
      cart: useCartStore(),
      auth: useAuthStore()
    }
  },

  methods: {
    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    },
    async goToCheckout() {
      let hasUnavailableItem = false;

      for (const item of this.cart.cartItems) {
        if (item.type === 'domain') {
          const isAvailable = await checkDomainAvailability(
            item.productId,
            item.startDate!,
            item.endDate!
          );
          if (!isAvailable) {
            this.$toast.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Le domaine ${item.product.name} n'est plus disponible pour ces dates.`,
              life: 3000
            });
            hasUnavailableItem = true;
          }
        }else{
          const isAvailable = await checkEquipmentAvailability(
            item.productId,
            item.startDate!,
            item.endDate!,
            Number(item.quantity!)
          );
          if (!isAvailable) {
            this.$toast.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `L'équipement ${item.product.displayName} n'est plus disponible pour ces dates et cette quantité.`,
              life: 3000
            });
            hasUnavailableItem = true;
          }
        }
      }

      if (!hasUnavailableItem) {
        if (!this.auth.isLoggedIn) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Connexion requise',
            detail: 'Veuillez vous connecter ou vous inscrire pour procéder au paiement.',
            life: 3000
          });
          console.log('TESSSSSSSSSSSSSSSS TTTTTTTTTTTT  User not logged in, redirecting to login page');
          this.$router.push('/login?redirect=/checkout');
          return;
        }
        this.$router.push('/checkout');
      }
    }
  }
})
</script>
