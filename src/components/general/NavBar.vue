<script setup>
import { computed } from "vue"
import { useAuthStore } from "@/store"
import LogoutUser from "@/components/general/LogoutUser.vue"

const store = useAuthStore()

const currentUser = computed(() => store.isAuthenticated)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="text-decoration-none text-dark">Tasks</router-link>
      </div>
      <div class="ms-auto" v-if="currentUser">
        <LogoutUser title="Logout" />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
