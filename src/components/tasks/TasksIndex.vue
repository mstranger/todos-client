<script setup>
  import { ref, watch } from "vue"
  import TaskItem from "@/components/tasks/TaskItem.vue"

  const utoken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2ODYzMjIzNzV9.VQ9mvBpz6jBw6Qy-DmSrYH2a09YE9iwqsutWG_ruoH4"

  const props = defineProps({
    data: {type: Array, required: true},
    projectId: {type: Number, required: true}
  })

  const emit = defineEmits(["refreshTasks", "updateCompletedCount"])

  const tasks = ref(props.data)
  const newTask = ref("")
  const errors = ref([])

  watch(() => props.data, () => tasks.value = props.data)

  const refreshTask = async (taskId) => {
    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks/${taskId}`, {
      method: "GET",
      headers: { "Authorization": `HS256 ${utoken}` }
    })

    response = await response.json()

    const elem = {...response.data.attributes, id: response.data.id}
    const idx = props.data.findIndex(t => t.id === elem.id)

    // replace task with a new one
    tasks.value.splice(idx, 1, elem)

    // sort tasks
    tasks.value.sort((t1, t2) => {
      if (t1.priority === t2.priority)
        return new Date(t1.created_at) - new Date(t2.created_at)

      return t2.priority - t1.priority
    })
  }

  const deleteTask = (taskId) => {
    const idx = props.data.findIndex(t => t.id === taskId)
    tasks.value.splice(idx, 1)
  }

  /* actions */

  const handleCreateTask = async (e) => {
    clearErrors()

    let response = await fetch(`http://localhost:3000/api/v1/projects/${props.projectId}/tasks`, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` },
      body: new FormData(e.target)
    })

    response = await response.json()

    if (response.errors) {
      errors.value = response.errors
      return
    }

    emit("refreshTasks", props.projectId)
    newTask.value = ""
  }

  const handleNewTaskCancel = () => {
    newTask.value = ""
    clearErrors()
  }

  const clearErrors = () => {
    errors.value = []
  }
</script>

<template>
  <div>
    <ul class="list-unstyled tasks-list mb-0">
      <TaskItem v-for="(task, idx) in tasks"
        :key="idx" :data="task" :projectId="props.projectId"
        @refresh-tasks="$emit('refreshTasks', props.projectId)"
        @handle-errors="errors=$event"
        @refresh-task="refreshTask"
        @delete-task="deleteTask"
        @update-completed-count="$emit('updateCompletedCount', $event)"/>

      <li>
        <form @submit.prevent="handleCreateTask">
          <input type="text"
            name="data[title]"
            class="form-control new-task ps-4"
            placeholder="Enter Task name ..."
            v-model="newTask" >

          <div class="py-2 new-task-buttons" v-if="newTask">
            <button type="submit"
              class="btn btn-lg btn-success ms-4 px-4">Save</button>
            <button type="reset"
              class="btn btn-lg px-4"
              @click.prevent="handleNewTaskCancel">Cancel</button>
          </div>

          <span v-for="(msg, idx) in errors" :key="idx"
            class="ps-3 text-danger form-text d-block">{{ msg }}</span>
        </form>
      </li>
    </ul>

  </div>
</template>

<style scoped>
  .new-task {
    line-height: 3em;
    padding: 0;
    padding-left: 1em;
    border-radius: 0 !important;
  }

  .new-task:focus {
    box-shadow: none;
  }

  .new-task::placeholder {
    color: #acacac;
  }

  .new-task-buttons {
    border: 1px solid lightgray;
    border-top: none;
  }
</style>
