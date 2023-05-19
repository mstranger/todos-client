<script setup>
import { ref, onMounted } from "vue"
import CommentsList from "@/components/comments/CommentsList.vue"

const props = defineProps({
  projectId: {type: Number, required: true},
  taskId: {type: Number, required: true},
  utoken: {type: String, required: true}
})

const emit = defineEmits(["changeCommentsCount", "closeComments"])

const comments = ref(null)
const attachment = ref(null)
const errors = ref([])

// TODO: as modal window

onMounted(() => getComments())

const getComments = async () => {
  let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.taskId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `HS256 ${props.utoken}`
    }
  })

  response = await response.json()

  if (response.error) {
    console.log(response.error)
    return
  }

  comments.value = response.data
}

const handleSubmitComment = async (e) => {
  errors.value = []

  let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.taskId}/comments`, {
    method: "POST",
    headers: { Authorization: `HS256 ${props.utoken}` },
    body: new FormData(e.target)
  })

  if (response.status === 500) {
    console.error("Iternal server error")
    return
  }

  response = await response.json()

  if (response.errors) {
    errors.value = response.errors
    return
  }

  e.target.reset()
  attachment.value = null
  emit('changeCommentsCount', 1)
  getComments()
}

const handleDeleteComment = async (id) => {
  let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.taskId}/comments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `HS256 ${props.utoken}` }
  })

  response = await response.json()

  if (response.error) {
    console.error(response.error)
    return
  }

  emit('changeCommentsCount', -1)
  getComments()
}
</script>

<template>
  <div class="card pb-4">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="h5 my-2">Add Comment</h5>
      <button type="button" class="btn-close" @click="$emit('closeComments')"></button>
    </div>

    <div class="card-body">
      <form @submit.prevent="handleSubmitComment">
        <div v-if="errors.length > 0" class="mb-2">
          <ul class="list-unstyled text-danger text-small">
            <li v-for="(error, idx) in errors" :key="idx">{{ error }}</li>
          </ul>
        </div>

        <div class="mb-3 position-relative">
          <textarea name="content" id="comment"
            class="form-control"
            cols="30" rows="4"></textarea>
          <label for="image" class="position-absolute fs-5 paperclip">
            <i class="bi bi-paperclip"></i>
          </label>
        </div>
        <div class="mb-3">
          <p v-if="attachment" class="text-secondary">Selected file:
            <span class="text-body">{{ attachment }}</span>
          </p>
          <input type="file" id="image" name="image" class="d-none"
            @change="attachment=$event.target.files[0].name">
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-lg btn-primary px-5">Save</button>
          <button class="btn btn-lg hover-shadow px-5" @click="$emit('closeComments')">Cancel</button>
        </div>
      </form>
    </div>

    <CommentsList v-if="comments?.length > 0" :comments="comments"
      @delete-comment="handleDeleteComment"/>
  </div>
</template>

<style scoped>
  .card {
    position: absolute;
    top: -10%;
    left: 20%;
    width: 50vw;
    z-index: 99;
  }

  textarea {
    resize: none;
  }

  textarea:focus {
    box-shadow: none;
  }

  .paperclip {
    color: dimgray;
    bottom: 0.25rem;
    right: 0.5rem;
    transform: rotate(-45deg);
  }

  .paperclip:hover {
    cursor: pointer;
    color: firebrick;
  }
</style>
