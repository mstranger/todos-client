<script setup>
  const props = defineProps({
    data: {type: Object, required: true},
    projectId: {type: Number, required: true}
  })

  const emit = defineEmits(["refreshTasks"])

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  /* actions */

  const handleComments = () => {
    console.log("comments")
  }

  const handleEditDeadline = () => {
    console.log("deadline")
  }

  const handleEditTask = () => {
    console.log("edit task")
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
      emit("refreshTasks")
    }
  }

  const handleTaskUp = () => {
    console.log("task up")
  }

  const handleTaskDown = () => {
    console.log("task down")
  }
</script>

<template>
  <li class="project--task-item d-flex">
    <span class="task-actions position-relative">
      <i class="bi bi-arrow-up-short position-absolute" style="top: -0.5em" @click="handleTaskUp"></i>
      <i class="bi bi-arrow-down-short position-absolute" style="top: 0.5em" @click="handleTaskDown"></i>
    </span>
    <input type="checkbox" class="task-check ms-4" style="margin-right: 0.75em">
    <span class="me-2" contenteditable="false">{{ props.data.title }}</span>
    <span class="task-actions ms-auto me-2" @click="e => e.stopPropagation()">
      <i class="bi bi-chat me-3" style="font-size: 1.0725em" @click="handleComments"></i>
      <i class="bi bi-clock me-3" @click="handleEditDeadline"></i>
      <i class="bi bi-pencil-fill me-3" @click="handleEditTask"></i>
      <i class="bi bi-trash" style="font-size: 1.0725em" @click="handleDeleteTask"></i>
    </span>
  </li>
</template>

<style scoped>
  .project--task-item {
    border: 1px solid lightgray;
    border-bottom: none;
    padding: 0.75em 1.15em;
  }

  .task-check:hover {
    cursor: pointer;
  }

  .task-actions .bi:hover {
    color: firebrick;
    cursor: pointer;
  }
</style>
