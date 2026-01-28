// models/project.model.js
import { v4 as uuidv4 } from 'uuid';

const projects = [];

const Project = {
    getAll() {
        return projects;
    },

    getById(id) {
        return projects.find(p => p.id === id) || null;
    },

    create(project) {
        if (!project.name) return null;

        const newProject = {
        id: uuidv4(),
        name: project.name,
        description: project.description || "",
        color: project.color || "",
        tasks: [],
        };

        projects.push(newProject);
        return newProject;
    },

    update(projectId, updates) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;


        Object.assign(project, updates);
        return project;
        },


        remove(projectId) {
        const index = projects.findIndex(p => p.id === projectId);
        if (index === -1) return false;


        projects.splice(index, 1);
        return true;
    },

    toggle(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        project.tasks.forEach(task => {
            task.completed = !task.completed;
            task.subtasks.forEach(subtask => {
                subtask.completed = task.completed;
            });
        });
        return project;
    },

    addTask(projectId, task) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const newTask = {
        id: uuidv4(),
        title: task.title,
        description: task.description || "",
        completed: false,
        order: project.tasks.length,
        subtasks: [],
        };

        project.tasks.push(newTask);
        return newTask;
    },

    toggleTask(projectId, taskId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        task.completed = !task.completed;
        return task;
    },

    updateTask(projectId, taskId, updates) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        Object.assign(task, updates);
        return task;
    },

    removeTask(projectId, taskId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        const index = project.tasks.findIndex(t => t.id === taskId);
        if (index === -1) return false;

        project.tasks.splice(index, 1);
        return true;
    },

    addSubtask(projectId, taskId, subtask) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        const newSubtask = {
        id: uuidv4(),
        title: subtask.title,
        completed: false,
        order: task.subtasks.length,
        };

        task.subtasks.push(newSubtask);
        return newSubtask;
    },

    toggleSubtask(projectId, taskId, subtaskId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (!subtask) return null;

        subtask.completed = !subtask.completed;
        return subtask;
    },

    removeSubtask(projectId, taskId, subtaskId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return false;

        const index = task.subtasks.findIndex(st => st.id === subtaskId);
        if (index === -1) return false;

        task.subtasks.splice(index, 1);
        return true;
    },
};

export default Project;