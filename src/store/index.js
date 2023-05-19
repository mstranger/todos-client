import { defineStore } from "pinia"
import jwt_decode from "jwt-decode"

let timer

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      userToken: null,
      userEmail: null
    }
  },

  getters: {
    token: state => state.userToken,
    email: state => state.userEmail,
    isAuthenticated: state => !!state.userToken
  },

  actions: {
    login(token) {
      this.userToken = token
      this.userEmail = jwt_decode(token).email
      localStorage.setItem("token", token)

      const restTime = jwt_decode(token).exp * 1000 - new Date().getTime()

      timer = setTimeout(this.logout, restTime)
    },

    // auto-login
    tryLogin() {
      const token = localStorage.getItem("token")

      if (token) {
        const expireIn = jwt_decode(token).exp * 1000

        // session expired
        if (expireIn - new Date().getTime() < 0) {
          this.logout()
          return
        }

        this.login(token)
      }
    },

    logout() {
      this.userToken = null
      this.userEmail = null
      localStorage.removeItem("token")

      clearTimeout(timer)
    }
  }
})
