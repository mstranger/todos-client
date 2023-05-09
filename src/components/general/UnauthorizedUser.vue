<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center mt-5">
      <h1>Todos Application</h1>
      <p class="text-secondary">
        Your need to
        <router-link :to="{name: 'signin'}">login</router-link>
        or
        <router-link :to="{name: 'signup'}">register</router-link>
        first
      </p>
    </div>
  </div>
</template>
