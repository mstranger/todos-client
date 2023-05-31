<script setup>
import { ref, watch, computed, onUnmounted } from "vue"
import TaskItem from "@/components/tasks/TaskItem.vue"
import { getTask, createTask, deleteTask } from "@/rest/actions/task"
import ConfirmModal from "@/components/general/ConfirmModal.vue"

const props = defineProps({
  data: { type: Array, required: true },
  projectId: { type: Number, required: true },
  utoken: { type: String, required: true }
})

const emit = defineEmits(["refreshTasks", "updateCompletedCount"])

const tasks = ref(props.data)
const newTask = ref("")
const errors = ref([])
const showModal = ref(false)
const taskIdToDelete = ref(null)
const needRefresh = ref(false)

const hasErrors = computed(() => errors.value.length > 0)

watch(
  () => props.data,
  () => (tasks.value = props.data)
)

onUnmounted(() => {
  if (!needRefresh.value) return
  emit("refreshTasks")
  needRefresh.value = false
})

/* actions */

const refreshTask = async (taskId) => {
  const elem = await getTask({ projectId: props.projectId, utoken: props.utoken, taskId })
  const idx = props.data.findIndex((t) => t.id === elem.id)

  tasks.value.splice(idx, 1, elem)
  tasks.value.sort((t1, t2) => {
    if (t1.priority === t2.priority) return new Date(t1.created_at) - new Date(t2.created_at)
    return t2.priority - t1.priority
  })
}

const handleUpdateOrder = ({ id, direction }) => {
  let count = tasks.value.length
  let arr = tasks.value
  let idx = tasks.value.findIndex((t) => t.id === id)

  if (direction === "up" && idx > 0) {
    tasks.value = [...arr.slice(0, idx - 1), arr[idx], arr[idx - 1], ...arr.slice(idx + 1)]
  }

  if (direction === "down" && idx < count - 1) {
    tasks.value = [...arr.slice(0, idx), arr[idx + 1], arr[idx], ...arr.slice(idx + 2)]
  }

  needRefresh.value = true
}

const handleDeleteTask = (taskId) => {
  errors.value = []
  showModal.value = true
  taskIdToDelete.value = taskId
}

const confirmDeletion = async (result) => {
  if (result) {
    const errs = await deleteTask({
      projectId: props.projectId,
      taskId: taskIdToDelete.value,
      utoken: props.utoken
    })

    if (errs) {
      errors.value = errs
    } else {
      const idx = props.data.findIndex((t) => t.id === taskIdToDelete.value)
      tasks.value.splice(idx, 1)
    }
  }

  taskIdToDelete.value = null
  showModal.value = false
}

const handleCreateTask = async (e) => {
  clearErrors()
  const data = new FormData(e.target)

  const ok = await createTask({ data, errors, projectId: props.projectId, utoken: props.utoken })
  if (!ok) return

  emit("refreshTasks")
  newTask.value = ""
}

const handleNewTaskCancel = () => {
  newTask.value = ""
  clearErrors()
}

const handleCloseModal = () => {
  showModal.value = false
  taskIdToDelete.value = null
}

const clearErrors = () => (errors.value = [])
</script>

<template>
  <div class="position-relative">
    <ul class="list-unstyled tasks-list mb-0">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :data="task"
        :projectId="props.projectId"
        :utoken="props.utoken"
        @update-order="handleUpdateOrder"
        @handle-errors="errors = $event"
        @refresh-task="refreshTask"
        @delete-task="handleDeleteTask"
        @update-completed-count="$emit('updateCompletedCount', $event)"
      />

      <li>
        <form @submit.prevent="handleCreateTask">
          <input
            type="text"
            name="data[title]"
            class="form-control new-task ps-4"
            placeholder="Enter Task name ..."
            v-model="newTask"
          />

          <div class="py-2 new-task-buttons" v-if="newTask">
            <button type="submit" class="btn btn-lg btn-success ms-4 px-4">Save</button>
            <button
              type="reset"
              class="btn btn-lg px-4 hover-shadow"
              @click.prevent="handleNewTaskCancel"
            >
              Cancel
            </button>
          </div>

          <div v-if="hasErrors" class="d-flex justify-content-between align-items-center">
            <ul class="list-unstyled">
              <li v-for="(msg, idx) in errors" :key="idx" class="ps-3 text-danger form-text">
                {{ msg }}
              </li>
            </ul>
            <span class="me-3 text-small text-danger pointer" @click="clearErrors">&#128473;</span>
          </div>
        </form>
      </li>
    </ul>

    <ConfirmModal
      v-if="showModal"
      title="Delete task"
      body="Do you realy want to delete this task?"
      okButton="Delete"
      @close-modal="handleCloseModal"
      @confirm-action="confirmDeletion"
    />
  </div>
</template>

<style scoped>
.new-task {
  line-height: 3em;
  padding: 0;
  padding-left: 1em;
  border-radius: 0 !important;
}

.new-task:focus {
  box-shadow: none;
}

.new-task::placeholder {
  color: #acacac;
}

.new-task-buttons {
  border: 1px solid lightgray;
  border-top: none;
}
</style>
