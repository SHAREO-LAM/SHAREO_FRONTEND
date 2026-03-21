<template>
  <AppAuthCard
    title="Inscription"
    subtitle="Créez votre espace en moins d'une minute et commencez à réserver." 
    :error="error"
    :success="success ? 'Inscription réussie, redirection en cours...' : null"
  >
    <form @submit.prevent="handleSignup" class="grid gap-4 md:grid-cols-2">
      <div class="flex flex-col gap-2">
        <label for="login" class="font-medium text-slate-700">Nom d'utilisateur</label>
        <InputText
          id="login"
          v-model="formData.login"
          type="text"
          required
          autocomplete="username"
          placeholder="Votre pseudo"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="font-medium text-slate-700">Email</label>
        <InputText
          id="email"
          v-model="formData.email"
          type="email"
          required
          autocomplete="email"
          placeholder="email@exemple.com"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="password" class="font-medium text-slate-700">Mot de passe</label>
        <Password
          id="password"
          v-model="formData.password"
          required
          autocomplete="new-password"
          toggleMask
          fluid
          promptLabel="Choisissez un mot de passe"
          weakLabel="Faible"
          mediumLabel="Moyen"
          strongLabel="Fort"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="confirmPassword" class="font-medium text-slate-700">Confirmer</label>
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          required
          autocomplete="new-password"
          :feedback="false"
          toggleMask
          fluid
          :invalid="passwordMismatch"
        />
        <small v-if="passwordMismatch" class="text-red-600">Les mots de passe ne correspondent pas.</small>
      </div>

      <div class="md:col-span-2">
        <Button
          type="submit"
          :label="isLoading ? 'Inscription en cours...' : 'Créer mon compte'"
          :loading="isLoading"
          :disabled="isLoading || passwordMismatch"
          icon="pi pi-user-plus"
          class="w-full"
        />
      </div>
    </form>

    <template #footer>
      <div class="text-center text-sm text-slate-600">
        Vous avez déjà un compte ?
        <router-link
          :to="route.query.redirect ? `/login?redirect=${route.query.redirect}` : '/login'"
          class="ml-1 font-semibold no-underline"
        >
          Se connecter
        </router-link>
      </div>
    </template>
  </AppAuthCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import AppAuthCard from '@/ui/components/AppAuthCard.vue'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterCredentials } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formData = ref<RegisterCredentials>({
  login: '',
  email: '',
  password: '',
})

const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const passwordMismatch = computed(() => {
  return confirmPassword.value.length > 0 && formData.value.password !== confirmPassword.value
})

const handleSignup = async () => {
  if (formData.value.password !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (formData.value.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await authStore.register(formData.value)
    success.value = true
    setTimeout(() => {
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    }, 1200)
  } catch (err: unknown) {
    const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = errorMessage || 'Erreur lors de l\'inscription. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>
