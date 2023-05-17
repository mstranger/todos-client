<script setup>
defineProps({comments: Array})
</script>

<template>
  <div class="comments-list">
    <div v-for="comment in comments" :key="comment.data.id" class="p-3 pb-1">
      <div class="mb-0 text-secondary text-small">
        <span style="font-size: 0.75rem">
          {{ new Date(comment.data.attributes.created_at).toLocaleDateString() }}
        </span>
        <span class="ms-3 comment-delete" @click="$emit('deleteComment', comment.data.id)">
          <i class="bi bi-trash"></i>
        </span>
      </div>
      <div>
        <p class="mb-0">{{ comment.data.attributes.content }}</p>
        <img v-if="comment.data.attributes.image"
          class="mt-2 img-fluid"
          style="max-height: 20rem;"
          :src="comment.data.attributes.image" alt="attached image">
      </div>
    </div>
  </div>
</template>

<style scoped>
  .comments-list {
    border-top: 1px solid lightgray;
  }

  .comment-delete {
    cursor: pointer;
  }

  .comment-delete:hover {
    color: firebrick;
  }
</style>
