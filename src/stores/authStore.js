import { defineStore } from 'pinia'
import { register, login, logout } from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async register(email, password) {
      const userCredential = await register(email, password)
      this.user = userCredential.user
    },
    async login(email, password) {
      const userCredential = await login(email, password)
      this.user = userCredential.user
    },
    async logout() {
      await logout()
      this.user = null
    },
  },
})
