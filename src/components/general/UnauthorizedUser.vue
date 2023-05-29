<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center mt-5">
      <h1>Todos Application</h1>
      <p class="text-secondary">
        Your need to
        <RouterLink :to="{ name: 'signin' }">login</RouterLink>
        or
        <RouterLink :to="{ name: 'signup' }">register</RouterLink>
        first
      </p>
    </div>
  </div>
</template>
