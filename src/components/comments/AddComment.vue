<script setup>
import { ref, onMounted } from "vue"
import CommentsList from "@/components/comments/CommentsList.vue"

const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

const props = defineProps({
  projectId: {type: Number, required: true},
  taskId: {type: Number, required: true}
})

const emit = defineEmits(["changeCommentsCount", "closeComments"])

const comments = ref(null)

// TODO: as modal window

onMounted(() => getComments())

const getComments = async () => {
  let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.taskId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `HS256 ${utoken}`
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
  let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.taskId}/comments`, {
    method: "POST",
    headers: { Authorization: `HS256 ${utoken}` },
    body: new FormData(e.target)
  })

  response = await response.json()

  if (response.error) {
    console.error(response.error)
    return
  }

  e.target.querySelector("#comment").value = ""
  emit('changeCommentsCount', 1)
  getComments()
}

const handleDeleteComment = async (id) => {
  let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${props.taskId}/comments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `HS256 ${utoken}` }
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
        <div class="mb-3">
          <textarea name="content" id="comment"
            class="form-control"
            cols="30" rows="4"></textarea>
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

  textarea:focus {
    box-shadow: none;
  }
</style>
