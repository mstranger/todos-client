<script setup>
  import { ref } from "vue"
  import { useAuthStore } from "@/store"
  import ProjectItem from "@/components/projects/ProjectItem.vue"
  import FlashAlert from "@/components/general/FlashAlert.vue"

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  const store = useAuthStore()

  const newProject = ref("")
  const projects = ref([])
  const errors = ref([])
  const notice = ref("")

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

  const handleDeleteProject = async (projectId) => {
    notice.value = ""

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
</script>

<template>
  <div class="container">
    <!-- TODO: remove this -->
    <button class="btn btn-primary" @click="requestProjects"><i class="bi bi-send"></i> send request</button>
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

    <ProjectItem v-for="project in projects"
      :key="project.data.id"
      :data="project.data"
      @delete-project="handleDeleteProject" />

    <form @submit.prevent="handleCreateProject">
      <input type="text"
        name="data[name]"
        class="form-control form-control-lg new-project mb-2"
        placeholder="Enter Project name ..."
        v-model="newProject" >

      <div v-if="newProject">
        <button type="submit"
          class="btn btn-lg btn-primary">Create Project</button>
        <button type="reset"
          class="btn btn-lg"
          @click.prevent="newProject=''">Cancel</button>
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
