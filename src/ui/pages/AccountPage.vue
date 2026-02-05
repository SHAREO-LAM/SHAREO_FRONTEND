<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Mon Compte
        </h1>
        <p class="text-gray-600">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <!-- Profile Card -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- User Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-user text-indigo-600"></i>
            Informations personnelles
          </h2>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-500">
                Nom d'utilisateur
              </label>
              <p class="text-gray-900 font-medium">
                {{ authStore.user?.login }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">
                Email
              </label>
              <p class="text-gray-900 font-medium">
                {{ authStore.user?.email }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">
                ID Utilisateur
              </label>
              <p class="text-gray-900 font-medium">
                #{{ authStore.user?.userId }}
              </p>
            </div>
          </div>
        </div>

        <!-- Account Status -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="pi pi-shield text-green-600"></i>
            Statut du compte
          </h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-gray-700">Administrateur</span>
              <span v-if="authStore.isAdmin" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <i class="pi pi-check-circle mr-1"></i>
                Oui
              </span>
              <span v-else class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                Non
              </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-gray-700">Super Administrateur</span>
              <span v-if="authStore.isSuperAdmin" class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <i class="pi pi-check-circle mr-1"></i>
                Oui
              </span>
              <span v-else class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                Non
              </span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-gray-700">Rôle</span>
              <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {{ authStore.userRole }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="pi pi-cog text-gray-600"></i>
          Actions
        </h2>

        <div class="flex flex-wrap gap-4">
          <Button
            outlined
            severity="secondary"
            icon="pi pi-refresh"
            label="Actualiser le profil"
            @click="refreshProfile"
            :loading="isRefreshing"
          />

          <Button
            outlined
            severity="danger"
            icon="pi pi-sign-out"
            label="Se déconnecter"
            @click="handleLogout"
          />
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="mt-4">
        <div
          :class="[
            'p-4 rounded-lg flex items-center gap-2',
            messageType === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          ]"
        >
          <i :class="messageType === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'"></i>
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isRefreshing = ref(false)
const message = ref<string | null>(null)
const messageType = ref<'success' | 'error'>('success')

const refreshProfile = async () => {
  isRefreshing.value = true
  message.value = null

  try {
    await authStore.fetchProfile()
    message.value = 'Profil actualisé avec succès'
    messageType.value = 'success'

    setTimeout(() => {
      message.value = null
    }, 3000)
  } catch {
    message.value = 'Erreur lors de l\'actualisation du profil'
    messageType.value = 'error'
  } finally {
    isRefreshing.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>
