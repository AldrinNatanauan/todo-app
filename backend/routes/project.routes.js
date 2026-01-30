// routes/project.routes.js
import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  toggleProject,
  addTask,
  toggleTask,
  updateTask,
  deleteTask,
  orderChangeTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask
} from '../controllers/project.controller.js';

const router = express.Router();

// Projects
router.get('/', getProjects);
router.get('/:projectId', getProject);
router.post('/', createProject);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);
router.put('/:projectId/toggle', toggleProject);

// Tasks
router.post('/:projectId/tasks', addTask);
router.put('/:projectId/tasks/:taskId/toggle', toggleTask);
router.put('/:projectId/tasks/:taskId', updateTask);
router.delete('/:projectId/tasks/:taskId', deleteTask);
router.put('/:projectId/tasks/:taskId/order', orderChangeTask);

// Subtasks
router.post('/:projectId/tasks/:taskId/subtasks', addSubtask);
router.put('/:projectId/tasks/:taskId/subtasks/:subtaskId/toggle', toggleSubtask);
router.delete('/:projectId/tasks/:taskId/subtasks/:subtaskId', deleteSubtask);

export default router;