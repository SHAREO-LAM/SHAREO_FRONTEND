<template>
  <div class="min-h-screen flex flex-col">
    <Toast position="top-right">
      <template #message="slotProps">
        <div class="flex items-start gap-3">
          <i
            class="pi pi-check text-green-500 text-xl mt-1"
          ></i>

          <div class="flex-1 text-gray-100">
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
    <FrHeader :current-page="currentPage" user-role="guest" :cart-item-count="cartItemCount"
      @navigate="handleNavigate" />

    <main class="flex-1">
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
import { ROUTES } from '@/constants/const';

export default defineComponent({
  name: 'App',
  components: {
    FrHeader,
    FrFooter,
    Toast,
  },
  data() {
    return {
      ROUTES,
    };
  },
  computed: {
    currentPage(): string {
      const route = this.$route;
      switch (route.path) {
        case ROUTES.COMMON.HOME.path:
          return ROUTES.COMMON.HOME.name;
        case ROUTES.COMMON.CATALOG.path:
          return ROUTES.COMMON.CATALOG.name;
        default:
          return 'home';
      }
    },
    cartItemCount(): number {
      const cartStore = useCartStore();
      return cartStore.cartItems.length;
    },
  },
  methods: {
    handleNavigate(page: string) {
      this.$router.push(`/${page}`);
    },
  },
});
</script>

<style>
/* Style global des pages */
</style>
