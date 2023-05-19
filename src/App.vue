<script setup>
  import NavBar from "@/components/general/NavBar.vue"
  import { useAuthStore } from "@/store"

  // TODO: try invalid token errors handler

  useAuthStore().tryLogin()
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style scoped>
</style>
