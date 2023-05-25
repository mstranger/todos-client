import { ref } from "vue"
import { projectUrls as url } from "@/rest/endpoints"

const projects = ref([])

/*
 * Get all projects
 */
export const requestProjects = ({ utoken, errors }) => {
  projects.value = []

  // TODO: onRequest
  const onRequest = async () => {
    try {
      const response = await fetch(url().index, {
        method: "GET",
        headers: { Authorization: `HS256 ${utoken}` }
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to get projects")

      projects.value = result.data
    } catch (e) {
      console.error(e.message)
      errors.value = e.message.split()
    }
  }

  onRequest()

  return projects
}

/*
 * Create a new project
 */
export const createProject = async ({ data, utoken, errors, notice }) => {
  // TODO: onRequest
  let success = true

  const onRequest = async () => {
    try {
      const response = await fetch(url().index, {
        method: "POST",
        headers: { Authorization: `HS256 ${utoken}` },
        body: data
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.errors.join("|") || "Failed to request")

      notice.value = "New project was created"
      errors.value = []
    } catch (e) {
      errors.value = e.message.split("|")
      success = false
    }
  }

  await onRequest()

  return success
}

/*
 * Edit a project
 */
export const editProject = async ({ newProjectName, projectId, utoken, errors }) => {
  let success = true
  // TODO: onRequest
  const onRequest = async () => {
    try {
      const response = await fetch(url(projectId).project, {
        method: "PUT",
        headers: {
          Authorization: `HS256 ${utoken}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data[name]=${newProjectName}`
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.errors.join("|") || "Failed to request")
    } catch (e) {
      errors.value = e.message.split("|")
      success = false
    }
  }

  await onRequest()
  return success
}

/*
 * Delete a project
 */
export const deleteProject = async ({ utoken, projectId, notice, errors }) => {
  let success = true
  // TODO: onRequest
  const onRequest = async () => {
    try {
      const response = await fetch(url(projectId).project, {
        method: "DELETE",
        headers: { Authorization: `HS256 ${utoken}` }
      })

      if (!response.ok) throw new Error(`Failed to delete project: ${response.statusText}`)

      projects.value = projects.value.filter((project) => project.data.id !== projectId)
      notice.value = "Project deteled"
    } catch (e) {
      console.error(e.message)
      errors.value = e.message.split()
      success = false
    }
  }

  await onRequest()
  return success
}
