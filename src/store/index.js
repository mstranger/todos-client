import { defineStore } from "pinia"
import jwt_decode from "jwt-decode"

let timer

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      userToken: null,
      userEmail: null,
      didAutoLogout: false
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
      this.didAutoLogout = false

      localStorage.setItem("token", token)

      const restTime = jwt_decode(token).exp * 1000 - new Date().getTime()
      timer = setTimeout(this.logout, restTime)
    },

    logout() {
      this.userToken = null
      this.userEmail = null
      this.didAutoLogout = true
      localStorage.removeItem("token")

      clearTimeout(timer)
    },

    // restore session
    tryLogin() {
      const token = localStorage.getItem("token")

      if (token) {
        const expireIn = jwt_decode(token).exp * 1000

        // session expired
        if (expireIn - new Date().getTime() < 0) this.logout()
        else this.login(token)
      }
    }
  }
})
