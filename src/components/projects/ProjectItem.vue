<script setup>
import { ref, onMounted, watch, computed } from "vue"
import TasksIndex from "@/components/tasks/TasksIndex.vue"
import { requestTasks } from "@/rest/actions/task"

const emit = defineEmits(["handleErrors", "editProject", "deleteProject"])

const props = defineProps({
  data: { type: Object, required: true },
  utoken: { type: String, required: true }
})

const tasks = ref([])
const closed = ref(true)
const editMode = ref(false)
const target = ref(null)
const oldProjectName = ref("")

const totalTaskCount = ref(0)
const completedTaskCount = ref(0)

const allTasksDone = computed(() => totalTaskCount.value == completedTaskCount.value)

onMounted(() => handleRequestTasks())

watch(tasks, () => {
  totalTaskCount.value = tasks.value.length
  completedTaskCount.value = tasks.value.filter((t) => t.completed === true).length
})

/* actions */

const handleRequestTasks = async () => {
  tasks.value = await requestTasks({ projectId: props.data.id, utoken: props.utoken })
}

// TODO: edit via new component?
const handleEditProject = () => {
  const elem = target.value
  editMode.value = true
  oldProjectName.value = elem.innerText.trim()
  elem.setAttribute("contenteditable", true)
  elem.focus()
}

const handleSaveEdit = () => {
  const newProjectName = target.value.innerText.trim()
  emit("editProject", { target, newProjectName, oldProjectName, projectId: props.data.id })
  resetEditMode()
}

const handleCancelEdit = () => {
  target.value.innerText = oldProjectName.value
  resetEditMode()
}

const resetEditMode = () => {
  editMode.value = false
  target.value.setAttribute("contenteditable", false)
  oldProjectName.value = ""
}
</script>

<template>
  <div class="project">
    <header class="project-header d-flex position-relative" @click="closed = !closed">
      <span
        v-if="tasks.length > 0 && allTasksDone"
        class="d-block position-absolute text-success"
        style="top: -0.7em; left: 0.15em; font-size: 1.25em"
      >
        <i class="bi bi-check-all"></i>
      </span>

      <span class="ps-3" v-if="closed"><i class="bi bi-caret-right-fill"></i></span>
      <span class="ps-3" v-else><i class="bi bi-caret-down-fill"></i></span>

      <div
        ref="target"
        class="project-name ms-1 px-2"
        contenteditable="false"
        @click="(e) => (editMode ? e.stopPropagation() : null)"
        @keydown.enter.prevent="handleSaveEdit"
        @keyup.escape="handleCancelEdit"
      >
        {{ props.data.attributes.name }}
      </div>

      <div class="project-actions ms-auto me-4" @click="(e) => e.stopPropagation()">
        <i class="bi bi-pencil-fill me-3" @click="handleEditProject"></i>
        <i
          class="bi bi-trash"
          style="font-size: 1.0725em"
          @click="$emit('deleteProject', props.data.id)"
        ></i>
      </div>
    </header>

    <div v-if="editMode" class="my-2">
      <button class="btn btn-lg btn-primary px-4" @click="handleSaveEdit">Save</button>
      <button class="btn btn-lg hover-shadow" @click="handleCancelEdit">Cancel</button>
    </div>

    <tasks-index
      v-if="!closed"
      :data="tasks"
      :projectId="props.data.id"
      :utoken="props.utoken"
      @refresh-tasks="handleRequestTasks"
      @update-completed-count="completedTaskCount += $event"
    />
  </div>
</template>

<style scoped>
.project {
  margin-bottom: 0.5em;
}

.project-name:focus {
  cursor: text;
}

.project-header {
  border: 1px solid lightgray;
  border-bottom: none;
  line-height: 3em;
  padding-left: 0.35em;
  background-color: #e1e7f3; /* #cee */
  font-weight: 500;
}

.project-header:hover {
  cursor: pointer;
  background-color: #cfd8ec;
}

.project-header:hover > .project-actions {
  visibility: visible;
}

.project-actions {
  visibility: hidden;
}

.bi-pencil-fill:hover,
.bi-trash:hover {
  color: firebrick;
}
</style>
