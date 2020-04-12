import * as Joi from '@hapi/joi'

export const querySchema = Joi.object({
  id: Joi.string().guid().required(),
});
