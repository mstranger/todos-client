<script setup>
import { ref, computed, onMounted, nextTick } from "vue"
import DeadlineForm from "@/components/tasks/DeadlineForm.vue"
import AddComment from "@/components/comments/AddComment.vue"
import { updateTask, toggleDone, changeOrder } from "@/rest/actions/task"

const props = defineProps({
  data: { type: Object, required: true },
  projectId: { type: Number, required: true },
  utoken: { type: String, required: true }
})

// TODO: refreshTasks
const emit = defineEmits([
  "refreshTasks",
  "deleteTask",
  "handleErrors",
  "updateCompletedCount",
  "refreshTask",
  "updateOrder"
])

const title = ref(props.data.title)
const editMode = ref(false)
const oldTaskTitle = ref("")
const datetimeActive = ref(false)
const timeValue = ref("12:00")
const dateValue = ref("")
const showModal = ref(false)
const commentsCount = ref(null)

onMounted(() => {
  if (props.data.deadline) {
    const datetime = props.data.deadline.split("T")
    let date = datetime[0]
    let time = datetime[1].slice(0, 5)

    timeValue.value = time
    dateValue.value = date
  }

  commentsCount.value = props.data.commentsCount
})

const urgency = computed(() => {
  let today = new Date()
  let formatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  return new Date(formatted) < new Date(dateValue.value) ? false : true
})

/* actions */

const handleEditDeadline = () => {
  datetimeActive.value = !datetimeActive.value
}

const handleEditTask = () => {
  editMode.value = true

  nextTick(() => {
    let elem = document.querySelector("#task-edit")
    oldTaskTitle.value = title.value
    elem.focus()
  })
}

// TODO: remove after change on server

/*
const handleChangePriority = async (n) => {
  emit("handleErrors", [])

  let taskPriority = props.data.priority

  if (taskPriority === 0 && n === -1) return

  const data = `data[priority]=${taskPriority + n}`

  let errors = await updateTask({
    data,
    projectId: props.projectId,
    taskId: props.data.id,
    utoken: props.utoken
  })

  if (errors) emit("handleErrors", errors)
  else emit("refreshTask", props.data.id)
}
*/

const handleChangeOrder = async (direction) => {
  emit("handleErrors", [])

  let errors = await changeOrder({
    direction,
    projectId: props.projectId,
    taskId: props.data.id,
    utoken: props.utoken
  })

  if (errors) emit("handleErrors", errors)
  else emit("updateOrder", {direction, id: props.data.id})
}

const handleSaveEdit = async () => {
  emit("handleErrors", [])

  const data = `data[title]=${title.value}`

  let errors = await updateTask({
    data,
    projectId: props.projectId,
    taskId: props.data.id,
    utoken: props.utoken
  })

  if (errors) {
    emit("handleErrors", errors)
    document.querySelector("#task-edit").focus()
  } else {
    emit("refreshTask", props.data.id)
    resetEditMode()
  }
}

const handleToggleCheck = async (e) => {
  emit("handleErrors", [])

  let errors = await toggleDone({
    projectId: props.projectId,
    taskId: props.data.id,
    utoken: props.utoken
  })

  if (errors) {
    emit("handleErrors", errors)
  } else {
    emit("updateCompletedCount", e.target.checked === true ? 1 : -1)
    emit("refreshTask", props.data.id)
  }
}

const handleCancelEdit = () => {
  title.value = oldTaskTitle.value
  emit("handleErrors", [])
  resetEditMode()
}

const handleCloseDeadlineForm = async (params) => {
  emit("handleErrors", [])

  if (params?.saveDB) {
    // update database record
    let newDeadline = dateValue.value !== "" ? `${dateValue.value} ${timeValue.value}` : ""

    const data = `data[deadline]=${newDeadline}`

    let errors = await updateTask({
      data,
      projectId: props.projectId,
      taskId: props.data.id,
      utoken: props.utoken
    })

    if (errors) emit("handleErrors", errors)
    else emit("refreshTask", props.data.id)
  }

  datetimeActive.value = false
}

const handleChangeCommentsCount = (value) => {
  commentsCount.value += value
  emit("refreshTask", props.data.id)
}

const resetEditMode = () => {
  editMode.value = false
  oldTaskTitle.value = ""
}
</script>

<template>
  <Teleport to="body">
    <AddComment
      v-show="showModal"
      :projectId="props.projectId"
      :taskId="props.data.id"
      :utoken="props.utoken"
      @close-modal="showModal = false"
      @change-comments-count="handleChangeCommentsCount"
    />
  </Teleport>

  <li v-if="!editMode" class="project--task-item position-relative d-flex align-items-center">
    <span class="task-actions">
      <i
        class="bi bi-arrow-up-short position-absolute"
        style="top: 0.5em; left: 0.85em"
        @click="handleChangeOrder('up')"
      ></i>
      <i
        class="bi bi-arrow-down-short position-absolute"
        style="top: 1.5em; left: 0.85em"
        @click="handleChangeOrder('down')"
      ></i>
    </span>
    <input
      type="checkbox"
      class="task-check ms-3 me-1 mt-1"
      :checked="props.data.completed"
      @change="handleToggleCheck"
    />
    <div class="me-2 d-flex flex-column justify-content-center">
      <span class="task-title px-2">{{ title }}</span>
      <span
        v-if="dateValue"
        class="form-text px-2"
        :class="urgency ? 'text-danger' : 'text-success'"
      >
        {{ `${dateValue} ${timeValue}` }}
      </span>
    </div>
    <span class="task-actions ms-auto me-2" @click="(e) => e.stopPropagation()">
      <span v-if="commentsCount > 0" class="me-1" style="font-size: 0.85rem">
        {{ commentsCount }}
      </span>
      <i class="bi bi-chat me-3" style="font-size: 1.0725em" @click="showModal = true"></i>
      <i class="bi bi-clock me-3" @click="handleEditDeadline"></i>
      <i class="bi bi-pencil-fill me-3" @click="handleEditTask"></i>
      <i
        class="bi bi-trash"
        style="font-size: 1.0725em"
        @click="emit('deleteTask', props.data.id)"
      ></i>
    </span>

    <DeadlineForm
      v-if="datetimeActive"
      @close-deadline-form="handleCloseDeadlineForm"
      v-model:time="timeValue"
      v-model:date="dateValue"
    />
  </li>

  <li v-if="editMode" class="project--task-item">
    <input
      type="text"
      id="task-edit"
      class="form-control project--task-item__edit"
      v-model.trim="title"
      @keyup.esc="handleCancelEdit"
      @keydown.enter.prevent="handleSaveEdit"
    />
  </li>

  <li v-if="editMode" class="project--task-item-buttons p-3">
    <button class="btn btn-lg btn-success px-4" @click="handleSaveEdit">Save</button>
    <button class="btn btn-lg hover-shadow" @click="handleCancelEdit">Cancel</button>
  </li>
</template>

<style scoped>
.project--task-item {
  border: 1px solid lightgray;
  border-bottom: none;
  min-height: 3em;
}

.project--task-item__edit {
  line-height: 2.2em;
  border: none;
  padding-left: 3.875em;
}

.project--task-item__edit:focus {
  box-shadow: none !important;
}

.project--task-item-buttons {
  border: 1px solid lightgray;
  border-bottom: none;
}

.project--task-item:hover {
  background-color: rgb(250, 250, 250);
}

.project--task-item:hover > .task-actions {
  visibility: visible;
}

.task-check:hover {
  cursor: pointer;
}

.task-actions {
  visibility: hidden;
}

.task-actions:first-child {
  margin-left: 1.25em;
  line-height: 1em;
}

.task-actions .bi:hover {
  color: firebrick;
  cursor: pointer;
}

.task-check:checked + div > .task-title {
  text-decoration: line-through;
  color: gray;
}

.form-text {
  font-size: 0.7em;
  margin-top: 0;
  opacity: 0.85;
}
</style>
