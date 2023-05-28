<script setup>
import PopupModal from "@/components/general/PopupModal.vue"

defineProps({
  title: { type: String, required: true },
  body: { type: String, required: true }
})

const emit = defineEmits(["close-modal", "confirm-action"])
</script>

<template>
  <PopupModal>
    <div class="card">
      <div class="card-header d-flex align-items-center justify-content-between">
        <span class="h5 my-2">{{ title }}</span>
        <button class="btn-close" @click="emit('close-modal')"></button>
      </div>

      <div class="card-body">
        <div class="card-text my-2">{{ body }}</div>
      </div>

      <div class="card-footer text-end py-3">
        <button class="btn btn-lg btn-primary px-4" @click="emit('confirm-action', true)">
          Delete
        </button>
        <button class="btn btn-lg hover-shadow px-4" @click="emit('confirm-action', false)">
          Cancel
        </button>
      </div>
    </div>
  </PopupModal>
</template>

<style scoped>
.card-header {
  background-color: inherit;
}
</style>
