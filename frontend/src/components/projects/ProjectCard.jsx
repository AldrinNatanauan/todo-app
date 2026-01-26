import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, FolderOpen, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const tasks = project.tasks || [];
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300">
        <div 
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: project.color || '#4F46E5' }}
        />
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${project.color || '#4F46E5'}15` }}
            >
              <FolderOpen 
                className="w-6 h-6" 
                style={{ color: project.color || '#4F46E5' }}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(project)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(project.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link to={createPageUrl(`ProjectDetail?id=${project.id}`)}>
            <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
          </Link>
          
          {project.description && (
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                {completedTasks === totalTasks && totalTasks > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span>{completedTasks} / {totalTasks} tasks</span>
              </div>
              <span className="font-medium" style={{ color: project.color || '#4F46E5' }}>
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: project.color || '#4F46E5' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}