import { DynamoDBClient, ReturnValue } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ForbiddenError, NotFoundError } from '../utils/error';

const client = new DynamoDBClient({ region: process.env.AWS_SELECTED_REGION });
const documentClient = DynamoDBDocumentClient.from(client);

const TODO_TABLE = process.env.DYNAMO_TABLE_TODOS as string;

export const getTodosController = async () => {
  const todos = await documentClient.send(new ScanCommand({
    TableName: TODO_TABLE
  }));
  return {
    todos: todos.Items,
    count: todos.Count
  }
};

export const getTodoController = async (id: string) => {
  const todo = await documentClient.send(new GetCommand({
    TableName: TODO_TABLE,
    Key: {
      id
    }
  }));
  return todo.Item
}

export const createTodoController = async (data: any) => {
  const todo = {
    id: uuidv4(),
    ...data,
    completed: false,
    metadata: {
      createdAt: new Date().toISOString()
    }
  };
  await documentClient.send(new PutCommand({
    TableName: TODO_TABLE,
    Item: todo
  }));
  return todo;
}

export const updateTodoController = async (id: string, data: any) => {
  //Let's check first if the todo exists
  const getParams = {
    TableName: TODO_TABLE,
    Key: { id },
  };
  const existingItem = await documentClient.send(new GetCommand(getParams));

  // If the item does not exist, throw notfound error
  if (!existingItem.Item) {
    throw new NotFoundError(`Todo with id ${id} not found`);
  }
  //We define the attributes that can be updated, others will be ignored
  const attributes: string[] = ['title', 'completed'];
  let valid: boolean = false;
  let updateExpression: string = 'set ';
  let expressionAttributeValues: any = {};
  //We iterate over the attributes to check if they are present in the request
  attributes.forEach((attr) => {
    if (data.hasOwnProperty(attr)) {
      updateExpression += `${attr} = :${attr}, `;
      expressionAttributeValues[`:${attr}`] = data[attr];
      //Valid request with at least one valid attribute
      valid = true;
    }
  });
  //If request is invalid we return a bad request response
  updateExpression += 'metadata.updatedAt = :updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const params = {
    TableName: process.env.DYNAMO_TABLE_TODOS as string,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: ReturnValue.ALL_NEW
  };
  return await documentClient.send(new UpdateCommand(params));
}

export const deleteTodoController = async (id: string, force: boolean = false) => {
  //Let's check first if the todo exists
  const getParams = {
    TableName: TODO_TABLE,
    Key: { id },
  };
  const existingItem = await documentClient.send(new GetCommand(getParams));

  // If the item does not exist, throw notfound error
  if (!existingItem.Item) {
    throw new NotFoundError(`Todo with id ${id} not found`);
  }
  const params: DeleteCommandInput = {
    TableName: process.env.DYNAMO_TABLE_TODOS as string,
    Key: { id }
  };
  if (!force) {
    params.ConditionExpression = 'completed = :completed'
    params.ExpressionAttributeValues = {
      ':completed': true
    }
  }
  try {
    await documentClient.send(new DeleteCommand(params));
  }
  catch (err: any) {
    if (err?.name === 'ConditionalCheckFailedException') {
      throw new ForbiddenError(`Todo with id ${id} is not completed`);
    }
    throw new Error(err);
  }
  
}