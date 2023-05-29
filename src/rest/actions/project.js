import { projectUrls as url } from "@/rest/endpoints"

/*
 * Get all projects
 */
export const requestProjects = async ({ utoken, errors }) => {
  let projects = []

  try {
    const response = await fetch(url().index, {
      method: "GET",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Failed to get projects")

    projects = result.data
  } catch (e) {
    console.error(e.message)
    errors.value = e.message.split()
  }

  return projects
}

/*
 * Create a new project
 */
export const createProject = async ({ data, utoken, errors }) => {
  let success = true

  try {
    const response = await fetch(url().index, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` },
      body: data
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.errors.join("|") || "Failed to create a new project")
  } catch (e) {
    errors.value = e.message.split("|")
    success = false
  }

  return success
}

/*
 * Edit a project
 */
export const editProject = async ({ newProjectName, projectId, utoken, errors }) => {
  let success = true

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

  return success
}

/*
 * Delete a project
 */
export const deleteProject = async ({ utoken, projectId, errors }) => {
  let success = true

  try {
    const response = await fetch(url(projectId).project, {
      method: "DELETE",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    if (!response.ok) throw new Error(`Failed to delete project: ${response.statusText}`)
  } catch (e) {
    console.error(e.message)
    errors.value = e.message.split()
    success = false
  }

  return success
}
