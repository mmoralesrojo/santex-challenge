import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand, DeleteCommandInput, ScanCommandInput, GetCommandInput, PutCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_SELECTED_REGION });
const documentClient = DynamoDBDocumentClient.from(client);

export const scan = async (params: ScanCommandInput) => {
  return await documentClient.send(new ScanCommand(params));
}

export const get = async (params: GetCommandInput) => {
  return await documentClient.send(new GetCommand(params));
}

export const put = async (params: PutCommandInput) => {
  return await documentClient.send(new PutCommand(params));
}

export const update = async (params: UpdateCommandInput) => {
  return await documentClient.send(new UpdateCommand(params));
}

export const del = async (params: DeleteCommandInput) => {
  return await documentClient.send(new DeleteCommand(params));
}