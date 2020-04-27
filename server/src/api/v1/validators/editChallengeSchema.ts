import * as Joi from '@hapi/joi';

export const bodySchema = Joi.object({
  name: Joi.string().optional(),
});

export const paramsSchema = Joi.object({
  id: Joi.string().guid().required(),
});
