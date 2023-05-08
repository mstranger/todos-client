<script setup>
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 vh-100">
    <form class="col-4">
      <h3 class="mb-3">Sign Up</h3>
      <input type="text" class="form-control form-control-lg mb-2" placeholder="User name">
      <input type="text" class="form-control form-control-lg mb-2" placeholder="Password">
      <input type="text" class="form-control form-control-lg" placeholder="Confirm Password">
      <button type="submit" class="btn btn-lg btn-primary my-3">Sign Up</button>
      <div class="form-text mt-0">
        Already a member?
        <router-link to="signin">Sign in</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
</style>
