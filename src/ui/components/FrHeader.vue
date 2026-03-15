<template>
  <header class="fixed left-0 top-0 z-50 w-full bg-white shadow-md transition-colors duration-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">

        <Button text class="!text-xl !font-bold text-primary hover:text-primary/80 transition-colors"
          icon="pi pi-calendar" label="SHAREO" @click="navigate('home')" />

        <nav class="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <Button v-for="item in navItems" :key="item.value" text
            class="!text-black hover:!text-primary transition-colors"
            :class="{ '!text-primary !font-semibold': currentPage === item.value }" :label="item.label"
            @click="navigate(item.value)" />
        </nav>

        <div class="flex items-center gap-2">
          <Button v-if="authStore.userRole === 'vendor'" outlined severity="secondary" class="hidden md:flex !text-sm"
            label="Vendor Dashboard" @click="navigate('vendor')" />

          <Button v-if="authStore.userRole === 'admin' || authStore.userRole === 'superadmin'" outlined severity="warning"
            class="hidden md:flex !text-sm" icon="pi pi-shield" label="Admin Dashboard" @click="navigate('admin')" />

          <Button
            v-if="authStore.userRole == 'user' || authStore.userRole == 'guest'"
            outlined
            severity="primary"
            class="!hidden md:!flex !text-sm"
            icon="pi pi-shop"
            label="Devenir vendeur"
            @click="openBecomeSeller"
          />

          <Button text rounded class="!text-black hover:!bg-gray-100 relative" icon="pi pi-shopping-cart"
            @click="navigate('cart')" :badge="String(cart.cartItems.length)" badge-severity="warn" />

          <Button v-if="!isMobile && !authStore.isLoggedIn" class="!text-md" label="Connexion" icon="pi pi-user"
            @click="$emit('navigate', 'login')" />

          <div class="hidden md:flex">
            <UserMenu @navigate="navigate" />
          </div>

          <Button
            v-if="isMobile"
            text
            rounded
            class="md:hidden !text-black"
            icon="pi pi-bars"
            @click="mobileMenuVisible = true"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer v-if="isMobile" v-model:visible="mobileMenuVisible" position="right" class="w-72 !bg-white !text-black">
      <template #header>
        <h3 class="text-xl font-bold text-gray-900">Menu</h3>
      </template>
      <nav class="flex flex-col gap-2">
        <Button v-for="item in navItems" :key="item.value" text class="!justify-start !text-black hover:!bg-gray-50"
          :class="{ '!text-primary !font-semibold': currentPage === item.value }" :label="item.label" :icon="item.icon"
          @click="navigate(item.value)" />

        <Button
          v-if="authStore.userRole == 'user' || authStore.userRole == 'guest'"
          text
          class="!justify-start !text-black hover:!bg-gray-100"
          icon="pi pi-shop"
          label="Devenir vendeur"
          @click="openBecomeSeller"
        />

        <UserMenu :mobile="true" @navigate="navigate" />

        <div class="border-t border-gray-500 my-2" />
        <Button v-if="authStore.isLoggedIn" text @click="handleLogout"
          icon="pi pi-sign-out" label="Déconnexion"
          class="!w-full !justify-start !text-red-600 !px-4 !py-2 !text-md hover:!bg-gray-50" />

        <Button v-if="authStore.userRole === 'vendor' || authStore.userRole === 'admin'" text
          class="!justify-start !text-gray-700 hover:!bg-gray-100" label="Vendor Dashboard" @click="navigate('vendor')" />

        <Button v-if="authStore.userRole === 'admin' || authStore.userRole === 'superadmin'" text
          class="!justify-start !text-gray-700 hover:!bg-gray-100" icon="pi pi-shield" label="Admin Dashboard" @click="navigate('admin')" />

        <Button v-else class="!w-full !justify-start !text-md" label="Connexion" icon="pi pi-user"
          @click="$emit('navigate', 'login')" />
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
  icon: string;
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
  },
  emits: ['navigate'],
  data() {
    return {
      isMobile: false,
      mobileMenuVisible: false,
      navItems: [
        { label: 'Accueil', value: '', icon: 'pi pi-home' },
        { label: 'Lieux', value: 'domains', icon: 'pi pi-map-marker' },
        { label: 'Équipements', value: 'equipments', icon: 'pi pi-cog' },
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
    openBecomeSeller() {
      if (!this.authStore.isLoggedIn) {
        this.$router.push('/login');
        return;
      }
      this.$router.push('/become-seller');
      this.mobileMenuVisible = false;
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
