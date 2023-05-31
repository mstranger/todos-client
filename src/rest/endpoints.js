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
    toggle: `${apiAddress}/projects/${projectId}/tasks/${taskId}/toggle`,
    up: `${apiAddress}/projects/${projectId}/tasks/${taskId}/up`,
    down: `${apiAddress}/projects/${projectId}/tasks/${taskId}/down`
  }
}

export const commentUrls = (projectId, taskId, commentId = null) => {
  return {
    index: `${apiAddress}/projects/${projectId}/tasks/${taskId}/comments`,
    comment: `${apiAddress}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  }
}

export const authUrls = () => {
  return {
    signin: "http://localhost:3000/auth/login",
    signup: "http://localhost:3000/auth/signup"
  }
}
