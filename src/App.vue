<script setup>
import { watch } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/store"
import NavBar from "@/components/general/NavBar.vue"

const store = useAuthStore()
const router = useRouter()

// auto logout when session expired
watch(
  () => store.didAutoLogout,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      router.replace("/auth/signin")
    }
  }
)

useAuthStore().tryLogin()
</script>

<template>
  <NavBar />
  <RouterView />
</template>
