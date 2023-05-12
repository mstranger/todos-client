<script setup>
  import { useAuthStore } from "@/store"

  import UnauthorizedUser from "@/components/general/UnauthorizedUser.vue"
  import ProjectsIndex from "@/components/projects/ProjectsIndex.vue"

  const store = useAuthStore()
</script>

<template>
  <!-- <UnauthorizedUser v-if="!store.isAuthenticated" /> -->
  <!-- <ProjectsIndex v-else /> -->
  <ProjectsIndex />
</template>
