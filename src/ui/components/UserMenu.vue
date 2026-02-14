<template>
  <div v-if="authStore.isLoggedIn" class="relative">
    <!-- User Button -->
    <Button
      text
      rounded
      class="!text-gray-700 hover:!bg-gray-100"
      icon="pi pi-user"
      @click="menuVisible = !menuVisible"
      v-tooltip.bottom="`${authStore.user?.login || 'Mon compte'}`"
    />

    <!-- Dropdown Menu -->
    <div
      v-if="menuVisible"
      v-click-outside="closeMenu"
      class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <!-- User Info -->
      <div class="px-4 py-3 border-b border-gray-200">
        <p class="text-sm font-medium text-gray-900">
          {{ authStore.user?.login }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          {{ authStore.user?.email }}
        </p>
      </div>

      <!-- Menu Items -->
      <div class="py-1">
        <button
          v-if="authStore.isSuperAdmin"
          @click="handleNavigate('admin')"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <i class="pi pi-shield text-purple-500"></i>
          <span>Admin Panel</span>
        </button>

        <button
          v-if="authStore.isAdmin && !authStore.isSuperAdmin"
          @click="handleNavigate('vendor')"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <i class="pi pi-building text-blue-500"></i>
          <span>Vendor Dashboard</span>
        </button>

        <button
          @click="handleNavigate('account')"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <i class="pi pi-user"></i>
          <span>Mon compte</span>
        </button>

        <div class="border-t border-gray-200 my-1"></div>

        <button
          @click="handleLogout"
          class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
        >
          <i class="pi pi-sign-out"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Login/Signup buttons for guests -->
  <div v-else class="flex items-center gap-2">
    <Button
      outlined
      severity="secondary"
      class="!text-sm"
      label="Connexion"
      icon="pi pi-user"
      @click="$emit('navigate', 'login')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const emit = defineEmits(['navigate'])
const router = useRouter()
const authStore = useAuthStore()

const menuVisible = ref(false)

const closeMenu = () => {
  menuVisible.value = false
}

const handleNavigate = (page: string) => {
  emit('navigate', page)
  closeMenu()
}

const handleLogout = () => {
  authStore.logout()
  closeMenu()
  router.push('/')
}

// Custom directive for click outside
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
