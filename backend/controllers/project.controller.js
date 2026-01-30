import Project from '../models/project.model.js';

// Get all projects
export const getProjects = (req, res) => {
    res.json(Project.getAll());
};

// Get a specific project
export const getProject = (req, res) => {
    const project = Project.getById(req.params.projectId); // <-- fixed
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
};

// Create a new project
export const createProject = (req, res) => {
    const { name, description, color } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Project name is required' });
    }

    const project = Project.create({ name, description, color });
    res.status(201).json(project);
};

// Update a project
export const updateProject = (req, res) => {
    const project = Project.update(req.params.projectId, req.body);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
};

// Delete a project
export const deleteProject = (req, res) => {
    const deleted = Project.remove(req.params.projectId);
    if (!deleted) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.status(204).send();
};

// Toggle project completion
export const toggleProject = (req, res) => {
    const project = Project.toggle(req.params.projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
};

// Add task to a project
export const addTask = (req, res) => {
    const { projectId } = req.params;
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Task title is required' });
    }

    const task = Project.addTask(projectId, { title, description });
    if (!task) {
        return res.status(404).json({ message: 'Project not found' });
    }
    res.status(201).json(task);
};

// Toggle task completion
export const toggleTask = (req, res) => {
    const { projectId, taskId } = req.params;
    const task = Project.toggleTask(projectId, taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
};

// Update task
export const updateTask = (req, res) => {
    const { projectId, taskId } = req.params;
    const task = Project.updateTask(projectId, taskId, req.body);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
};

// Delete task
export const deleteTask = (req, res) => {
    const { projectId, taskId } = req.params;
    const deleted = Project.removeTask(projectId, taskId);
    if (!deleted) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
};

// Order change task
export const orderChangeTask = (req, res) => {
    const { projectId, taskId } = req.params;
    const { newOrder } = req.body;
    const task = Project.orderChangeTask(projectId, taskId, Number(newOrder));
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
};

// Add subtask
export const addSubtask = (req, res) => {
    const { projectId, taskId } = req.params;
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Subtask title is required' });
    }

    const subtask = Project.addSubtask(projectId, taskId, { title });
    if (!subtask) {
        return res.status(404).json({ message: 'Task or project not found' });
    }
    res.status(201).json(subtask);
};

// Toggle subtask
export const toggleSubtask = (req, res) => {
    const { projectId, taskId, subtaskId } = req.params;
    const subtask = Project.toggleSubtask(projectId, taskId, subtaskId);
    if (!subtask) {
        return res.status(404).json({ message: 'Subtask not found' });
    }
    res.json(subtask);
};

// Delete subtask
export const deleteSubtask = (req, res) => {
    const { projectId, taskId, subtaskId } = req.params;
    const deleted = Project.removeSubtask(projectId, taskId, subtaskId);
    if (!deleted) {
        return res.status(404).json({ message: 'Subtask not found' });
    }
    res.status(204).send();
};