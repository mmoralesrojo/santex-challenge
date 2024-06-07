/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
process.env = Object.assign(process.env, { DYNAMO_TABLE_TODOS: 'dev-Todos' });
process.env = Object.assign(process.env, { AWS_SELECTED_REGION: 'us-east-1' });