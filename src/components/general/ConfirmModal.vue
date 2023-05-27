<script setup>
defineProps({
  title: { type: String, required: true },
  body: { type: String, required: true }
})
</script>

<template>
  <transition name="fade">
    <div class="modal-overlay" @click="$emit('close-modal')">
      <div class="card modal-body" @click.stop>
        <div class="card-header d-flex justify-content-between">
          <span class="h5">{{ title }}</span>
          <button class="btn-close" @click="$emit('close-modal')"></button>
        </div>
        <div class="card-body">
          <div class="card-text my-2">{{ body }}</div>
        </div>
        <div class="card-footer text-end py-3">
          <button class="btn btn-lg btn-primary px-4" @click="$emit('confirm-action', true)">
            Delete
          </button>
          <button class="btn btn-lg hover-shadow px-4" @click="$emit('confirm-action', false)">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}

.card-header {
  padding-top: 0.75em;
  background-color: inherit;
}

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  background-color: #00000050;
}

.modal-body {
  width: 32em;
  margin: 0 auto;
  margin-top: 10%;
  position: relative;
}
</style>
