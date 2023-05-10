<script setup>
  import { ref } from "vue"
  import { useAuthStore } from "@/store"
  import ProjectItem from "@/components/projects/ProjectItem.vue"

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  const store = useAuthStore()

  const projects = ref([])

  const requestProjects = async () => {
    let response = await fetch("http://localhost:3000/api/v1/projects", {
      method: "GET",
      headers: {"Authorization": `HS256 ${utoken}`}
    })

    response = await response.json()

    projects.value = response.data
  }
</script>

<template>
  <div class="container">
    <button class="btn btn-primary" @click="requestProjects">send request</button>

    <h2 class="my-4">Projects</h2>

    <!-- <ul>
      <li v-for="project in projects" :key="project.id">
        <ProjectItem :data="project.data" />
      </li>
    </ul> -->

    <ProjectItem v-for="project in projects" :key="project.id" :data="project.data" />

    <input type="text" class="form-control form-control-lg new-project" placeholder="Enter Project name ...">
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
