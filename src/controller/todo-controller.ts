import { v4 as uuidv4 } from 'uuid';
import { ForbiddenError, NotFoundError } from '../utils/error';
import * as TodoService from '../service/todo-service';

export const getTodosController = async () => {
  const existingTodos = await TodoService.getTodos();
  return {
    todos: existingTodos.Items,
    count: existingTodos.Count
  }
};

export const getTodoController = async (id: string) => {
  const todo = await TodoService.getTodo(id);
  if (!todo.Item) {
    throw new NotFoundError(`Todo with id ${id} not found`)
  }
  return todo.Item
}

export const createTodoController = async (data: any) => {
  //Let's create the new todo object
  const newTodo = {
    id: uuidv4(),
    ...data,
    completed: false,
    metadata: {
      createdAt: new Date().toISOString()
    }
  };
  return await TodoService.createTodo(newTodo)
}

export const updateTodoController = async (id: string, data: any) => {
  //Let's check first if the todo exists
  const todo = await TodoService.getTodo(id);
  if (!todo.Item) {
    // If the item does not exist, throw notfound error
    throw new NotFoundError(`Todo with id ${id} not found`)
  }
  return await TodoService.updateTodo(id, data);
}

export const deleteTodoController = async (id: string, force: boolean = false) => {
  //Let's check first if the todo exists
  const existingItem = await TodoService.getTodo(id);

  // If the item does not exist, throw notfound error
  if (!existingItem.Item) {
    throw new NotFoundError(`Todo with id ${id} not found`);
  }
  // If the item is not completed, throw forbidden error
  if (!existingItem.Item.completed && !force) {
    throw new ForbiddenError(`Todo with id ${id} is not completed`);
  }
  await TodoService.deleteTodo(id);
  
}