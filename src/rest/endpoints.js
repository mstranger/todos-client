const apiAddress = "http://localhost:3000/api/v1"

export const projectUrls = (projectId = null) => {
  return {
    index: `${apiAddress}/projects`,
    project: `${apiAddress}/projects/${projectId}`
  }
}

export const taskUrls = (projectId, taskId = null) => {
  return {
    index: `${apiAddress}/projects/${projectId}/tasks`,
    task: `${apiAddress}/projects/${projectId}/tasks/${taskId}`,
    toggle: `${apiAddress}/projects/${projectId}/tasks/${taskId}/toggle`
  }
}

export const commentUrls = (projectId, taskId, commentId = null) => {
  return {
    index: `${apiAddress}/projects/${projectId}/tasks/${taskId}/comments`,
    comment: `${apiAddress}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  }
}
