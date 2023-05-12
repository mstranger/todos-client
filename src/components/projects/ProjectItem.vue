<script setup>
  import { ref, onMounted } from "vue"
  import TaskItem from "@/components/projects/TaskItem.vue"

  const emit = defineEmits(['handleErrors', 'deleteProject'])

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  const props = defineProps({
    data: {type: Object, required: true}
  })

  const tasks = ref([])
  const closed = ref(true)
  const editMode = ref(false)
  const target = ref(null)
  const oldProjectName = ref("")

  onMounted(async () => {
    const requestTasks = async projectId => {
      let response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}/tasks`, {
        method: "GET",
        headers: { Authorization: `HS256 ${utoken}` }
      })

      return await response.json()
    }

    const response = await requestTasks(props.data.id)
    tasks.value = response.data.map(t => t.data.attributes)
  })

  /* actions */

  // TODO: edit via new component?
  const handleEditProject = () => {
    editMode.value = true
    oldProjectName.value = target.value.innerText.trim()
    target.value.setAttribute("contenteditable", true)
    target.value.focus()
  }

  const handleSaveEdit = async () => {
    const newProjectName = target.value.innerText.trim()

    emit("handleErrors", [])

    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.data.id}`, {
      method: "PUT",
      headers: {
        Authorization: `HS256 ${utoken}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `data[name]=${newProjectName}`
    })

    response = await response.json()

    if (response.errors) {
      emit("handleErrors", response.errors)
      target.value.innerText = oldProjectName.value
    }

    resetEditMode()
  }

  const handleCancelEdit = () => {
    target.value.innerText = oldProjectName.value
    resetEditMode()
  }

  const handleEnter = (e) => {
    e.preventDefault()
    handleSaveEdit()
  }

  const resetEditMode = () => {
    editMode.value = false
    target.value.setAttribute("contenteditable", false)
    oldProjectName.value = ""
  }
</script>

<template>
  <div class="project">
    <header class="project-header d-flex" @click="closed = !closed">
      <span class="ps-3" v-if="closed"><i class="bi bi-caret-right-fill"></i></span>
      <span class="ps-3" v-else><i class="bi bi-caret-down-fill"></i></span>

      <div ref="target" class="project-name ms-1 px-2" contenteditable="false"
           @click="e => {if (editMode) e.stopPropagation()}"
           @keydown.enter="handleEnter"
           @keyup.escape="handleCancelEdit">
        {{ props.data.attributes.name }}
      </div>

      <div class="project-actions ms-auto me-4" @click="e => e.stopPropagation()">
        <i class="bi bi-pencil-fill me-3"
           @click="handleEditProject"></i>
        <i class="bi bi-trash" style="font-size: 1.0725em"
           @click="$emit('deleteProject', props.data.id)"></i>
      </div>
    </header>

    <div v-if="editMode" class="my-2">
      <button class="btn btn-lg btn-primary px-4" @click="handleSaveEdit">Save</button>
      <button class="btn btn-lg" @click="handleCancelEdit">Cancel</button>
    </div>

    <div class="project-body" v-if="!closed">
      <ul class="list-unstyled tasks-list">
        <TaskItem :data="task" v-for="(task, idx) in tasks" :key="idx" />
      </ul>

      <input type="text" class="form-control new-task" placeholder="Enter Task name ..." >
    </div>
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
    background-color: #cee;
    font-weight: 500;
  }

  .project-header:hover {
    cursor: pointer;
  }

  .tasks-list {
    margin-bottom: 0;
  }

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

  .bi-pencil-fill:hover,
  .bi-trash:hover {
    color: firebrick;
  }
</style>
