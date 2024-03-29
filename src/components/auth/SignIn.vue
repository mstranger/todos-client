<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/store"
import { authUrls as url } from "@/rest/endpoints"
import RequestLoader from "@/components/general/RequestLoader.vue"

const error = ref("")
const store = useAuthStore()
const router = useRouter()
const inProgress = ref(false)

const handleSignIn = async (event) => {
  const emailField = event.target.querySelector("input[name=email]")
  const passwordField = event.target.querySelector("input[name=password]")

  removeInvalidClass(emailField, passwordField)

  try {
    inProgress.value = true

    const response = await fetch(url().signin, {
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
    inProgress.value = false
  }
}

const removeInvalidClass = (...fields) => {
  fields.forEach((t) => t.classList.remove("invalid"))
  error.value = ""
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 parent">
    <RequestLoader v-show="inProgress" :active="inProgress" />
    <form v-show="!inProgress" class="col-10 col-sm-6 col-lg-4" @submit.prevent="handleSignIn">
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
        <RouterLink to="signup">Sign up</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.parent {
  min-height: calc(100vh - 5rem);
}
</style>
