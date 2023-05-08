<script setup>
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 parent">
    <form class="col-4">
      <h3 class="mb-3">Sign In</h3>
      <input type="text" class="form-control form-control-lg mb-2" placeholder="User name">
      <input type="text" class="form-control form-control-lg" placeholder="Password">
      <button type="submit" class="btn btn-lg btn-primary my-3">Sign In</button>
      <div class="form-text mt-0">
        Don't have an account?
        <router-link to="signup">Sign up</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .parent {
    min-height: calc(100vh - 4em);
  }
</style>
