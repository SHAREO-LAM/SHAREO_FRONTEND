<template>
  <div v-if="authStore.isLoggedIn" class="relative">

    <!-- ======= MODE DESKTOP : dropdown ======= -->
    <template v-if="!props.mobile">
      <Button
        text
        rounded
        class="!text-black hover:!bg-gray-100"
        icon="pi pi-user"
        @click.stop="menuVisible = !menuVisible"
        v-tooltip.bottom="`${authStore.user?.login || 'Mon compte'}`"
      />

      <div
        v-if="menuVisible"
        class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      >
        <div class="px-4 py-3 border-b border-gray-200">
          <p class="text-md font-medium text-gray-900">{{ authStore.user?.login }}</p>
          <p class="text-sm text-gray-500 truncate">{{ authStore.user?.email }}</p>
        </div>

        <div class="py-1">
          <Button v-if="authStore.isSuperAdmin" text @click="handleNavigate('admin')"
            icon="pi pi-shield" label="Panneau Admin"
            class="!w-full !justify-start !text-black text-md !rounded-none hover:!bg-gray-50" />

          <Button v-if="authStore.isAdmin && !authStore.isSuperAdmin" text @click="handleNavigate('vendor')"
            icon="pi pi-building" label="Espace entreprise"
            class="!w-full !justify-start !text-black text-md !rounded-none hover:!bg-gray-50" />

          <Button text @click="handleNavigate('orders')"
            icon="pi pi-list" label="Mes commandes"
            class="!w-full !justify-start !text-black text-md !rounded-none hover:!bg-gray-50" />

          <Divider class="!my-1" />

          <Button text @click="handleLogout"
            icon="pi pi-sign-out" label="Déconnexion"
            class="!w-full !justify-start !text-red-600 !px-4 !py-2 !text-md !rounded-none hover:!bg-gray-50" />
        </div>
      </div>
    </template>

    <!-- ======= MODE MOBILE : liens à plat ======= -->
    <template v-else>
      <Divider class="!my-2" />

      <Button v-if="authStore.isSuperAdmin" text @click="handleNavigate('admin')"
        icon="pi pi-shield" label="Panneau Admin"
        class="!w-full !justify-start !text-black text-md !rounded-none hover:!bg-gray-50" />

      <Button v-if="authStore.isAdmin && !authStore.isSuperAdmin" text @click="handleNavigate('vendor')"
        icon="pi pi-building" label="Espace entreprise"
        class="!w-full !justify-start !text-black text-md !rounded-none hover:!bg-gray-50" />

      <Button text @click="handleNavigate('orders')"
        icon="pi pi-list" label="Mes commandes"
        class="!w-full !justify-start !text-black text-md !rounded-none hover:!bg-gray-50" />


    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Divider from 'primevue/divider'

const props = defineProps<{ mobile?: boolean }>()
const emit = defineEmits(['navigate'])
const router = useRouter()
const authStore = useAuthStore()

const menuVisible = ref(false)

const closeMenu = () => { menuVisible.value = false }

const handleNavigate = (page: string) => {
  emit('navigate', page)
  closeMenu()
}

const handleLogout = () => {
  authStore.logout()
  closeMenu()
  router.push('/')
}

const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) closeMenu()
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>
