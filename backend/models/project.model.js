// models/project.model.js
import { v4 as uuidv4 } from 'uuid';
import { loadProjects, saveProjects } from '../utils/fileDb.js';

const projects = loadProjects();

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
        saveProjects(projects);
        return newProject;
    },

    update(projectId, updates) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;


        Object.assign(project, updates);
        saveProjects(projects);
        return project;
    },


    remove(projectId) {
        const index = projects.findIndex(p => p.id === projectId);
        if (index === -1) return false;

        projects.splice(index, 1);
        saveProjects(projects);
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
        saveProjects(projects);
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
        saveProjects(projects);
        return newTask;
    },

    toggleTask(projectId, taskId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        task.completed = !task.completed;
        saveProjects(projects);
        return task;
    },

    updateTask(projectId, taskId, updates) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        Object.assign(task, updates);
        saveProjects(projects);
        return task;
    },

    removeTask(projectId, taskId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        const index = project.tasks.findIndex(t => t.id === taskId);
        if (index === -1) return false;

        project.tasks.splice(index, 1);
        saveProjects(projects);
        return true;
    },

    orderChangeTask(projectId, taskId, newOrder) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const tasks = project.tasks;
        const movedTask = tasks.find(t => t.id === taskId);
        if (!movedTask) return null;

        const oldOrder = movedTask.order;
        if (oldOrder === newOrder) return movedTask;

        tasks.forEach(task => {
            if (task.id === taskId) return;
            // Moving down
            if (oldOrder < newOrder) {
                if (task.order > oldOrder && task.order <= newOrder) {
                    task.order -= 1;
                }
            }
            // Moving up
            if (oldOrder > newOrder) {
                if (task.order >= newOrder && task.order < oldOrder) {
                    task.order += 1;
                }
            }
        });
        movedTask.order = newOrder;
        project.tasks = tasks
            .sort((a, b) => a.order - b.order)
            .map((task, index) => ({ ...task, order: index }));

        saveProjects(projects);
        return movedTask;
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
        saveProjects(projects);
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
        saveProjects(projects);
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
        saveProjects(projects);
        return true;
    },

    orderChangeSubtask(projectId, taskId, subtaskId, newOrder) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const task = project.tasks.find(t => t.id === taskId);
        if (!task) return null;

        const subtasks = task.subtasks;
        const movedSubtask = subtasks.find(st => st.id === subtaskId);
        if (!movedSubtask) return null;

        const oldOrder = movedSubtask.order;
        if (oldOrder === newOrder) return movedSubtask;

        subtasks.forEach(st => {
            if (st.id === subtaskId) return;
            // moving down
            if (oldOrder < newOrder) {
                if (st.order > oldOrder && st.order <= newOrder) {
                    st.order -= 1;
                }
            }
            // moving up
            if (oldOrder > newOrder) {
                if (st.order >= newOrder && st.order < oldOrder) {
                    st.order += 1;
                }
            }
        });
        movedSubtask.order = newOrder;
        task.subtasks = subtasks
            .sort((a, b) => a.order - b.order)
            .map((st, index) => ({ ...st, order: index }));

        saveProjects(projects);
        return movedSubtask;
    },

    moveSubtask(projectId, fromTaskId, toTaskId, subtaskId, newOrder = null) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return null;

        const fromTask = project.tasks.find(t => t.id === fromTaskId);
        const toTask = project.tasks.find(t => t.id === toTaskId);
        if (!fromTask || !toTask) return null;

        const subtaskIndex = fromTask.subtasks.findIndex(st => st.id === subtaskId);
        if (subtaskIndex === -1) return null;

        // remove subtask from source task
        const [movedSubtask] = fromTask.subtasks.splice(subtaskIndex, 1);

        // reindex source subtasks
        fromTask.subtasks = fromTask.subtasks
            .sort((a, b) => a.order - b.order)
            .map((st, index) => ({ ...st, order: index }));

        // determine target order
        const insertOrder =
            newOrder === null || newOrder > toTask.subtasks.length
                ? toTask.subtasks.length
                : newOrder;

        // shift target subtasks
        toTask.subtasks.forEach(st => {
            if (st.order >= insertOrder) {
                st.order += 1;
            }
        });
        movedSubtask.order = insertOrder;
        toTask.subtasks.push(movedSubtask);

        // normalize target subtasks
        toTask.subtasks = toTask.subtasks
            .sort((a, b) => a.order - b.order)
            .map((st, index) => ({ ...st, order: index }));

        // Recompute completion state (source task)
        fromTask.completed =
            fromTask.subtasks.length > 0 &&
            fromTask.subtasks.every(st => st.completed);

        // Recompute completion state (destination task)
        toTask.completed =
            toTask.subtasks.length > 0 &&
            toTask.subtasks.every(st => st.completed);

        saveProjects(projects);
        return movedSubtask;
    },


};

export default Project;