<script setup>
import { ref, onMounted } from "vue"

const props = defineProps(["time", "date"])
const emit = defineEmits(["closeDeadlineForm", "update:time", "update:date"])

const timeField = ref(null)
const dateField = ref(null)

onMounted(() => {
  dateField.value = props.date
  timeField.value = props.time
})

const handleSaveDeadline = () => {
  emit("update:date", dateField.value)
  emit("update:time", timeField.value)
  emit("closeDeadlineForm", {saveDB: true})
}
</script>

<template>
  <div class="position-absolute card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="w-100 text-center">Deadline</h5>
      <button type="button" class="btn-close" @click="$emit('closeDeadlineForm')"></button>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col col-6">
          <label for="date">Date</label>
        </div>
        <div class="col col-6">
          <label for="time">Time</label>
        </div>
      </div>
      <div class="row">
        <div class="col col-6">
          <input type="date" id="date"
            class="form-controll w-100"
            :value="date"
            @change="dateField=$event.target.value">
        </div>
        <div class="col col-6">
          <input type="time" id="time"
            class="form-controll w-100"
            min="00:00" max="23:59"
            :value="time"
            @change="timeField=$event.target.value">
        </div>
      </div>
      <div class="row mt-3">
        <div class="col text-center">
          <button class="btn btn-lg btn-primary px-4" @click="handleSaveDeadline">Save</button>
          <button class="btn btn-lg px-4" @click="$emit('closeDeadlineForm')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    width: 22rem;
    right: 0.5rem;
    top: 1rem;
    z-index: 99;
    box-shadow: 1px 1px 2px lightgray;
  }
</style>
