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
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    if (type === 'task') {
      if (source.index === destination.index) return;
      onReorderTasks(source.index, destination.index);
      return;
    }

    if (type === 'subtask') {
      const sourceTaskId = source.droppableId.replace('task-', '');
      const destTaskId = destination.droppableId.replace('task-', '');
      const subtaskId = draggableId.replace('subtask-', '');

      if (
        sourceTaskId === destTaskId &&
        source.index === destination.index
      ) return;

      if (sourceTaskId === destTaskId) {
        onReorderSubtasks(
          sourceTaskId,
          source.index,
          destination.index
        );
      } else {
        onMoveSubtask(
          sourceTaskId,
          destTaskId,
          subtaskId,
          destination.index
        );
      }
    }
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

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
              <Draggable
                key={task.id}
                draggableId={`task-${task.id}`}
                index={index}
              >
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
                      dragHandleProps={provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
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
