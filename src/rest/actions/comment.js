import { commentUrls as url } from "@/rest/endpoints"

/*
 * Get all comments
 */
export const requestComments = async ({ projectId, taskId, utoken, errors }) => {
  let comments

  try {
    const response = await fetch(url(projectId, taskId).index, {
      method: "GET",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Failed to get comments")

    comments = result.data
  } catch (e) {
    errors.value = e.message.split()
  }

  return comments
}

/*
 * Create a new comment
 */
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
    errors.value = e.message.split("|")
    success = false
  }

  return success
}

/*
 * Delete one comment
 */
export const deleteComment = async ({ projectId, taskId, commentId, utoken, errors }) => {
  let success = true

  try {
    const response = await fetch(url(projectId, taskId, commentId).comment, {
      method: "DELETE",
      headers: { Authorization: `HS256 ${utoken}` }
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Failed to delete comment")
  } catch (e) {
    errors.value = e.message.split()
    success = false
  }

  return success
}
