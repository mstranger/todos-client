<script setup>
  import { computed } from "vue"
  import { useAuthStore } from "@/store"

  const store = useAuthStore()

  const currentUser = computed(() => store.isAuthenticated)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container">
      <div class="navbar-brand">Tasks</div>
      <div class="ms-auto">
        Loged user: {{ currentUser }}
      </div>
    </div>
  </nav>
</template>

<style scoped>
</style>
