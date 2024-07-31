import Joi from 'joi';
import { BadRequestError } from './error';

export const validateCreateTodo = (todo: any) => {
  const schema = Joi.object().keys({
    title: Joi.string()
      .required().empty('You must specify a title')
  });
  validate(schema, todo);
}

export const validateUpdateTodo = (todo: any) => {
  const schema = Joi.object().keys({
    title: Joi.string(),
    completed: Joi.boolean()
  }).min(1);
  validate(schema, todo);
}

const validate = (schema: Joi.ObjectSchema, data: any) => {
  const validation = schema.validate(data);
  if (validation.error) {
    const errors: string[] = [];
    validation.error.details.forEach((error) => {
      errors.push(error.message);
    })
    throw new BadRequestError('The request is invalid',
      errors
    );
  }
}