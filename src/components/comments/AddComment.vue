<script setup>
import { ref, onMounted } from "vue"
import CommentsList from "@/components/comments/CommentsList.vue"
import { requestComments, createComment, deleteComment } from "@/rest/actions/comment"

const props = defineProps({
  projectId: { type: Number, required: true },
  taskId: { type: Number, required: true },
  utoken: { type: String, required: true }
})

const emit = defineEmits(["changeCommentsCount", "close-modal"])

const comments = ref(null)
const attachment = ref(null)
const errors = ref([])

onMounted(() => getComments())

const getComments = async () => {
  const data = await requestComments({ ...props, errors })
  if (!data) return
  comments.value = data
}

const handleSubmitComment = async (e) => {
  errors.value = []

  const data = new FormData(e.target)
  const ok = await createComment({ ...props, data, errors })

  if (!ok) return

  e.target.reset()
  attachment.value = null
  emit("changeCommentsCount", 1)
  getComments()
}

const handleDeleteComment = async (id) => {
  const ok = await deleteComment({ ...props, commentId: id, errors })

  if (!ok) return

  emit("changeCommentsCount", -1)
  getComments()
}

const handleCloseModal = () => {
  emit("close-modal")
  if (errors.value.length > 0) errors.value = []
}
</script>

<template>
  <transition name="fade">
    <div class="modal-overlay" @click="handleCloseModal">
      <div class="card modal-body pb-4" @click.stop>
        <div class="card-header d-flex align-items-center justify-content-between">
          <h5 class="h5 my-2">Add Comment</h5>
          <button type="button" class="btn-close" @click="handleCloseModal"></button>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleSubmitComment">
            <div v-if="errors.length > 0" class="mb-2">
              <ul class="list-unstyled text-danger text-small">
                <li v-for="(error, idx) in errors" :key="idx">{{ error }}</li>
              </ul>
            </div>
            <div class="mb-3 position-relative">
              <textarea
                name="content"
                id="comment"
                class="form-control"
                cols="30"
                rows="4"
              ></textarea>
              <label for="image" class="position-absolute fs-5 paperclip">
                <i class="bi bi-paperclip"></i>
              </label>
            </div>
            <div class="mb-3">
              <p v-if="attachment" class="text-secondary">
                Selected file:
                <span class="text-body">{{ attachment }}</span>
              </p>
              <input
                type="file"
                id="image"
                name="image"
                class="d-none"
                @change="attachment = $event.target.files[0].name"
              />
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-lg btn-primary px-5">Save</button>
              <button class="btn btn-lg hover-shadow px-5" @click.prevent="handleCloseModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
        <CommentsList
          v-if="comments?.length > 0"
          :comments="comments"
          @delete-comment="handleDeleteComment"
        />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  justify-content: center;
  background-color: #00000050;
}

.modal-body {
  width: 36em;
  max-height: 32em;
  overflow: scroll;
  margin: 0 auto;
  margin-top: 5%;
  margin-bottom: 2em;
  position: relative;
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
