<script setup>
  import { ref, onMounted } from "vue"
  import TaskItem from "@/components/projects/TaskItem.vue"

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  const props = defineProps({
    data: Object
  })

  const tasks = ref([])

  onMounted(async () => {

    const requestTasks = async (projectId) => {
      let response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}/tasks`, {
        method: "GET",
        headers: {"Authorization": `HS256 ${utoken}`}
      })

      return await response.json()
    }

    const response = await requestTasks(props.data.id)
    tasks.value = response.data.map(t => t.data.attributes)

  })

</script>

<template>
  <li>
    {{ props.data.attributes.name }}
    <ul>
      <TaskItem :data="task" v-for="(task, idx) in tasks" :key="idx" />
    </ul>
  </li>
</template>
