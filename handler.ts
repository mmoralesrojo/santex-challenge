import { StatusCodes } from 'http-status-codes';
import { getTodosController, getTodoController, createTodoController, updateTodoController, deleteTodoController } from './src/controller/todo-controller';
import { ForbiddenError, NotFoundError } from './src/utils/error';

export const getTodos = async () => {
  try {
    const data: any = await getTodosController();
    return {
      statusCode: StatusCodes.OK,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ data }, null, 2)
    };
  }
  catch (err) {
    const response = {
      message: `An error occurred while fetching todos: ${err}`
    }
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response, null, 2)
    };
  }
}

export const getTodo = async (event: any) => {
  try {
    //We get the id from the URL
    const { id } = event.pathParameters;
    const data = await getTodoController(id);

    if (!data) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: `Todo with id ${id} not found` }, null, 2)
      };
    }

    return {
      statusCode: StatusCodes.OK,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ data }, null, 2)
    };
  } catch (err) {
    const response = {
      message: `An error occurred while fetching todo: ${err}`
    }
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response, null, 2)
    };
  }
}

export const createTodo = async (event: any) => {
  const data = JSON.parse(event.body);
  const { title } = data;

  //Validations
  if (!title) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Title is required' }, null, 2)
    };
  }

  try {
    const todo = await createTodoController(data);

    return {
      statusCode: StatusCodes.OK,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ todo }, null, 2),
    };
  } catch (err) {
    const response = {
      message: `An error occurred while creating todo: ${err}`
    }
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response, null, 2)
    };
  }
}

export const updateTodo = async (event: any) => {
  const { id } = event.pathParameters;
  const data = JSON.parse(event.body);
  const { title } = data;
  //Validations
  if (!title && !data.hasOwnProperty('completed')) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Missing valid attributes' }, null, 2)
    };
  }
  try {
    const updatedTodo = await updateTodoController(id, data);
    return {
      statusCode: StatusCodes.OK,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        todo: updatedTodo.Attributes
      }, null, 2),
    };
  } catch (err) {
    if (err instanceof NotFoundError) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: err.message }, null, 2)
      };
    }
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: `An error occurred while creating todo: ${err}`
      }, null, 2)
    };
  }
}

export const deleteTodo = async (event: any) => {
  const { id } = event.pathParameters;

  try {
    await deleteTodoController(id);

    return {
      statusCode: StatusCodes.NO_CONTENT,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    };
  } catch (err) {
    if (err instanceof NotFoundError) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: err.message }, null, 2)
      };
    }
    if (err instanceof ForbiddenError) {
      return {
        statusCode: StatusCodes.FORBIDDEN,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: err.message }, null, 2)
      };
    }
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: `An error occurred while creating todo: ${err}`
      }, null, 2)
    };
  }
}