<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/store"
import ProjectItem from "@/components/projects/ProjectItem.vue"
import FlashAlert from "@/components/general/FlashAlert.vue"

import { requestProjects, createProject, editProject, deleteProject } from "@/rest/actions/project"

const store = useAuthStore()
const utoken = store.token

const newProjectName = ref("")
const errors = ref([])
const notice = ref("")

const projects = requestProjects({utoken, errors})

/* actions */

// TODO: add visual loader

const handleCreateProject = async (e) => {
  const data = new FormData(e.target)
  const ok = await createProject({ utoken, data, notice, errors })

  if (!ok) return

  requestProjects({utoken, errors})
  newProjectName.value = ""
}

const handleCancelNewProject = () => {
  handleErrors([])
  newProjectName.value = ""
  document.activeElement.blur()
}

const handleEditProject = async (data) => {
  handleErrors([])

  const oldProjectName = data.oldProjectName.value
  const ok = await editProject({ ...data, utoken, errors })
  if (!ok) data.target.value.innerText = oldProjectName
}

const handleDeleteProject = async (projectId) => {
  handleErrors([])

  // TODO: confirmation via vue component
  const yes = confirm("You are going to delete the project. Are you sure?")
  if (!yes) return

  deleteProject({ projectId, utoken, notice, errors })
}

const handleRemoveFlash = (type) => {
  switch (type) {
    case "warning":
      notice.value = ""
      break
    case "danger":
      errors.value = []
      break
    default:
      console.log(`Undefined type: ${type}`)
  }
}

const handleErrors = (messages) => {
  notice.value = ""
  errors.value = messages
}
</script>

<template>
  <div class="container">
    <h2 class="my-4">Projects</h2>

    <flash-alert
      v-for="(msg, idx) in errors"
      :key="idx"
      :message="msg"
      type="danger"
      @clear-messages="handleRemoveFlash"
    />
    <flash-alert
      v-if="notice"
      :message="notice"
      type="warning"
      @clear-messages="handleRemoveFlash"
    />

    <div v-if="projects.length === 0" class="mb-3 text-secondary">
      No projects has been created yet
    </div>

    <project-item
      v-for="project in projects"
      :key="project.data.id"
      :data="project.data"
      :utoken="utoken"
      @edit-project="handleEditProject"
      @delete-project="handleDeleteProject"
      @handle-errors="handleErrors"
    />

    <form @submit.prevent="handleCreateProject">
      <input
        type="text"
        name="data[name]"
        class="form-control form-control-lg new-project mb-2"
        placeholder="Enter Project name ..."
        v-model="newProjectName"
      />

      <div v-if="newProjectName">
        <button type="submit" class="btn btn-lg btn-primary">Create Project</button>
        <button
          type="reset"
          class="btn btn-lg hover-shadow"
          @click.prevent="handleCancelNewProject"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scope>
.new-project {
  border-radius: 0 !important;
}

.new-project:focus {
  box-shadow: none;
}
</style>
