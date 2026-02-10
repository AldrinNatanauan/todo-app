import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import ProjectService from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Plus, CheckCircle2, Circle, Loader2,
  ListTodo, Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import TaskList from '@/components/tasks/TaskList';
import ProjectModal from '@/components/projects/ProjectModal';


function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function ProjectDetail() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Fetch project on mount
  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProjectService.getProject(projectId);
      setProject(data);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId, loadProject]);

  useEffect(() => {
    document.title = "Project: " + (project?.name || 'Loading...');
  }, [project]);

  // Update project helper
  const updateProject = async (updates) => {
    if (!project) return;
    setProject(prev => ({ ...prev, ...updates }));
    await ProjectService.updateProject(project.id, {
      ...project,
      ...updates
    });
  };

  // Task handlers
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: generateId(),
      title: newTaskTitle.trim(),
      description: '',
      completed: false,
      order: (project?.tasks?.length || 0),
      subtasks: []
    };
    updateProject({
      tasks: [...(project?.tasks || []), newTask]
    });
    setNewTaskTitle('');
  };

  const handleToggleTask = (task) => {
    const updatedTasks = (project?.tasks || []).map(t =>
      t.id === task.id ? {
        ...t,
        completed: !t.completed,
        subtasks: (t.subtasks || []).map(s => ({
          ...s,
          completed: !t.completed
        }))
      }: t
    );
    updateProject({ tasks: updatedTasks });
  };

  const handleEditTask = (updatedTask) => {
    const updatedTasks = (project?.tasks || []).map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    updateProject({ tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = project.tasks
      .filter(t => t.id !== taskId)
      .map((t, i) => ({ ...t, order: i }));

    updateProject({ tasks: updatedTasks });
  };

  const handleTaskDragEnd = (taskId, newOrder) => {
    setProject(prev => {
      if (!prev?.tasks) return prev;

      const tasks = prev.tasks.map(t => ({ ...t }));
      const moved = tasks.find(t => t.id === taskId);
      if (!moved) return prev;

      const oldOrder = moved.order;

      tasks.forEach(t => {
        if (t.id === taskId) return;

        if (oldOrder < newOrder && t.order > oldOrder && t.order <= newOrder) {
          t.order -= 1;
        }

        if (oldOrder > newOrder && t.order >= newOrder && t.order < oldOrder) {
          t.order += 1;
        }
      });

      moved.order = newOrder;

      return {
        ...prev,
        tasks: tasks.sort((a, b) => a.order - b.order)
      };
    });

    ProjectService
      .changeTaskOrder(project.id, taskId, newOrder)
      .catch(() => loadProject());
  };


  // Subtask handlers
  const handleAddSubtask = (taskId, title) => {
    if (!title.trim()) return;

    setProject(prev => {
      const updatedTasks = (prev?.tasks || []).map(task => {
        if (task.id !== taskId) return task;

        const subtasks = [...(task.subtasks || [])];
        const newSubtask = {
          id: generateId(),
          title: title.trim(),
          completed: false,
          order: subtasks.length
        };

        return { ...task, subtasks: [...subtasks, newSubtask] };
      });
      return { ...prev, tasks: updatedTasks };
    });

    const task = project.tasks.find(t => t.id === taskId);
    const newSubtask = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      order: (task?.subtasks?.length || 0)
    };

    updateProject({
      tasks: project.tasks.map(t => 
        t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] } : t
      )
    });
  };

  const handleToggleSubtask = (subtask) => {
    const updatedTasks = (project?.tasks || []).map(task => {
      if (!(task.subtasks || []).some(s => s.id === subtask.id)) return task;
      const subtasks = task.subtasks.map(s => s.id === subtask.id ? { ...s, completed: !s.completed } : s);
      const completed = subtasks.every(s => s.completed);
      return { ...task, subtasks, completed };
    });
    updateProject({ tasks: updatedTasks });
  };

  const handleEditSubtask = (subtask) => {
    const updatedTasks = (project?.tasks || []).map(task => {
      if (!(task.subtasks || []).some(s => s.id === subtask.id)) return task;
      const subtasks = task.subtasks.map(s => s.id === subtask.id ? subtask : s);
      return { ...task, subtasks };
    });
    updateProject({ tasks: updatedTasks });
  };

  const handleDeleteSubtask = (taskId, subtaskId) => {
    const updatedTasks = (project?.tasks || []).map(task => {
      if (task.id !== taskId) return task;
      const subtasks = task.subtasks.filter(s => s.id !== subtaskId);
      return { ...task, subtasks };
    });
    updateProject({ tasks: updatedTasks });
  };

  // Subtask drag within the same task
  const handleSubtaskDragEnd = async (taskId, subtaskId, newOrder) => {
    try {
      const updatedSubtask = await ProjectService.changeSubtaskOrder(
        project.id,
        taskId,
        subtaskId,
        newOrder
      );
      const updatedTasks = project.tasks.map(task => {
        if (task.id !== taskId) return task;
        const subtasks = task.subtasks
          .map(s => (s.id === subtaskId ? updatedSubtask : s))
          .sort((a, b) => a.order - b.order)
          .map((s, i) => ({ ...s, order: i }));
        return { ...task, subtasks };
      });

      updateProject({ tasks: updatedTasks });
    } catch (err) {
      console.error(err);
    }
  };


  // Move subtask across tasks
  const handleMoveSubtask = (fromTaskId, toTaskId, subtaskId, toIndex) => {
  setProject(prev => {
    // 1️⃣ Find the subtask FIRST
    const fromTask = prev.tasks.find(t => t.id === fromTaskId);
    if (!fromTask) return prev;

    const movedSubtask = fromTask.subtasks.find(s => s.id === subtaskId);
    if (!movedSubtask) return prev;

    // 2️⃣ Build new tasks
    const tasks = prev.tasks.map(task => {
      // Remove from source
      if (task.id === fromTaskId) {
        const remaining = task.subtasks
          .filter(s => s.id !== subtaskId)
          .map((s, i) => ({ ...s, order: i }));

        return { ...task, subtasks: remaining };
      }

      // Insert into destination
      if (task.id === toTaskId) {
        const subtasks = [...task.subtasks];
        subtasks.splice(toIndex, 0, movedSubtask);

        return {
          ...task,
          subtasks: subtasks.map((s, i) => ({ ...s, order: i }))
        };
      }

      return task;
    });

    return { ...prev, tasks };
  });
  ProjectService.moveSubtask(
    project.id,
    subtaskId,
    fromTaskId,
    toTaskId,
    toIndex
  ).catch(() => loadProject());
};


  const handleReorderSubtasks = (taskId, fromIndex, toIndex) => {
    setProject(prev => {
      const tasks = prev.tasks.map(task => {
        if (task.id !== taskId) return task;

        const subtasks = [...task.subtasks];
        const [moved] = subtasks.splice(fromIndex, 1);
        subtasks.splice(toIndex, 0, moved);

        return {
          ...task,
          subtasks: subtasks.map((s, i) => ({ ...s, order: i }))
        };
      });

      return { ...prev, tasks };
    });

    const subtaskId = project.tasks
      .find(t => t.id === taskId)
      .subtasks[fromIndex].id;

    ProjectService.changeSubtaskOrder(
      project.id,
      taskId,
      subtaskId,
      toIndex
    ).catch(() => loadProject());
  };






  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Project not found</h2>
          <Link to={createPageUrl('Home')}>
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to={createPageUrl('Home')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${project.color || '#4F46E5'}15` }}>
                <ListTodo className="w-7 h-7" style={{ color: project.color || '#4F46E5' }} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{project.name}</h1>
                {project.description && <p className="text-slate-500 mt-1">{project.description}</p>}
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => setShowProjectModal(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              {completedTasks === tasks.length && tasks.length > 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-sm text-slate-600">{completedTasks} of {tasks.length} tasks completed</span>
            </div>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs">
              <motion.div className="h-full rounded-full" style={{ backgroundColor: project.color || '#4F46E5' }} initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: project.color || '#4F46E5' }}>{Math.round(progress)}%</span>
          </div>
        </motion.div>

        {/* Add Task */}
        <div className="mb-6 flex gap-3">
          <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Add a new task..." className="h-12 bg-white" onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }} />
          <Button onClick={handleAddTask} className="h-12 px-6 shadow-lg" style={{ backgroundColor: project.color || '#4F46E5' }}>
            <Plus className="w-5 h-5 mr-2" /> Add Task
          </Button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          projectColor={project.color}
          onReorderTasks={(oldIndex, newIndex) => {
            const taskId = tasks[oldIndex].id;
            handleTaskDragEnd(taskId, newIndex);
          }}
          onToggleTask={handleToggleTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAddSubtask={handleAddSubtask}
          onToggleSubtask={handleToggleSubtask}
          onEditSubtask={handleEditSubtask}
          onDeleteSubtask={handleDeleteSubtask}
          onReorderSubtasks={handleReorderSubtasks}
          onMoveSubtask={handleMoveSubtask}
        />

        {/* Project Modal */}
        <ProjectModal open={showProjectModal} onClose={() => setShowProjectModal(false)} onSave={updateProject} project={project} />
      </div>
    </div>
  );
}
