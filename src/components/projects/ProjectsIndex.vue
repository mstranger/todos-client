<script setup>
  import { ref, onMounted } from "vue"
  import { useAuthStore } from "@/store"
  import ProjectItem from "@/components/projects/ProjectItem.vue"
  import FlashAlert from "@/components/general/FlashAlert.vue"

  const store = useAuthStore()
  const utoken = store.token

  const newProject = ref("")
  const projects = ref([])
  const errors = ref([])
  const notice = ref("")

  onMounted(() => requestProjects())

  const requestProjects = async () => {
    let response = await fetch("http://localhost:3000/api/v1/projects", {
      method: "GET",
      headers: {"Authorization": `HS256 ${utoken}`}
    })

    response = await response.json()

    projects.value = response.data
  }

  /* actions */

  // TODO: add visual loader

  const handleCreateProject = async (e) => {
    notice.value = ""
    errors.value = []

    const data = new FormData(e.target)

    let response = await fetch("http://localhost:3000/api/v1/projects", {
      method: "POST",
      headers: { "Authorization": `HS256 ${utoken}` },
      body: data
    })

    response = await response.json()

    if (response.errors) {
      errors.value = response.errors
    } else {
      notice.value = "New project was created"
      errors.value = []
      newProject.value = ""
      requestProjects()
    }
  }

  const handleCancelNewProject = () => {
    newProject.value = ""
    handleErrors([])
    document.activeElement.blur()
  }

  const handleDeleteProject = async (projectId) => {
    notice.value = ""
    errors.value = []

    // TODO: confirmation via vue component
    const yes = confirm("You are going to delete the project. Are you sure?")
    if (!yes) return

    let response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
      method: "DELETE",
      headers: { "Authorization": `HS256 ${utoken}` }
    })

    response = await response.json()

    if (response.error) {
      console.error(response)
    } else {
      projects.value = projects.value.filter(project => project.data.id !== projectId)
      notice.value = "Project deteled"
    }
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
    <!-- TODO: remove this -->
    <!-- <button class="btn btn-primary" @click="requestProjects"><i class="bi bi-send"></i> send request</button> -->
    <!-- end -->

    <h2 class="my-4">Projects</h2>

    <FlashAlert v-for="(msg, idx) in errors"
      :key="idx"
      :message="msg"
      type="danger"
      @clear-messages="handleRemoveFlash" />
    <FlashAlert v-if="notice"
      :message="notice"
      type="warning"
      @clear-messages="handleRemoveFlash" />

    <div v-if="projects.length === 0" class="mb-3 text-secondary">
      No projects has been created yet
    </div>

    <ProjectItem v-for="project in projects"
      :key="project.data.id"
      :data="project.data"
      :utoken="utoken"
      @delete-project="handleDeleteProject"
      @handle-errors="handleErrors" />

    <form @submit.prevent="handleCreateProject">
      <input type="text"
        name="data[name]"
        class="form-control form-control-lg new-project mb-2"
        placeholder="Enter Project name ..."
        v-model="newProject">

      <div v-if="newProject">
        <button type="submit"
          class="btn btn-lg btn-primary">Create Project</button>
        <button type="reset"
          class="btn btn-lg hover-shadow"
          @click.prevent="handleCancelNewProject">Cancel</button>
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
