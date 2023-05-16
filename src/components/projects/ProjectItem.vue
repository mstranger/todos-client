<script setup>
  import { ref, onMounted, computed } from "vue"
  import TasksIndex from "@/components/tasks/TasksIndex.vue"

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

  const totalTaskCount = ref(0)
  const completedTaskCount = ref(0)

  onMounted(() => requestTasks(props.data.id))

  const allTasksDone = computed(() =>
    totalTaskCount.value == completedTaskCount.value
  )

  const requestTasks = async (projectId) => {
    let response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}/tasks`, {
      method: "GET",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    response = await response.json()

    tasks.value = response.data.map(t => {
      return {
        ...t.data.attributes,
        id: t.data.id,
        commentsCount: t.data.relationships.comments.data.length
      }
    })

    totalTaskCount.value = tasks.value.length
    completedTaskCount.value = tasks.value.filter(t => t.completed === true).length
  }

  /* actions */

  // TODO: edit via new component?
  const handleEditProject = () => {
    const elem = target.value
    editMode.value = true
    oldProjectName.value = elem.innerText.trim()
    elem.setAttribute("contenteditable", true)
    elem.focus()
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

  const updateCompletedTaskCount = (n) => {
    completedTaskCount.value += n
  }
</script>

<template>
  <div class="project">
    <header class="project-header d-flex position-relative" @click="closed = !closed">
      <span v-if="allTasksDone"
            class="d-block position-absolute text-success"
            style="top: -0.70em; left: 0.15em; font-size: 1.25em;">
        <i class="bi bi-check-all"></i>
      </span>

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
      <button class="btn btn-lg hover-shadow" @click="handleCancelEdit">Cancel</button>
    </div>

    <TasksIndex v-if="!closed"
      :data="tasks"
      :projectId="props.data.id"
      @refreshTasks="requestTasks"
      @update-completed-count="updateCompletedTaskCount" />
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
  }

  .bi-pencil-fill:hover,
  .bi-trash:hover {
    color: firebrick;
  }
</style>
