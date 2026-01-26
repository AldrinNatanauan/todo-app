import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  GripVertical, ChevronDown, ChevronRight, Plus, 
  Pencil, Trash2, Check, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SubtaskItem from './SubtaskItem';
import { cn } from '@/lib/utils';

export default function TaskItem({ 
  task, 
  projectColor,
  onToggle, 
  onEdit, 
  onDelete,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onReorderSubtasks,
  onMoveSubtask,
  dragHandleProps,
  isDragging,
  allTasks
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [newSubtask, setNewSubtask] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit({ ...task, title: editTitle.trim(), description: editDescription.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
      setShowAddSubtask(false);
    }
  };

  const handleSubtaskDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceTaskId = result.source.droppableId;
    const destTaskId = result.destination.droppableId;
    
    if (sourceTaskId === destTaskId) {
      onReorderSubtasks(task.id, result.source.index, result.destination.index);
    } else {
      onMoveSubtask(
        sourceTaskId, 
        destTaskId, 
        result.draggableId, 
        result.destination.index
      );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "bg-white rounded-xl border transition-all",
        isDragging ? "shadow-xl border-indigo-200" : "shadow-sm hover:shadow-md",
        task.completed && "opacity-70"
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div {...dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-slate-300 hover:text-slate-400" />
          </div>

          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task)}
            className="mt-1 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Task title"
                  autoFocus
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {subtasks.length > 0 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <h4 className={cn(
                    "font-medium text-slate-900",
                    task.completed && "line-through text-slate-400"
                  )}>
                    {task.title}
                  </h4>
                </div>
                
                {task.description && (
                  <p className={cn(
                    "text-sm text-slate-500 mt-1",
                    task.completed && "line-through"
                  )}>
                    {task.description}
                  </p>
                )}

                {subtasks.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(completedSubtasks / subtasks.length) * 100}%`,
                          backgroundColor: projectColor || '#4F46E5'
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {completedSubtasks}/{subtasks.length}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setShowAddSubtask(!showAddSubtask)}
              >
                <Plus className="w-4 h-4 text-slate-400" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 text-slate-400" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showAddSubtask && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 ml-11"
            >
              <div className="flex gap-2">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask..."
                  className="h-9"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSubtask();
                    if (e.key === 'Escape') setShowAddSubtask(false);
                  }}
                  autoFocus
                />
                <Button 
                  size="sm" 
                  onClick={handleAddSubtask}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Always render droppable area for subtasks */}
      <Droppable droppableId={task.id} type="subtask">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "transition-all",
              (subtasks.length > 0 || snapshot.isDraggingOver) ? "border-t bg-slate-50/50" : "",
              snapshot.isDraggingOver && "bg-indigo-50/50"
            )}
          >
            <AnimatePresence>
              {(isExpanded && subtasks.length > 0) || snapshot.isDraggingOver ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "p-3 space-y-1 min-h-[40px]",
                    subtasks.length === 0 && snapshot.isDraggingOver && "min-h-[60px] flex items-center justify-center"
                  )}
                >
                  {subtasks.length === 0 && snapshot.isDraggingOver && (
                    <p className="text-sm text-indigo-400 font-medium">Drop subtask here</p>
                  )}
                  {subtasks
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((subtask, index) => (
                      <Draggable 
                        key={subtask.id} 
                        draggableId={subtask.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <SubtaskItem
                              subtask={subtask}
                              onToggle={onToggleSubtask}
                              onEdit={onEditSubtask}
                              onDelete={(id) => onDeleteSubtask(task.id, id)}
                              dragHandleProps={provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </motion.div>
              ) : (
                <div className="min-h-[4px]">{provided.placeholder}</div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Droppable>
    </motion.div>
  );
}