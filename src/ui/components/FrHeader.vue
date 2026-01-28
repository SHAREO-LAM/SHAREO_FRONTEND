<template>
  <header class="header">
    <div class="container">
      <div class="content">

        <!-- Header Logo -->
        <Button text class="logo" icon="pi pi-calendar" label="VenueBook" @click="navigate('home')" />

        <!-- Desktop navigation -->
        <nav class="nav nav--desktop" aria-label="Main Navigation">
          <Button v-for="item in navItems" :key="item.value" text class="nav-item bg-color-secondary"
            :class="{ active: currentPage === item.value }" :label="item.label" @click="navigate(item.value)" />
        </nav>

        <div class="actions">
          <Button v-if="userRole === 'vendor'" outlined class="hidden-sm" label="Vendor Dashboard"
            @click="navigate('vendor')" />

          <Button v-if="userRole === 'admin'" outlined class="hidden-sm" label="Admin Panel"
            @click="navigate('admin')" />

          <Button text class="icon-button" :icon="themeStore.theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'"
            @click="themeStore.toggleTheme()"
            v-tooltip.bottom="themeStore.theme === 'light' ? 'Mode sombre' : 'Mode clair'" />

          <Button text class="icon-button" icon="pi pi-shopping-cart" @click="navigate('cart')"
            :badge="String(cart.cartItems.length)" badge-severity="warn">
          </Button>

          <Button text class="icon-button" icon="pi pi-user" @click="navigate('account')" />

          <!-- Mobile menu -->
          <Button text class="icon-button mobile-only" icon="pi pi-bars" @click="mobileMenuVisible = true" />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer v-model:visible="mobileMenuVisible" position="right">
      <nav class="nav nav--mobile">
        <Button v-for="item in navItems" :key="item.value" text class="nav__item" :label="item.label"
          @click="navigate(item.value)" />

        <Button v-if="userRole === 'vendor'" outlined label="Vendor Dashboard" @click="navigate('vendor')" />

        <Button v-if="userRole === 'admin'" outlined label="Admin Panel" @click="navigate('admin')" />
      </nav>
    </Drawer>

  </header>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';

interface NavItem {
  label: string;
  value: string;
}

export default defineComponent({
  name: 'FrHeader',
  props: {
    currentPage: {
      type: String,
      required: true,
    },
    userRole: {
      type: String as () => 'guest' | 'user' | 'vendor' | 'admin',
      default: 'guest',
    },
  },
  emits: ['navigate'],
  data() {
    return {
      mobileMenuVisible: false,
      navItems: [
        { label: 'Lieux', value: 'domains' },
        { label: 'Équipements', value: 'equipments' },
      ] as NavItem[],
    };
  },
  computed: {
    cart() {
      return useCartStore();
    },
    themeStore() {
      return useThemeStore();
    },
  },
  methods: {
    navigate(page: string) {
      this.$emit('navigate', page);
      this.mobileMenuVisible = false;
    },
  },
});
</script>
