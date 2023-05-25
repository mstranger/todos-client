<script setup>
defineProps({
  message: { type: String, required: true },
  type: { type: String, required: true }
})
</script>

<template>
  <div class="d-flex" :class="`alert alert-${type}`">
    <span class="me-2">{{ message }}</span>

    <span class="ms-auto" title="Close" @click="$emit('clearMessages', type)">
      <i class="bi bi-x-circle"></i>
    </span>
  </div>
</template>

<style scoped>
.bi-x-circle:hover {
  cursor: pointer;
}
</style>
