import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import { cn } from '@/lib/utils';

export default function TaskList({
  tasks,
  projectColor,
  onReorderTasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onReorderSubtasks,
  onMoveSubtask
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { type, source, destination } = result;
    
    if (type === 'task') {
      onReorderTasks(source.index, destination.index);
    } else if (type === 'subtask') {
      const sourceTaskId = source.droppableId;
      const destTaskId = destination.droppableId;
      
      if (sourceTaskId === destTaskId) {
        onReorderSubtasks(sourceTaskId, source.index, destination.index);
      } else {
        onMoveSubtask(
          sourceTaskId,
          destTaskId,
          result.draggableId,
          destination.index
        );
      }
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks" type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "space-y-3 min-h-[100px] rounded-xl transition-colors",
              snapshot.isDraggingOver && "bg-indigo-50/30"
            )}
          >
            {sortedTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <TaskItem
                      task={task}
                      projectColor={projectColor}
                      onToggle={onToggleTask}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onAddSubtask={onAddSubtask}
                      onToggleSubtask={onToggleSubtask}
                      onEditSubtask={onEditSubtask}
                      onDeleteSubtask={onDeleteSubtask}
                      onReorderSubtasks={onReorderSubtasks}
                      onMoveSubtask={onMoveSubtask}
                      dragHandleProps={provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      allTasks={tasks}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}