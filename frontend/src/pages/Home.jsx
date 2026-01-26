// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { client } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FolderKanban, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectModal from '@/components/projects/ProjectModal';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects on mount
  const loadProjects = async () => {
    setLoading(true);
    const data = await client.entities.Project.list('-created_date');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Handlers
  const handleSave = async (data) => {
    if (editingProject) {
      await client.entities.Project.update(editingProject.id, data);
    } else {
      await client.entities.Project.create(data);
    }
    setEditingProject(null);
    setShowModal(false);
    loadProjects(); // refresh list
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await client.entities.Project.delete(id);
    loadProjects(); // refresh list
  };

  // Filtered projects by search
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Projects
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg"
          >
            Organize your work with projects and tasks
          </motion.p>
        </div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-slate-200"
            />
          </div>
          <Button
            onClick={() => {
              setEditingProject(null);
              setShowModal(true);
            }}
            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first project to get started'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProjectCard
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Modal */}
        <ProjectModal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSave={handleSave}
          project={editingProject}
        />
      </div>
    </div>
  );
}
