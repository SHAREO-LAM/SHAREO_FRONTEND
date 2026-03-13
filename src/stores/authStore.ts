import { defineStore } from 'pinia'
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getProfile,
  isAuthenticated,
  type LoginCredentials,
  type RegisterCredentials,
  type UserProfile,
} from '@/services/auth'
import { getUserCompanies } from '@/services/company'

interface AuthState {
  user: UserProfile | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
  isVendor: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: isAuthenticated(),
    isLoading: false,
    error: null,
    isVendor: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.isAdmin || false,
    isSuperAdmin: (state) => state.user?.isSuperAdmin || false,
    userRole: (state) => {
      if (!state.user) return 'guest'
      if (state.user.isSuperAdmin) return 'superadmin'
      if (state.user.isAdmin) return 'admin'
      if (state.isVendor) return 'vendor'
      return 'user'
    },
  },

  actions: {
    /**
     * Connexion de l'utilisateur
     */
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiLogin(credentials)

        // Récupérer le profil utilisateur après connexion
        await this.fetchProfile()

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Erreur de connexion'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Inscription de l'utilisateur
     */
    async register(credentials: RegisterCredentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiRegister(credentials)

        // Récupérer le profil utilisateur après inscription
        await this.fetchProfile()

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || "Erreur lors de l'inscription"
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Récupérer le profil utilisateur
     */
    async fetchProfile() {
      this.isLoading = true
      this.error = null

      try {
        const profile = await getProfile()
        this.user = profile
        this.isLoggedIn = true
        
        // Charger le statut de vendeur
        await this.loadVendorStatus()
        
        return profile
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Erreur lors de la récupération du profil'
        this.logout() // Si impossible de récupérer le profil, déconnecter
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Charger le statut de vendeur (vérifie si l'utilisateur a une compagnie)
     */
    async loadVendorStatus() {
      try {
        const companies = await getUserCompanies()
        this.isVendor = companies && companies.length > 0
      } catch (error) {
        // Si erreur, considérer que l'utilisateur n'est pas vendeur
        this.isVendor = false
      }
    },

    /**
     * Déconnexion de l'utilisateur
     */
    logout() {
      apiLogout()
      this.user = null
      this.isLoggedIn = false
      this.isVendor = false
      this.error = null
    },

    /**
     * Initialiser le store au démarrage de l'app
     */
    async initialize() {
      if (this.isLoggedIn && !this.user) {
        try {
          await this.fetchProfile()
        } catch {
          // Si échec, l'utilisateur sera déconnecté par fetchProfile
        }
      }
    },
  },
})
