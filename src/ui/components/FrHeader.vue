<template>
  <header class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">

        <!-- Header Logo -->
        <Button text class="!text-xl !font-bold text-primary hover:text-primary/80 transition-colors"
          icon="pi pi-calendar" label="VenueBook" @click="navigate('home')" />

        <!-- Desktop navigation -->
        <nav class="hidden md:flex items-center gap-2" aria-label="Main Navigation">
          <Button v-for="item in navItems" :key="item.value" text
            class="!text-gray-700 dark:!text-gray-200 hover:!text-primary dark:hover:!text-primary transition-colors"
            :class="{ '!text-primary !font-semibold': currentPage === item.value }" :label="item.label"
            @click="navigate(item.value)" />
        </nav>

        <div class="flex items-center gap-2">
          <Button v-if="userRole === 'vendor'" outlined severity="secondary" class="hidden md:flex !text-sm"
            label="Vendor Dashboard" @click="navigate('vendor')" />

          <Button v-if="userRole === 'admin'" outlined severity="secondary" class="hidden md:flex !text-sm"
            label="Admin Panel" @click="navigate('admin')" />

          <Button text rounded class="!text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-800"
            :icon="themeStore.theme === 'light' ? 'pi pi-moon' : 'pi pi-sun'" @click="themeStore.toggleTheme()"
            v-tooltip.bottom="themeStore.theme === 'light' ? 'Mode sombre' : 'Mode clair'" />

          <Button text rounded
            class="!text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-800 relative"
            icon="pi pi-shopping-cart" @click="navigate('cart')" :badge="String(cart.cartItems.length)"
            badge-severity="warn">
          </Button>

          <Button text rounded class="!text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-800"
            icon="pi pi-user" @click="navigate('account')" />

          <!-- Mobile menu -->
          <Button text rounded class="md:hidden !text-gray-700 dark:!text-gray-200" icon="pi pi-bars"
            @click="mobileMenuVisible = true" />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer v-model:visible="mobileMenuVisible" position="right" class="w-72">
      <template #header>
        <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h3>
      </template>
      <nav class="flex flex-col gap-2 pt-4">
        <Button v-for="item in navItems" :key="item.value" text
          class="!justify-start !text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-800"
          :class="{ '!text-primary !font-semibold': currentPage === item.value }" :label="item.label"
          @click="navigate(item.value)" />

        <div v-if="userRole === 'vendor' || userRole === 'admin'"
          class="border-t border-gray-200 dark:border-gray-700 my-2">
        </div>

        <Button v-if="userRole === 'vendor'" outlined severity="secondary" class="!justify-start"
          label="Vendor Dashboard" @click="navigate('vendor')" />

        <Button v-if="userRole === 'admin'" outlined severity="secondary" class="!justify-start" label="Admin Panel"
          @click="navigate('admin')" />
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
