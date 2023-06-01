<script setup>
defineProps({ active: Boolean })
</script>

<template>
  <div v-if="active" class="text-center mb-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="text-secondary text-small ps-2">loading...</div>
  </div>
</template>
