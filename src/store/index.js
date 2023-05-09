import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({ userToken: null }),

  getters: {
    token: state => state.userToken,
    isAuthenticated: state => !!state.userToken
  },

  actions: {
    login(token) {
      this.userToken = token
    }
  }
})
