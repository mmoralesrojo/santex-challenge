import { StatusCodes } from "http-status-codes";
import { RESPONSE_HEADERS } from "./constants";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string, errors: string[]) {
    super(message);
    this.name = 'BadRequestError';
    this.errors = errors;
  }
  errors: string[];
}

export const errorResponse = (err: unknown) => {
  if (err instanceof BadRequestError) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ message: err.message, errors: err.errors }, null, 2)
    };
  }
  else if (err instanceof ForbiddenError) {
    return {
      statusCode: StatusCodes.FORBIDDEN,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ message: err.message }, null, 2)
    };
  }
  else if (err instanceof NotFoundError) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ message: err.message }, null, 2)
    };
  }
  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify({
      message: `An error occurred while creating todo: ${err}`
    }, null, 2)
  };
}