import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    level: '',
    role: '',
    name: '',
    photo: '',
    token: localStorage.getItem('jwt') || '',
    baseUrl: 'https://www.transkon-rent.com',
    apiBaseUrl: 'https://www.transkon-rent.com/api',
    ppBaseUrl: 'https://www.transkon-rent.com/uploads/profile/',
  }),

  actions: {
    setUser({ username, level, roles, token }) {
      this.username = username
      this.level = level
      this.roles = roles
      this.token = token
      localStorage.setItem('jwt', token)
    },

    setProfile({ name, photo}) {
      this.name = name
      this.photo = this.ppBaseUrl + photo
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
