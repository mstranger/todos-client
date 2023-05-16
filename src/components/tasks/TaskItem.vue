<script setup>
  import { ref, computed, onMounted } from "vue"
  import DeadlineForm from "@/components/tasks/DeadlineForm.vue"

  const props = defineProps({
    data: {type: Object, required: true},
    projectId: {type: Number, required: true}
  })

  // TODO: refreshTasks
  const emit = defineEmits(["refreshTasks", "deleteTask", "handleErrors", "updateCompletedCount", "refreshTask"])

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  const target = ref(null)
  const editMode = ref(false)
  const oldTaskTitle = ref("")
  const datetimeActive = ref(false)
  const timeValue = ref("00:00")
  const dateValue = ref("")

  onMounted(() => {
    if (props.data.deadline) {
      let arr = props.data.deadline.split("T")
      let d = arr[0]
      let t = arr[1].slice(0, 5)

      timeValue.value = t
      dateValue.value = d
    }
  })

  const urgent = computed(() => {
    let today = new Date()
    let formatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

    return new Date(formatted) < new Date(dateValue.value) ? false : true
  })

  /* actions */

  const handleComments = () => {
    console.log("comments")
  }

  const handleEditDeadline = () => {
    datetimeActive.value = !datetimeActive.value
  }

  const handleEditTask = () => {
    const elem = target.value
    editMode.value = true
    oldTaskTitle.value = elem.innerText.trim()
    elem.setAttribute("contenteditable", true)
    elem.focus()
  }

  const handleDeleteTask = async () => {
    // TODO: confirmation via vue component
    const yes = confirm("Are you sure you want to delete this task?")
    if (!yes) return

    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.data.id}`, {
      method: "DELETE",
      headers: { "Authorization": `HS256 ${utoken}` }
    })

    response = await response.json()

    if (response.error) {
      console.error(response.error)
    } else {
      // TODO: here delete from parent data props
      emit("deleteTask", props.data.id)
    }
  }


  // TODO: think about change position
  const handleChangePriority = async (n) => {
    let taskPriority = props.data.priority

    if (taskPriority === 0 && n === -1) return

    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.data.id}`, {
      method: "PUT",
      headers: {
        Authorization: `HS256 ${utoken}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `data[priority]=${taskPriority + n}`
    })

    response = await response.json()

    if (response.error) {
      console.log(response.error)
      return
    }

    emit("refreshTask", props.data.id)
  }

  // TODO: move the url path to other file

  const handleSaveEdit = async () => {
    const newTaskTitle = target.value.innerText.trim()

    emit("handleErrors", [])

    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.data.id}`, {
      method: "PUT",
      headers: {
        Authorization: `HS256 ${utoken}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `data[title]=${newTaskTitle}`
    })

    response = await response.json()

    if (response.errors) {
      emit("handleErrors", response.errors)
      target.value.focus()
      return
    }

    emit("refreshTask", props.data.id)
    resetEditMode()
  }

  const handleToggleCheck = async (e) => {
    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.data.id}/toggle`, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    response = await response.json()

    if (response.error) {
      console.error(response.error)
      return
    }

    emit("updateCompletedCount", e.target.checked === true ? 1 : -1)
    emit("refreshTask", props.data.id)
  }

  const handleEnter = (e) => {
    e.preventDefault()
    handleSaveEdit()
  }

  const handleCancelEdit = () => {
    target.value.innerText = oldTaskTitle.value
    emit("handleErrors", [])
    resetEditMode()
  }

  // TODO: separate file with requests

  const handleCloseDeadlineForm = async (params) => {
    if (params?.saveDB) {
      // update database record
      let newDeadline = dateValue.value !== "" ? `${dateValue.value} ${timeValue.value}` : ""

      let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.data.id}`, {
        method: "PUT",
        headers: {
          Authorization: `HS256 ${utoken}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data[deadline]=${newDeadline}`
      })

      response = await response.json()

      if (response.error) {
        console.log(response.error)
        return
      }

      emit("refreshTask", props.data.id)
    }

    datetimeActive.value=false
  }

  const resetEditMode = () => {
    editMode.value = false
    target.value.setAttribute("contenteditable", false)
    oldTaskTitle.value = ""
  }
</script>

<template>
  <li class="project--task-item position-relative d-flex align-items-center">
    <span class="task-actions">
      <i class="bi bi-arrow-up-short position-absolute" style="top: 0.5em"
         @click="handleChangePriority(1)"></i>
      <i class="bi bi-arrow-down-short position-absolute" style="top: 1.5em"
         @click="handleChangePriority(-1)"></i>
    </span>
    <input type="checkbox" class="task-check ms-4 me-1"
           :checked="props.data.completed"
           @change="handleToggleCheck">
    <div class="me-2 px-2 d-flex flex-column justify-content-center">
      <span class="task-title" ref="target" contenteditable="false"
          @keydown.enter="handleEnter">{{ props.data.title }}</span>
      <span v-if="dateValue" class="form-text"
            :class="urgent ? 'text-danger' : 'text-success'">
        {{ `${dateValue} ${timeValue}` }}
      </span>
    </div>
    <span class="task-actions ms-auto me-2" @click="e => e.stopPropagation()">
      <i class="bi bi-chat me-3" style="font-size: 1.0725em" @click="handleComments"></i>
      <i class="bi bi-clock me-3" @click="handleEditDeadline"></i>
      <i class="bi bi-pencil-fill me-3" @click="handleEditTask"></i>
      <i class="bi bi-trash" style="font-size: 1.0725em" @click="handleDeleteTask"></i>
    </span>

    <DeadlineForm v-if="datetimeActive"
      @close-deadline-form="handleCloseDeadlineForm"
      v-model:time="timeValue"
      v-model:date="dateValue"/>
  </li>
  <li class="project--task-item-buttons p-3" v-if="editMode">
    <button class="btn btn-lg btn-success px-4"
            @click="handleSaveEdit">Save</button>
    <button class="btn btn-lg"
            @click="handleCancelEdit">Cancel</button>
  </li>
</template>

<style scoped>
  .project--task-item {
    border: 1px solid lightgray;
    border-bottom: none;
    min-height: 3em;
  }

  .project--task-item-buttons {
    border: 1px solid lightgray;
    border-bottom: none;
  }

  .task-check:hover {
    cursor: pointer;
  }

  .task-actions:first-child {
    margin-left: 1.25em;
    line-height: 1em;
  }

  .task-actions .bi:hover {
    color: firebrick;
    cursor: pointer;
  }

  .task-check:checked + .task-title {
    text-decoration: line-through;
  }

  .form-text {
    font-size: 0.75em;
  }
</style>
