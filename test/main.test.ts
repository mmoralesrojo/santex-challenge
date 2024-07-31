import { createTodoController, getTodoController, updateTodoController, deleteTodoController, getTodosController } from '../src/controller/todo-controller';
import * as TodoService from '../src/service/todo-service';
import { ForbiddenError, NotFoundError } from '../src/utils/error';
import todoFake from './data/todo.fake.json';

describe('Santex Challenge', () => {
  beforeAll(async () => {
    await TodoService.getTodos();
  })
  it('Todo test #1: Create todo and verify it exists in DynamoDB', async () => {
    const mockup = todoFake.test1.initial;
    const { id } = mockup;
    const result = await TodoService.createTodo(mockup);
    const getFromDynamo = await TodoService.getTodo(id);
    expect(getFromDynamo.Item).toEqual(result);
    await TodoService.deleteTodo(id);
  });
  it('Todo test #2: Create todo and update the title', async () => {
    const mockup = todoFake.test2.initial;
    const { id } = mockup;
    const result = await TodoService.createTodo(mockup);
    const getFromDynamo = await TodoService.getTodo(id);
    expect(getFromDynamo.Item).toEqual(result);
    const updatedTitle = 'New title for test todo';
    const updatedTodo = await updateTodoController(id, { title: updatedTitle });
    expect(updatedTodo.Attributes?.title).toEqual(todoFake.test2.updated.title);
    await TodoService.deleteTodo(id);
  });
  it('Todo test #3: Create todo and try to update the title with invalid id', async () => {
    const mockup = todoFake.test3.initial;
    const { id } = mockup;
    const result = await TodoService.createTodo(mockup);
    const getFromDynamo = await TodoService.getTodo(id);
    expect(getFromDynamo.Item).toEqual(result);
    const updatedTitle = 'New title for test todo';
    await expect(updateTodoController('123456', { title: updatedTitle })).rejects.toThrow(NotFoundError);
    await TodoService.deleteTodo(id);
  });
  it('Todo test #4: Create todo and complete it', async () => {
    const mockup = todoFake.test4.initial;
    const { id } = mockup;
    const result = await createTodoController(mockup);
    const getFromDynamo = await getTodoController(result?.id);
    expect(getFromDynamo).toEqual(result);
    const updatedTodo = await updateTodoController(id, { completed: true });
    expect(updatedTodo.Attributes?.completed).toEqual(todoFake.test4.completed.completed);
    await TodoService.deleteTodo(id);
  });
  it('Todo test #5: Create todo and delete it without completing it', async () => {
    const mockup = todoFake.test5.initial;
    const { id } = mockup;
    const result = await TodoService.createTodo(mockup);
    const getFromDynamo = await TodoService.getTodo(id);
    expect(getFromDynamo.Item).toEqual(result);
    await expect(deleteTodoController(id)).rejects.toThrow(ForbiddenError);
    await TodoService.deleteTodo(id);
  });
  it('Todo test #6: Create todo and delete it after completing it', async () => {
    const mockup = todoFake.test6.initial;
    const { id } = mockup;
    const result = await TodoService.createTodo(mockup);
    const getFromDynamo = await TodoService.getTodo(id);
    expect(getFromDynamo.Item).toEqual(result);
    await updateTodoController(id, { completed: true });
    await deleteTodoController(id);
    await expect(getTodoController(id)).rejects.toThrow(NotFoundError);
  });
  it('Todo test #7: Create multiples todo and verify they exist in DynamoDB', async () => {
    const mockup1 = todoFake.test1.initial;
    const mockup2 = todoFake.test2.initial;
    const mockup3 = todoFake.test3.initial;
    await TodoService.createTodo(mockup1);
    await TodoService.createTodo(mockup2);
    await TodoService.createTodo(mockup3);
    const getFromDynamo = await TodoService.getTodos();
    const getFromDynamoController = await getTodosController();
    expect(getFromDynamo.Items?.filter((todo) => todo.id == mockup1.id).length).toBeGreaterThan(0);
    expect(getFromDynamo.Items?.filter((todo) => todo.id == mockup2.id).length).toBeGreaterThan(0);
    expect(getFromDynamo.Items?.filter((todo) => todo.id == mockup3.id).length).toBeGreaterThan(0);
    expect(getFromDynamoController.todos?.filter((todo) => todo.id == mockup1.id).length).toBeGreaterThan(0);
    expect(getFromDynamoController.todos?.filter((todo) => todo.id == mockup2.id).length).toBeGreaterThan(0);
    expect(getFromDynamoController.todos?.filter((todo) => todo.id == mockup3.id).length).toBeGreaterThan(0);
    await TodoService.deleteTodo(mockup1.id);
    await TodoService.deleteTodo(mockup2.id);
    await TodoService.deleteTodo(mockup3.id);
  });
});
