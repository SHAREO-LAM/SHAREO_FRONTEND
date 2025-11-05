import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string | null,
    user: null as any | null,
  }),
  actions: {
    async login(credentials: { email: string, password: string }) {
      const res = await api.post('/login', credentials)
      this.token = res.data.token
      this.user = res.data.user
    },
    logout() {
      this.token = null
      this.user = null
    }
  }
})
