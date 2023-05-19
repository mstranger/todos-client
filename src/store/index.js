import { defineStore } from "pinia"
import jwt_decode from "jwt-decode"

export const useAuthStore = defineStore("auth", {
  state: () => ({ userToken: null, userEmail: null }),

  getters: {
    token: state => state.userToken,
    email: state => state.userEmail,
    isAuthenticated: state => !!state.userToken
  },

  actions: {
    login(token) {
      this.userToken = token
      this.userEmail = jwt_decode(token).email
    },

    logout() {
      this.userToken = null
    }
  }
})
