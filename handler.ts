import { StatusCodes } from 'http-status-codes';
import { getTodosController, getTodoController, createTodoController, updateTodoController, deleteTodoController } from './src/controller/todo-controller';
import { errorResponse } from './src/utils/error';
import { validateCreateTodo, validateUpdateTodo } from './src/utils/validations';
import { RESPONSE_HEADERS } from './src/utils/constants';

export const getTodos = async () => {
  try {
    const data: any = await getTodosController();
    return {
      statusCode: StatusCodes.OK,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ data }, null, 2)
    };
  }
  catch (err) {
    return errorResponse(err);
  }
}

export const getTodo = async (event: any) => {
  try {
    //We get the id from the URL
    const { id } = event.pathParameters;
    const data: any = await getTodoController(id);

    if (!data) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        headers: RESPONSE_HEADERS,
        body: JSON.stringify({ message: `Todo with id ${id} not found` }, null, 2)
      };
    }

    return {
      statusCode: StatusCodes.OK,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ data }, null, 2)
    };
  } catch (err) {
    return errorResponse(err);
  }
}

export const createTodo = async (event: any) => {
  const data = JSON.parse(event.body);
  try {
    validateCreateTodo(data);
    const todo = await createTodoController(data);
    return {
      statusCode: StatusCodes.OK,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ todo }, null, 2),
    };
  } catch (err) {
    return errorResponse(err);
  }
}

export const updateTodo = async (event: any) => {
  const { id } = event.pathParameters;
  const data = JSON.parse(event.body);
  try {
    validateUpdateTodo(data);
    const updatedTodo = await updateTodoController(id, data);
    return {
      statusCode: StatusCodes.OK,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({
        todo: updatedTodo.Attributes
      }, null, 2),
    };
  } catch (err) {
    return errorResponse(err);
  }
}

export const deleteTodo = async (event: any) => {
  const { id } = event.pathParameters;
  try {
    await deleteTodoController(id);
    return {
      statusCode: StatusCodes.NO_CONTENT,
      headers: RESPONSE_HEADERS,
    };
  } catch (err) {
    return errorResponse(err);
  }
}
