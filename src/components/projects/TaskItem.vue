<script setup>
  const props = defineProps({
    data: Object
  })

</script>

<template>
  <li>{{ props.data.title }}</li>
</template>
