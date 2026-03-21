<template>
  <header class="fixed inset-x-0 top-0 z-50 px-3 py-3 md:px-6">
    <div class="glass-panel mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-5">
      <Button
        text
        class="!text-lg !font-semibold theme-text-strong"
        icon="pi pi-compass"
        label="SHAREO"
        @click="navigate('home')"
      />

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
        <Button
          v-for="item in navItems"
          :key="item.value"
          text
          :label="item.label"
          :icon="item.icon"
          class="theme-nav-link"
          :class="{ 'theme-nav-link-active': isNavItemActive(item.value) }"
          @click="navigate(item.value)"
        />
      </nav>

      <div class="flex items-center gap-2">
        <Button
          v-if="authStore.userRole === 'vendor'"
          outlined
          severity="secondary"
          class="hidden md:flex"
          label="Espace vendeur"
          @click="navigate('vendor')"
        />

        <Button
          v-if="authStore.userRole === 'admin' || authStore.userRole === 'superadmin'"
          outlined
          severity="contrast"
          class="hidden md:flex"
          icon="pi pi-shield"
          label="Admin"
          @click="navigate('admin')"
        />

        <Button
          text
          rounded
          class="theme-text-strong"
          icon="pi pi-shopping-cart"
          @click="navigate('cart')"
          :badge="String(cart.cartItems.length)"
          badge-severity="warn"
        />

        <Button
          v-if="!isMobile && !authStore.isLoggedIn"
          label="Connexion"
          icon="pi pi-user"
          @click="$emit('navigate', 'login')"
        />

        <div class="hidden md:flex">
          <UserMenu @navigate="navigate" />
        </div>

        <Button
          v-if="isMobile"
          text
          rounded
          class="md:hidden"
          icon="pi pi-bars"
          @click="mobileMenuVisible = true"
        />
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer
      v-if="isMobile"
      v-model:visible="mobileMenuVisible"
      position="right"
      class="w-72"
    >
      <template #header>
        <h3 class="theme-text-strong text-xl font-semibold">Navigation</h3>
      </template>
      <nav class="flex flex-col gap-2">
        <Button
          v-for="item in navItems"
          :key="item.value"
          text
          class="!justify-start theme-nav-link"
          :class="{ 'theme-nav-link-active': isNavItemActive(item.value) }"
          :label="item.label"
          :icon="item.icon"
          @click="navigate(item.value)"
        />

        <Button
          v-if="authStore.userRole == 'user' || authStore.userRole == 'guest'"
          text
          class="!justify-start"
          icon="pi pi-shop"
          label="Devenir vendeur"
          @click="openBecomeSeller"
        />

        <UserMenu :mobile="true" @navigate="navigate" />

        <div class="my-2 border-t" style="border-color: var(--line-color);" />
        <Button
          v-if="authStore.isLoggedIn"
          text
          @click="handleLogout"
          icon="pi pi-sign-out"
          label="Déconnexion"
          class="!w-full !justify-start !text-red-600"
        />

        <Button
          v-if="authStore.userRole === 'vendor'"
          text
          class="!justify-start"
          label="Espace vendeur"
          @click="navigate('vendor')"
        />

        <Button
          v-if="authStore.userRole === 'admin' || authStore.userRole === 'superadmin'"
          text
          class="!justify-start"
          icon="pi pi-shield"
          label="Admin"
          @click="navigate('admin')"
        />

        <Button
          v-else
          class="!w-full !justify-start"
          label="Connexion"
          icon="pi pi-user"
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
    isNavItemActive(page: string) {
      return this.currentPage === page;
    },
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
