import * as Joi from '@hapi/joi';

export const bodySchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  username: Joi.string().required(),
  email: Joi.string().optional(),
  phone_number: Joi.string().optional(),
});
