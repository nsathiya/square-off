import * as Joi from '@hapi/joi';
import { Exercise, DistanceMetric } from '../../../lib/constants';

export const bodySchema = Joi.object({
  name: Joi.string(),
  distance: Joi.number().optional(),
  distanceMetric: Joi.string().valid(...Object.values(DistanceMetric)).optional(),
  time: Joi.number().optional(), // in seconds
  caloriesBurned: Joi.number().optional(),
  exercise: Joi.string().valid(...Object.values(Exercise)).required(),
  userId: Joi.string().guid().required(),
  startTime: Joi.date().required(),
});
