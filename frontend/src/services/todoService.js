import api from '../utils/api.js';

// Toggle complete status
export const toggleCompleteTodo = (id) => {
  return api.put(`/todos/complete/${id}`);
};

// Update todo title
export const updateTodoTitle = (id, title) => {
  return api.put(`/todos/update/${id}`, { title });
};

// Delete todo
export const deleteTodoById = (id) => {
  return api.delete(`/todos/${id}`);
};
