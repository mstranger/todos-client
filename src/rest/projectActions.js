import { ref } from "vue"
import { projectEndpoints as url } from "@/rest/endpoints"

const projects = ref([])

export const requestProjects = (utoken) => {
  projects.value = []

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
      console.log(e.message)
    }
  }

  onRequest()

  return projects
}

export const createProject = async ({ data, utoken, errors, notice }) => {
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
      requestProjects(utoken)
    } catch (e) {
      console.log(e.message)
      errors.value = e.message.split("|")
    }
  }

  return await onRequest()
}

export const deleteProject = ({ utoken, projectId, notice }) => {
  const onRequest = async () => {
    try {
      const response = await fetch(url(projectId).project, {
        method: "DELETE",
        headers: { Authorization: `HS256 ${utoken}` }
      })

      if (!response.ok) throw new Error(response.statusText)

      projects.value = projects.value.filter((project) => project.data.id !== projectId)
      notice.value = "Project deteled"
    } catch (e) {
      console.log(`Failed to delete project: ${e.message}`)
    }
  }

  onRequest()
}

export const editProject = async ({ newProjectName, projectId, utoken, errors }) => {
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
      console.log(e.message)
      errors.value = e.message.split("|")
      return false
    }

    return true
  }

  return await onRequest()
}
