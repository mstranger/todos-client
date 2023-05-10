<script setup>
  import { ref } from "vue"

  const requiredField = ref("")
  const errors = ref([])
  const success = ref(false)

  const handleSignUp = async (e) => {
    if (checkEmptyInputs()) {
      requiredField.value = "The field is required"
      return false
    }

    requiredField.value = ""
    errors.value = []

    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      body: new FormData(e.target)
    })

    const data = await response.json()

    if (data.errors) {
      errors.value = data.errors
      addInvalidClass(data.errors, "email", "password", "password_confirmation")
    } else {
      success.value = true
    }
  }

  const checkEmptyInputs = () => {
    const inputs = document.querySelectorAll(".form-control")

    let blank = false
    inputs.forEach(input => {
      if (input.value === "") {
        input.classList.add("invalid")
        blank = true
      } else {
        input.classList.remove("invalid")
        blank = false
      }
    })

    return blank
  }

  const addInvalidClass = (errs, ...inputs) => {
    const starts = {
      "email": "Email",
      "password": "Password does",
      "password_confirmation": "Password confirmation"
    }

    inputs.forEach(input => {
      if (errs.some(e => e.startsWith(starts[input]))) {
        document.querySelector(`input[name=${input}]`).classList.add("invalid")
      }
    })
  }
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 parent">
    <form class="col-4" @submit.prevent="handleSignUp">
      <h3 class="mb-3">Sign Up</h3>

      <div class="text-danger">
        <span>{{ requiredField }}</span>
        <ul class="list-unstyled">
          <li v-for="(error, idx) in errors" :key="idx" class="mb-1">{{ error }}</li>
        </ul>
      </div>

      <div class="alert alert-success" v-if="success">
        <strong>Well done!</strong>
        You've successfully registered. You can <router-link :to="{ name: 'signin' }">login</router-link> now
      </div>

      <input type="email" name="email" class="form-control form-control-lg mb-2"
             placeholder="User name">
      <input type="password" name="password" class="form-control form-control-lg mb-2"
             placeholder="Password">
      <input type="password" name="password_confirmation" class="form-control form-control-lg"
             placeholder="Confirm Password">

      <button type="submit" class="btn btn-lg btn-primary my-3">Sign Up</button>
      <div class="form-text mt-0">
        Already a member?
        <router-link to="signin">Sign in</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .parent {
    min-height: calc(100vh - 4em);
  }
</style>
