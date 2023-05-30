<script setup>
import { ref } from "vue"

const modalBody = ref(null)

const handleClickOuter = () => {
  modalBody.value.classList.add("larger")
  setTimeout(() => modalBody.value.classList.remove("larger"), 125)
}
</script>

<template>
  <Transition name="fade">
    <div class="modal-overlay" @click="handleClickOuter">
      <div class="modal-body" @click.stop ref="modalBody">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  justify-content: center;
  background-color: #00000050;
  z-index: 99;
}

.modal-body {
  width: 36em;
  max-height: 32em;
  overflow: scroll;
  margin: 0 auto;
  margin-top: 5%;
  margin-bottom: 2em;
  position: relative;
  transition: 0.2s ease;
}

.larger {
  scale: 1.05;
}
</style>
