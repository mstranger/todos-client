<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue"
import TasksIndex from "@/components/tasks/TasksIndex.vue"
import { requestTasks } from "@/rest/actions/task"

const emit = defineEmits(["handleErrors", "editProject", "deleteProject"])

const props = defineProps({
  data: { type: Object, required: true },
  utoken: { type: String, required: true }
})

const title = ref(props.data.attributes.name)
const tasks = ref([])
const closed = ref(true)
const editMode = ref(false)
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

const handleEditProject = () => {
  editMode.value = true

  nextTick(() => {
    let elem = document.querySelector("#project-edit")
    oldProjectName.value = title.value
    elem.focus()
  })
}

const handleSaveEdit = () => {
  const newProjectName = title.value
  emit("editProject", { newProjectName, oldProjectName, editMode, projectId: props.data.id })
}

const handleCancelEdit = () => {
  title.value = oldProjectName.value
  resetEditMode()
}

const resetEditMode = () => {
  editMode.value = false
  oldProjectName.value = ""
  emit("handleErrors", [])
}
</script>

<template>
  <div class="project">
    <div v-if="!editMode" class="project-main d-flex position-relative" @click="closed = !closed">
      <span
        v-if="tasks.length > 0 && allTasksDone"
        class="d-block position-absolute text-success"
        style="top: -0.7em; left: 0.15em; font-size: 1.25em"
      >
        <i class="bi bi-check-all"></i>
      </span>

      <span class="ps-3" v-if="closed"><i class="bi bi-caret-right-fill"></i></span>
      <span class="ps-3" v-else><i class="bi bi-caret-down-fill"></i></span>

      <div class="project-name ms-1 px-2">{{ title }}</div>

      <div class="project-actions ms-auto me-4" @click="(e) => e.stopPropagation()">
        <i class="bi bi-pencil-fill me-3" @click="handleEditProject"></i>
        <i
          class="bi bi-trash"
          style="font-size: 1.0725em"
          @click="emit('deleteProject', props.data.id)"
        ></i>
      </div>
    </div>

    <div v-if="editMode" class="project-name">
      <input
        type="text"
        id="project-edit"
        class="form-control project--edit"
        v-model.trim="title"
        @keydown.enter.prevent="handleSaveEdit"
        @keyup.escape="handleCancelEdit"
      />
    </div>

    <div v-if="editMode" class="my-2">
      <button class="btn btn-lg btn-primary px-4" @click="handleSaveEdit">Save</button>
      <button class="btn btn-lg hover-shadow" @click="handleCancelEdit">Cancel</button>
    </div>

    <TasksIndex
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

.project--edit {
  line-height: 2.2em;
  padding-left: 3.1em;
}

.project--edit:focus {
  border-radius: 0 !important;
}

.project-main {
  border: 1px solid lightgray;
  border-bottom: none;
  line-height: 3em;
  padding-left: 0.35em;
  background-color: #e1e7f3;
  font-weight: 500;
}

.project-main:hover {
  cursor: pointer;
  background-color: #cfd8ec;
}

.project-main:hover > .project-actions {
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
