<script setup>
  const props = defineProps({
    data: Object
  })

</script>

<template>
  <li class="project--task-item">
    <input type="checkbox" class="task-check">
    {{ props.data.title }}
  </li>
</template>

<style scoped>
  .project--task-item {
    border: 1px solid lightgray;
    border-bottom: none;
    padding: 0.75em 1.15em;
  }

  .task-check {
    margin: 0 0.5em 0 1em;
  }

  .task-check:hover {
    cursor: pointer;
  }

  .project--task-item:last-child {
    /* border-bottom: 1px solid lightgray; */
  }
</style>
