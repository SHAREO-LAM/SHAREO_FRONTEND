<template>
  <div class="app-shell">
    <Toast position="top-right" group="cart">
      <template #message="slotProps">
        <div class="flex items-start gap-3">
          <div class="flex-1">
            <p class="font-semibold">
              {{ slotProps.message.summary }}
            </p>
            <p class="text-sm opacity-80">
              {{ slotProps.message.detail }}
            </p>

            <Button
              label="Aller au panier"
              size="small"
              severity="secondary"
              class="mt-2"
              @click="handleNavigate('cart')"
            />
          </div>
        </div>
      </template>
    </Toast>
    <Toast position="top-right" />
    <FrHeader :current-page="currentPage" :cart-item-count="cartItemCount"
      @navigate="handleNavigate" />

    <main class="app-main">
      <router-view />
    </main>

    <FrFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import FrHeader from './components/FrHeader.vue';
import FrFooter from './components/FrFooter.vue';
import Toast from 'primevue/toast';

export default defineComponent({
  name: 'App',
  components: {
    FrHeader,
    FrFooter,
    Toast,
  },
  computed: {
    currentPage(): string {
      return String(this.$route.name ?? 'home');
    },
    cartItemCount(): number {
      const cartStore = useCartStore();
      return cartStore.cartItems.length;
    },
  },
  methods: {
    handleNavigate(page: string) {
      const map: Record<string, string> = {
        home: '/',
        domains: '/domains',
        equipments: '/equipments',
        login: '/login',
        signup: '/signup',
        cart: '/cart',
        account: '/account',
        admin: '/admin',
        vendor: '/vendor/dashboard',
        orders: '/orders',
      };

      this.$router.push(map[page] ?? '/');
    },
  },
});
</script>
