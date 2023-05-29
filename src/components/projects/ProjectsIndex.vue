<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/store"
import ProjectItem from "@/components/projects/ProjectItem.vue"
import FlashAlert from "@/components/general/FlashAlert.vue"
import ConfirmModal from "@/components/general/ConfirmModal.vue"
import RequestLoader from "@/components/general/RequestLoader.vue"

import { requestProjects, createProject, editProject, deleteProject } from "@/rest/actions/project"

const store = useAuthStore()
const utoken = store.token

const projects = ref([])
const errors = ref([])
const notice = ref("")
const showModal = ref(false)
const newProjectName = ref("")
const projectIdToDelete = ref(null)
const inProgress = ref(true)

onMounted(async () => {
  projects.value = await requestProjects({ utoken, errors })
  inProgress.value = false
})

/* actions */

const handleCreateProject = async (e) => {
  let data = new FormData(e.target)
  let ok = await createProject({ utoken, data, errors })

  if (!ok) return

  notice.value = "New project was created"
  projects.value = await requestProjects({ utoken, errors })
  newProjectName.value = ""
}

const handleCancelNewProject = () => {
  handleErrors([])
  newProjectName.value = ""
  document.activeElement.blur()
}

const handleEditProject = async (data) => {
  handleErrors([])

  let ok = await editProject({ ...data, utoken, errors })
  if (!ok) {
    data.target.value.focus()
    return
  }

  data.editMode.value = false
  data.target.value.setAttribute("contenteditable", false)
  data.oldProjectName.value = ""
}

const handleDeleteProject = (projectId) => {
  handleErrors([])
  projectIdToDelete.value = projectId
  showModal.value = true
}

const confirmDeletion = async (result) => {
  let projectId = projectIdToDelete.value
  if (result) {
    let ok = await deleteProject({ projectId, utoken, errors })

    if (ok) {
      notice.value = "Project deteled"
      projects.value = projects.value.filter((project) => project.data.id !== projectId)
    }
  }

  projectIdToDelete.value = null
  showModal.value = false
}

const handleErrors = (messages) => {
  notice.value = ""
  errors.value = messages
}

const handleCloseModal = () => {
  showModal.value = false
  projectIdToDelete.value = null
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
</script>

<template>
  <div class="container">
    <h2 class="my-4">Projects</h2>

    <RequestLoader :active="inProgress" />

    <FlashAlert
      v-for="(msg, idx) in errors"
      :key="idx"
      :message="msg"
      type="danger"
      @clear-messages="handleRemoveFlash"
    />
    <FlashAlert
      v-if="notice"
      :message="notice"
      type="warning"
      @clear-messages="handleRemoveFlash"
    />

    <div v-if="projects.length === 0" class="mb-3 text-secondary">
      No projects has been created yet
    </div>

    <ProjectItem
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

    <ConfirmModal
      v-show="showModal"
      title="Delete project"
      body="Do you realy want to delete this project?"
      @close-modal="handleCloseModal"
      @confirm-action="confirmDeletion"
    />
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
