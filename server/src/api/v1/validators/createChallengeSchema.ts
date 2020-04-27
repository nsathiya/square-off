import * as Joi from '@hapi/joi';
import { Exercise, ExerciseMetric, ChallengeStatus } from '../../../lib/constants';

export const bodySchema = Joi.object({
  name: Joi.string(),
  exercise: Joi.string().valid(...Object.values(Exercise)).required(),
  metric: Joi.string().valid(...Object.values(ExerciseMetric)).required(),
  status: Joi.string().valid(...Object.values(ChallengeStatus)).optional(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
  participants: Joi.array().items(Joi.string().guid()),
});
