import * as Joi from '@hapi/joi';

export const paramsSchema = Joi.object({
  id: Joi.string().guid().required(),
});
