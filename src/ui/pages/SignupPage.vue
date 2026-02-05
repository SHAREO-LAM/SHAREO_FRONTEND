<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="signup-card">
        <!-- Header -->
        <div class="header">
          <h1>Inscription</h1>
          <p>Créez votre compte Shareo</p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="message message--error">
          {{ error }}
        </div>

        <!-- Success message -->
        <div v-if="success" class="message message--success">
          Inscription réussie ! Redirection en cours...
        </div>

        <!-- Signup Form -->
        <form @submit.prevent="handleSignup" class="signup-form">
          <!-- Username and Email Row -->
          <div class="form-row">
            <!-- Username -->
            <div class="form-group">
              <label for="login">
                Nom d'utilisateur
              </label>
              <input
                id="login"
                v-model="formData.login"
                type="text"
                required
                autocomplete="username"
                placeholder="Nom d'utilisateur"
              />
            </div>

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
          </div>

          <!-- Password and Confirm Password Row -->
          <div class="form-row">
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
                autocomplete="new-password"
                minlength="6"
                placeholder="••••••••"
              />
              <p class="hint">Minimum 6 caractères</p>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="confirmPassword">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                required
                autocomplete="new-password"
                placeholder="••••••••"
                :class="{ 'error': passwordMismatch }"
              />
              <p v-if="passwordMismatch" class="error-text">
                Les mots de passe ne correspondent pas
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || passwordMismatch"
            class="submit-button"
          >
            <span v-if="!isLoading">Créer mon compte</span>
            <span v-else class="loading">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inscription en cours...
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="footer">
          <p>
            Vous avez déjà un compte ?
            <router-link to="/login">
              Se connecter
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterCredentials } from '@/services/auth'

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
  // Vérifier que les mots de passe correspondent
  if (formData.value.password !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  // Vérifier la longueur du mot de passe
  if (formData.value.password.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await authStore.register(formData.value)
    success.value = true

    // Redirection vers la page d'accueil après inscription réussie
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err: unknown) {
    const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = errorMessage || 'Erreur lors de l\'inscription. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.signup-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
  padding: 5rem;
}

.signup-container {
  max-width: 50%;
  width: 100%;
}

.signup-card {
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

  &--success {
    background-color: #f0fdf4;
    border-color: #bbf7d0;
    color: #15803d;
  }
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

    &.error {
      border-color: #ef4444;
    }
  }

  .hint {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .error-text {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #ef4444;
  }
}

.submit-button {
  width: 100%;
  background-color: #4f46e5;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #4338ca;
  }

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #6366f1;
    ring-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;

    .spinner {
      animation: spin 1s linear infinite;
      height: 1.25rem;
      width: 1.25rem;
      margin-right: 0.5rem;

      circle {
        opacity: 0.25;
      }

      path {
        opacity: 0.75;
      }
    }
  }
}

.footer {
  margin-top: 1.5rem;
  text-align: center;

  p {
    font-size: 0.875rem;
    color: #4b5563;

    a {
      color: #4f46e5;
      font-weight: 500;
      text-decoration: none;

      &:hover {
        color: #4338ca;
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
