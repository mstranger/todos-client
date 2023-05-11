<script setup>
  defineProps({
    message: {type: String, required: true},
    type: {type: String, required: true}
  })
</script>

<template>
  <div class="d-flex me-2" :class="`alert alert-${type}`">
    {{ message }}

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
