<script setup>
  defineProps({comments: Array})
</script>

<template>
  <div class="comments-list">
    <div v-for="comment in comments" :key="comment.data.id" class="p-3 pb-0">
      <p class="mb-1 form-text">
        {{ new Date(comment.data.attributes.created_at).toLocaleDateString() }}
        <span class="ms-3 comment-delete" @click="$emit('deleteComment', comment.data.id)">
          <i class="bi bi-trash"></i>
        </span>
      </p>
      <p class="mb-0">{{ comment.data.attributes.content }}</p>
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
