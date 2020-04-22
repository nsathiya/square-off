import * as Joi from '@hapi/joi';

export const bodySchema = Joi.object({
  username: Joi.string().required(),
});
