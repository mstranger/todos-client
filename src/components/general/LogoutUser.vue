<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/store"
import ConfirmModal from "@/components/general/ConfirmModal.vue"

const store = useAuthStore()
const showModal = ref(false)

const logout = (ok) => {
  if (ok) store.logout()
  showModal.value = false
}
</script>

<template>
  <div class="ms-auto">
    <span class="text-small text-muted">{{ store.email }}</span>

    <button class="btn" @click="showModal = true">
      <i class="bi bi-box-arrow-right fs-5 lh-1"></i>
    </button>

    <ConfirmModal
      v-if="showModal"
      title="Logout"
      body="You are going to logout. Continue?"
      @close-modal="showModal = false"
      @confirm-action="logout"
    />
  </div>
</template>

<style scoped>
.btn:hover {
  color: dimgray;
}
</style>
