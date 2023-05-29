import { taskUrls as url } from "@/rest/endpoints"

/*
 * Get all tasks
 */
export const requestTasks = async ({ projectId, utoken }) => {
  let tasks = []

  try {
    const response = await fetch(url(projectId).index, {
      method: "GET",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Failed to get tasks")

    tasks = result.data.map((t) => {
      return {
        ...t.data.attributes,
        id: t.data.id,
        commentsCount: t.data.relationships.comments.data.length
      }
    })
  } catch (e) {
    console.error(e.message)
  }

  return tasks
}

/*
 * Request a task
 */
export const getTask = async ({ projectId, taskId, utoken }) => {
  let task

  try {
    const response = await fetch(url(projectId, taskId).task, {
      method: "GET",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Failed to get task")

    task = {
      ...result.data.attributes,
      id: result.data.id,
      commentsCount: result.data.relationships.comments.data.length
    }
  } catch (e) {
    console.error(e.message)
  }

  return task
}

/*
 * Create a new task
 */
export const createTask = async ({ data, utoken, projectId, errors }) => {
  let success = true

  try {
    const response = await fetch(url(projectId).index, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` },
      body: data
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.errors?.join("|") || "Failed to create a new task")
  } catch (e) {
    errors.value = e.message.split("|")
    success = false
  }

  return success
}

/*
 * Update task
 */
export const updateTask = async ({ data, projectId, taskId, utoken }) => {
  let errors

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

    if (!response.ok) throw new Error(result.errors?.join("|") || "Failed to update task")
  } catch (e) {
    console.error(e.message)
    errors = e.message.split("|")
  }

  return errors
}

/*
 * Toggle task complete
 */
export const toggleDone = async ({ projectId, taskId, utoken }) => {
  let errors

  try {
    const response = await fetch(url(projectId, taskId).toggle, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || "Faild to toggle tasks done")
  } catch (e) {
    console.error(e.message)
    errors = e.message.split()
  }

  return errors
}

/*
 * Delete a task
 */
export const deleteTask = async ({ projectId, taskId, utoken }) => {
  let errors

  try {
    const response = await fetch(url(projectId, taskId).task, {
      method: "DELETE",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || "Failed to delete task")
  } catch (e) {
    console.error(e.message)
    errors = e.message.split()
  }

  return errors
}
