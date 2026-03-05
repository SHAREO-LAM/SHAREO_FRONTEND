<template>
  <header class="fixed left-0 top-0 z-50 w-full bg-white shadow-md transition-colors duration-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">

        <!-- Header Logo -->
        <Button text class="!text-xl !font-bold text-primary hover:text-primary/80 transition-colors"
          icon="pi pi-calendar" label="VenueBook" @click="navigate('home')" />

        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <Button v-for="item in navItems" :key="item.value" text
            class="!text-gray-700 hover:!text-primary transition-colors"
            :class="{ '!text-primary !font-semibold': currentPage === item.value }" :label="item.label"
            @click="navigate(item.value)" />
        </nav>

        <div class="flex items-center gap-2">
          <Button v-if="userRole === 'vendor'" outlined severity="secondary" class="hidden md:flex !text-sm"
            label="Vendor Dashboard" @click="navigate('vendor')" />

          <Button v-if="userRole === 'admin' || userRole === 'superadmin'" outlined severity="secondary"
            class="hidden md:flex !text-sm" label="Admin Panel" @click="navigate('admin')" />

          <Button text rounded class="!text-gray-700 hover:!bg-gray-100 relative" icon="pi pi-shopping-cart"
            @click="navigate('cart')" :badge="String(cart.cartItems.length)" badge-severity="warn">
          </Button>

          <div class="hidden md:flex">
            <UserMenu @navigate="navigate" />
          </div>

          <Button v-if="authStore.isLoggedIn" outlined severity="danger" class="hidden md:flex !text-sm"
            icon="pi pi-sign-out" label="Déconnexion" @click="handleLogout" />

          <!-- Mobile menu -->
          <Button
            v-if="isMobile"
            text
            rounded
            class="md:hidden !text-gray-700"
            icon="pi pi-bars"
            @click="mobileMenuVisible = true"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer v-if="isMobile" v-model:visible="mobileMenuVisible" position="right" class="w-72">
      <template #header>
        <h3 class="text-xl font-bold text-gray-900">Menu</h3>
      </template>
      <nav class="flex flex-col gap-2 pt-4">
        <Button v-for="item in navItems" :key="item.value" text class="!justify-start !text-gray-700 hover:!bg-gray-100"
          :class="{ '!text-primary !font-semibold': currentPage === item.value }" :label="item.label"
          @click="navigate(item.value)" />

        <div v-if="userRole === 'vendor' || userRole === 'admin'" class="border-t border-gray-200 my-2">
        </div>

        <Button v-if="userRole === 'vendor' || userRole === 'admin'" outlined severity="secondary"
          class="!justify-start" label="Vendor Dashboard" @click="navigate('vendor')" />

        <Button v-if="userRole === 'admin' || userRole === 'superadmin'" outlined severity="secondary"
          class="!justify-start" label="Admin Panel" @click="navigate('admin')" />

        <UserMenu @navigate="navigate" />

        <Button v-if="authStore.isLoggedIn" outlined severity="danger" class="!justify-start" icon="pi pi-sign-out"
          label="Déconnexion" @click="handleLogout" />
      </nav>
    </Drawer>

  </header>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import UserMenu from './UserMenu.vue';

interface NavItem {
  label: string;
  value: string;
}

export default defineComponent({
  name: 'FrHeader',
  components: {
    UserMenu,
  },
  props: {
    currentPage: {
      type: String,
      required: true,
    },
    userRole: {
      type: String as () => 'guest' | 'user' | 'vendor' | 'admin' | 'superadmin',
      default: 'guest',
    },
  },
  emits: ['navigate'],
  data() {
    return {
      isMobile: false,
      mobileMenuVisible: false,
      navItems: [
        { label: 'Accueil', value: '' },
        { label: 'Lieux', value: 'domains' },
        { label: 'Équipements', value: 'equipments' },
      ] as NavItem[],
    };
  },
  computed: {
    cart() {
      return useCartStore();
    },
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
    navigate(page: string) {
      this.$emit('navigate', page);
      this.mobileMenuVisible = false;
    },
    handleLogout() {
      this.authStore.logout();
      this.$toast.add({
        severity: 'success',
        summary: 'Déconnexion réussie',
        detail: `Vous êtes maintenant déconnecté.`,
        life: 3000
      });
      this.mobileMenuVisible = false;
      this.$router.push('/');
    },
    updateViewport() {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) {
        this.mobileMenuVisible = false;
      }
    },
  },
  mounted() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  },
});
</script>
