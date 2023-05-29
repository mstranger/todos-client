<script setup>
import { useAuthStore } from "@/store"
const store = useAuthStore()

const logout = () => {
  // TODO: via component
  const answer = confirm("You are going to logout. Continue?")
  if (!answer) return
  store.logout()
}
</script>

<template>
  <div class="ms-auto">
    <span class="text-small text-muted">{{ store.email }}</span>

    <button class="btn" @click="logout">
      <i class="bi bi-box-arrow-right fs-5 lh-1"></i>
    </button>
  </div>
</template>

<style scoped>
.btn:hover {
  color: dimgray;
}
</style>
