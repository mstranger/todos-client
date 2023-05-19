<script setup>
import { computed } from "vue"
import { useAuthStore } from "@/store"
import LogoutUser from "@/components/general/LogoutUser.vue"

const store = useAuthStore()

const currentUser = computed(() => store.isAuthenticated)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container align-items-center">
      <div class="navbar-brand">
        <router-link to="/" class="text-decoration-none text-dark">Tasks</router-link>
      </div>

      <logout-user v-if="currentUser" title="Logout" />
    </div>
  </nav>
</template>

<style scoped></style>
