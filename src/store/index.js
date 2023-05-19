import { defineStore } from "pinia"
import jwt_decode from "jwt-decode"

export const useAuthStore = defineStore("auth", {
  state: () => ({ userToken: null, userEmail: null }),

  getters: {
    token: state => state.userToken,
    email: state => state.userEmail,
    isAuthenticated: state => !!state.userToken
  },

  // TODO: localStorage.setItem here?

  actions: {
    login(token) {
      this.userToken = token
      this.userEmail = jwt_decode(token).email
    },

    // auto-login
    tryLogin() {
      const token = localStorage.getItem("token")

      if (token) {
        const expireIn = jwt_decode(token).exp * 1000

        // session expired
        if (expireIn - new Date().getTime() < 0) {
          localStorage.removeItem("token")
          return
        }

        this.login(token)
      }
    },

    logout() {
      this.userToken = null
      this.userEmail = null
    }
  }
})
