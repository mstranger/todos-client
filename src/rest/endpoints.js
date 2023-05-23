export const projectEndpoints = (projectId = null) => {
  return {
    index: "http://localhost:3000/api/v1/projects",
    project: `http://localhost:3000/api/v1/projects/${projectId}`
  }
}
