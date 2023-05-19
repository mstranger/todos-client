<script setup>
  import NavBar from "@/components/general/NavBar.vue"
  import { useAuthStore } from "@/store"

  // try {
  //   console.log("login part")
  //   useAuthStore().tryLogin()
  // } catch (err) {
  //   console.log("here: ")
  //   console.log(err.message)
  // }

  useAuthStore().tryLogin()
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style scoped>
</style>
