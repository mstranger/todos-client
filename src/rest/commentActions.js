import { commentEndpoints as url } from "@/rest/endpoints"

export const requestComments = async ({ projectId, taskId, utoken }) => {
  let comments

  try {
    const response = await fetch(url(projectId, taskId).index, {
      method: "GET",
      headers: {
        Authorization: `HS256 ${utoken}`
      }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || "Failed to get comments")

    comments = result.data
  } catch (e) {
    console.error(e.message)
  }

  return comments
}

export const createComment = async ({ data, projectId, taskId, utoken, errors }) => {
  let success = true

  try {
    const response = await fetch(url(projectId, taskId).index, {
      method: "POST",
      headers: { Authorization: `HS256 ${utoken}` },
      body: data
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.errors.join("|") || "Failed to create comment")
  } catch (e) {
    console.error(e.message)
    errors.value = e.message.split("|")
    success = false
  }

  return success
}

export const deleteComment = async ({ projectId, taskId, commentId, utoken }) => {
  let success = true

  try {
    const response = await fetch(url(projectId, taskId, commentId).comment, {
      method: "DELETE",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error || "Failed to delete comment")
  } catch (e) {
    console.error(e.message)
    success = false
  }

  return success
}
