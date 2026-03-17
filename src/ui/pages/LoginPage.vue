<template>
  <AppAuthCard
    title="Connexion"
    subtitle="Retrouvez vos réservations, vos favoris et vos commandes en cours."
    :error="error"
  >
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="email" class="font-medium text-slate-700">Email</label>
        <InputText
          id="email"
          v-model="formData.email"
          type="email"
          required
          autocomplete="email"
          placeholder="email@exemple.com"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-medium text-slate-700">Mot de passe</label>
        <Password
          id="password"
          v-model="formData.password"
          required
          autocomplete="current-password"
          placeholder="Votre mot de passe"
          :feedback="false"
          toggleMask
          fluid
        />
      </div>

      <Button
        type="submit"
        :label="isLoading ? 'Connexion en cours...' : 'Se connecter'"
        :loading="isLoading"
        :disabled="isLoading"
        icon="pi pi-sign-in"
      />
    </form>

    <template #footer>
      <div class="text-center text-sm text-slate-600">
        Vous n'avez pas de compte ?
        <router-link
          :to="route.query.redirect ? `/signup?redirect=${route.query.redirect}` : '/signup'"
          class="ml-1 font-semibold no-underline"
        >
          Créer un compte
        </router-link>
      </div>
    </template>
  </AppAuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import AppAuthCard from '@/ui/components/AppAuthCard.vue'
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const formData = ref<LoginCredentials>({
  email: '',
  password: '',
})

const isLoading = ref(false)
const error = ref<string | null>(null)

const handleLogin = async () => {
  isLoading.value = true
  error.value = null

  try {
    await authStore.login(formData.value)
    toast.add({
      severity: 'success',
      summary: 'Connexion réussie',
      detail: `Bienvenue ${authStore.user?.login}.`,
      life: 3000
    })
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: unknown) {
    const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = errorMessage || 'Email ou mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}
</script>
