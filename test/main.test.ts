import { createTodoController, getTodoController, updateTodoController, deleteTodoController } from '../src/controller/todo-controller';
import { ForbiddenError, NotFoundError } from '../src/utils/error';
import todoFake from './data/todo.fake.json';

describe('Santex Challenge', () => {
  it('Todo test #1: Create todo and verify it exists in DynamoDB', async () => {
    const result = await createTodoController(todoFake.test1.initial);
    const { id } = result;
    const getFromDynamo = await getTodoController(id);
    expect(getFromDynamo).toEqual(result);
    await deleteTodoController(id, true);
  });
  it('Todo test #2: Create todo and update the title', async () => {
    const result = await createTodoController(todoFake.test2.initial);
    const { id } = result;
    const getFromDynamo = await getTodoController(id);
    expect(getFromDynamo).toEqual(result);
    const updatedTitle = 'New title for test todo';
    const updatedTodo = await updateTodoController(id, { title: updatedTitle });
    expect(updatedTodo.Attributes?.title).toEqual(todoFake.test2.updated.title);
    await deleteTodoController(id, true);
  });
  it('Todo test #3: Create todo and try to update the title with invalid id', async () => {
    const result = await createTodoController(todoFake.test3.initial);
    const { id } = result;
    const getFromDynamo = await getTodoController(id);
    expect(getFromDynamo).toEqual(result);
    const updatedTitle = 'New title for test todo';
    await expect(updateTodoController('123456', { title: updatedTitle })).rejects.toThrow(NotFoundError);
    await deleteTodoController(id, true);
  });
  it('Todo test #4: Create todo and complete it', async () => {
    const result = await createTodoController(todoFake.test4.initial);
    const { id } = result;
    const getFromDynamo = await getTodoController(id);
    expect(getFromDynamo).toEqual(result);
    const updatedTodo = await updateTodoController(id, { completed: true });
    expect(updatedTodo.Attributes?.completed).toEqual(todoFake.test4.completed.completed);
    await deleteTodoController(id, true);
  });
  it('Todo test #5: Create todo and delete it without completing it', async () => {
    const result = await createTodoController(todoFake.test5.initial);
    const { id } = result;
    const getFromDynamo = await getTodoController(id);
    expect(getFromDynamo).toEqual(result);
    await expect(deleteTodoController(id)).rejects.toThrow(ForbiddenError);
    await deleteTodoController(id, true);
  });
  it('Todo test #6: Create todo and delete it after completing it', async () => {
    const result = await createTodoController(todoFake.test6.initial);
    const { id } = result;
    const getFromDynamo = await getTodoController(id);
    expect(getFromDynamo).toEqual(result);
    const updatedTodo = await updateTodoController(id, { completed: true });
    await deleteTodoController(id);
    const getFromDynamoAfterDeleting = await getTodoController(id);
    expect(getFromDynamoAfterDeleting).toBeUndefined();
  });
});
