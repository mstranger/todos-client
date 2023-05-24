<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/store"

const error = ref("")
const store = useAuthStore()
const router = useRouter()

const handleSignIn = async (event) => {
  const emailField = event.target.querySelector("input[name=email]")
  const passwordField = event.target.querySelector("input[name=password]")

  removeInvalidClass(emailField, passwordField)

  // TODO: urls

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      body: new FormData(event.target)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to authenticate")
    }

    store.login(data.token)
    router.push({ name: "root" })
  } catch (e) {
    emailField.classList.add("invalid")
    passwordField.classList.add("invalid")
    error.value = e.message
  }
}

const removeInvalidClass = (...fields) => {
  fields.forEach((t) => t.classList.remove("invalid"))
  error.value = ""
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 parent">
    <form class="col-10 col-sm-6 col-lg-4" @submit.prevent="handleSignIn">
      <h3 class="mb-3">Sign In</h3>
      <div class="mb-2 text-danger">{{ error }}</div>

      <input
        type="email"
        name="email"
        class="form-control form-control-lg mb-2"
        placeholder="User name"
      />
      <input
        type="password"
        name="password"
        class="form-control form-control-lg"
        placeholder="Password"
      />

      <button type="submit" class="btn btn-lg btn-primary my-3">Sign In</button>

      <div class="form-text mt-0">
        Don't have an account?
        <router-link to="signup">Sign up</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.parent {
  min-height: calc(100vh - 5rem);
}
</style>
