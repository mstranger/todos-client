// TODO: dry

export const projectEndpoints = (projectId = null) => {
  return {
    index: "http://localhost:3000/api/v1/projects",
    project: `http://localhost:3000/api/v1/projects/${projectId}`
  }
}

export const taskEndpoints = (projectId, taskId = null) => {
  return {
    index: `http://localhost:3000/api/v1/projects/${projectId}/tasks`,
    task: `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}`,
    toggle: `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}/toggle`
  }
}

export const commentEndpoints = (projectId, taskId, commentId = null) => {
  return {
    index: `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}/comments`,
    comment: `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  }
}
