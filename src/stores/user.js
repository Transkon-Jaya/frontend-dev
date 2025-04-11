import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    level: '',
    role: '',
    token: localStorage.getItem('jwt') || '',
    apiBaseUrl: 'https://www.transkon-rent.com/api',
  }),

  actions: {
    setUser({ username, level, roles, token }) {
      this.username = username
      this.level = level
      this.roles = roles
      this.token = token
      localStorage.setItem('jwt', token)
    },

    clearUser() {
      this.username = ''
      this.level = ''
      this.role = ''
      this.token = ''
      localStorage.removeItem('jwt')
    }
  },
  persist: true
})
