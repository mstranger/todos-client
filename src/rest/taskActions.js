import { ref } from "vue"
import { taskEndpoints as url } from "@/rest/endpoints"

const tasks = ref([])

export const requestTasks = async ({ projectId, utoken }) => {
  tasks.value = []

  // const onRequest = async () => {
  try {
    const response = await fetch(url(projectId).index, {
      method: "GET",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Failed to get tasks")

    tasks.value = result.data.map((t) => {
      return {
        ...t.data.attributes,
        id: t.data.id,
        commentsCount: t.data.relationships.comments.data.length
      }
    })
  } catch (e) {
    console.log(e.message)
  }
  // }

  // onRequest()

  return tasks
}

/* const requestTasks = async (projectId) => {

  totalTaskCount.value = tasks.value.length
  completedTaskCount.value = tasks.value.filter((t) => t.completed === true).length
} */

export const createTask = async ({ data, utoken, projectId, errors }) => {
  // const onRequest = async () => {
  try {
    const response = await fetch(url(projectId).index, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` },
      body: data
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.errors.join("|") || "Failed to create a new task")

    // await requestTasks({ projectId, utoken })
  } catch (e) {
    console.log(e.message)
    errors.value = e.message.split("|")
  }
  // }

  // return await onRequest()
}

export const updateTask = async ({ data, projectId, taskId, utoken }) => {
  let errors = false

  try {
    const response = await fetch(url(projectId, taskId).task, {
      method: "PUT",
      headers: {
        Authorization: `HS256 ${utoken}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.errors.join("|") || "Failed to update task")
  } catch (e) {
    console.error(e.message)
    errors = e.message.split("|")
  }

  return errors
}

export const toggleDone = async ({ projectId, taskId, utoken }) => {
  let success = true

  try {
    const response = await fetch(url(projectId, taskId).toggle, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || "Faild to toggle tasks done")
  } catch (e) {
    console.error(e.message)
    success = false
  }

  return success
}

export const deleteTask = async ({ projectId, taskId, utoken }) => {
  let success = true

  try {
    const response = await fetch(url(projectId, taskId).task, {
      method: "DELETE",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || "Failed to delete task")
  } catch (e) {
    console.error(e.message)
    success = false
  }

  return success
}
