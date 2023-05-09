<script setup>
  import { useAuthStore } from "@/store"

  import UnauthorizedUser from "@/components/general/UnauthorizedUser.vue"
  import ProjectsView from "@/views/projects/ProjectsView.vue"

  const store = useAuthStore()
</script>

<template>
  <UnauthorizedUser v-if="!store.isAuthenticated" />
  <ProjectsView v-else />
</template>
