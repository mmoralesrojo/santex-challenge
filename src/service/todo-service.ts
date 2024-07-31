import { ReturnValue } from "@aws-sdk/client-dynamodb";
import * as DataAccess from "../utils/data-access";

const TODO_TABLE = process.env.DYNAMO_TABLE_TODOS as string;
const UPDATABLE_FIELDS = ['title', 'completed']

type Metadata = {
  createdAt: string,
  updatedAt?: string
}

type Todo = {
  id?: string,
  title: string,
  completed?: boolean
  metadata?: Metadata;
}

export const getTodos = async () => {
  return await DataAccess.scan({
    TableName: TODO_TABLE
  })
}

export const getTodo = async (id: string) => {
  return await DataAccess.get({
    TableName: TODO_TABLE,
    Key: {
      id
    }
  })
}

export const createTodo = async (data: Todo) => {
  await DataAccess.put({
    TableName: TODO_TABLE,
    Item: data
  });
  return (await getTodo(data.id as string))?.Item;
}

export const updateTodo = async (id: string, data: Todo) => {
  let valid: boolean = false;
  let updateExpression: string = 'set ';
  let expressionAttributeValues: any = {};
  //We iterate over the attributes to check if they are present in the request
  UPDATABLE_FIELDS.forEach((attr) => {
    if (data.hasOwnProperty(attr)) {
      updateExpression += `${attr} = :${attr}, `;
      expressionAttributeValues[`:${attr}`] = data[attr as keyof Todo];
      //Valid request with at least one valid attribute
      valid = true;
    }
  });
  //If request is invalid we return a bad request response
  updateExpression += 'metadata.updatedAt = :updatedAt';
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();
  return await DataAccess.update({
    TableName: TODO_TABLE,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: ReturnValue.ALL_NEW
  })
}

export const deleteTodo = async (id: string) => {
  return await DataAccess.del({
    TableName: TODO_TABLE,
    Key: { id }
  })
}