// services/projectService.js
import api from '../lib/api.js';

const ProjectService = {
  // Projects
  getAllProjects: async () => {
    const res = await api.get('/projects');
    return res.data;
  },

  getProject: async (projectId) => {
    const res = await api.get(`/projects/${projectId}`);
    return res.data;
  },

  createProject: async (projectData) => {
    const res = await api.post('/projects', projectData);
    return res.data;
  },

  updateProject: async (projectId, updates) => {
    const res = await api.put(`/projects/${projectId}`, updates);
    return res.data;
  },

  deleteProject: async (projectId) => {
    const res = await api.delete(`/projects/${projectId}`);
    return res.status === 204;
  },

  toggleProject: async (projectId) => {
    const res = await api.put(`/projects/${projectId}/toggle`);
    return res.data;
  },

  // Tasks
  addTask: async (projectId, taskData) => {
    const res = await api.post(`/projects/${projectId}/tasks`, taskData);
    return res.data;
  },

  updateTask: async (projectId, taskId, updates) => {
    const res = await api.put(`/projects/${projectId}/tasks/${taskId}`, updates);
    return res.data;
  },

  toggleTask: async (projectId, taskId) => {
    const res = await api.put(`/projects/${projectId}/tasks/${taskId}/toggle`);
    return res.data;
  },

  deleteTask: async (projectId, taskId) => {
    const res = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return res.status === 204;
  },

  // Subtasks
  addSubtask: async (projectId, taskId, subtaskData) => {
    const res = await api.post(`/projects/${projectId}/tasks/${taskId}/subtasks`, subtaskData);
    return res.data;
  },

  toggleSubtask: async (projectId, taskId, subtaskId) => {
    const res = await api.put(`/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    return res.data;
  },

  deleteSubtask: async (projectId, taskId, subtaskId) => {
    const res = await api.delete(`/projects/${projectId}/tasks/${taskId}/subtasks/${subtaskId}`);
    return res.status === 204;
  },
};

export default ProjectService;