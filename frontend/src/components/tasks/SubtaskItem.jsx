import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SubtaskItem({ 
  subtask, 
  onToggle, 
  onEdit, 
  onDelete,
  dragHandleProps,
  isDragging,
  projectColor
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit({ ...subtask, title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(subtask.title);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        "group flex items-center gap-2 py-2 px-3 rounded-lg transition-all",
        isDragging ? "bg-indigo-50 shadow-lg" : "hover:bg-slate-50",
        subtask.completed && "opacity-60"
      )}
    >
      <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
      </div>

      <Checkbox
        checked={subtask.completed}
        onCheckedChange={() => onToggle(subtask)}
        className="border rounded-sm w-4 h-4 transition-colors"
        style={{
          backgroundColor: subtask.completed ? projectColor : undefined,
          borderColor: subtask.completed ? projectColor : undefined,
        }}
      />

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-8 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleSave}>
            <Check className="w-4 h-4 text-emerald-600" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancel}>
            <X className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      ) : (
        <>
          <span className={cn(
            "flex-1 text-sm text-slate-700",
            subtask.completed && "line-through text-slate-400"
          )}>
            {subtask.title}
          </span>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-3.5 h-3.5 text-slate-400" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7"
              onClick={() => onDelete(subtask.id)}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}