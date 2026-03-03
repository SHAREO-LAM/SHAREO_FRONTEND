<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Header -->
        <div class="header">
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte Shareo</p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="message message--error">
          {{ error }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="form-group">
            <label for="email">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              autocomplete="email"
              placeholder="email@exemple.com"
            />
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            :label="isLoading ? 'Connexion en cours...' : 'Se connecter'"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </form>

        <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Vous n'avez pas de compte ?
          <router-link
            :to="route.query.redirect ? `/signup?redirect=${route.query.redirect}` : '/signup'"
            class="text-indigo-600 font-medium no-underline hover:text-indigo-700"
          >
            Créer un compte
          </router-link>
        </p>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
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
      detail: `Vous êtes maintenant connecté en tant que ${authStore.user?.login}.`,
      life: 3000
    });
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (err: unknown) {
    const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = errorMessage || 'Email ou mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
  padding: 5rem;
}

.login-container {
  max-width: 28rem;
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  p {
    color: #4b5563;
  }
}

.message {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border-width: 1px;

  &--error {
    background-color: #fef2f2;
    border-color: #fecaca;
    color: #b91c1c;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      ring: 2px;
      ring-color: #6366f1;
      border-color: transparent;
    }
  }
}
</style>
