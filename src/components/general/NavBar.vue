<script setup>
import { computed } from "vue"
import { useAuthStore } from "@/store"
import { useDark, useToggle } from "@vueuse/core"
import LogoutUser from "@/components/general/LogoutUser.vue"

const store = useAuthStore()

const isDark = useDark({ attribute: "data-bs-theme" })
const toggleDark = useToggle(isDark)

const currentUser = computed(() => store.isAuthenticated)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container align-items-center">
      <RouterLink to="/" class="navbar-brand">Tasks</RouterLink>

      <LogoutUser v-if="currentUser" title="Logout" />

      <button class="btn mb-1" @click="toggleDark()">
        <i class="bi bi-sun" v-if="isDark"></i>
        <i class="bi bi-moon-fill" v-else></i>
      </button>
    </div>
  </nav>
</template>
