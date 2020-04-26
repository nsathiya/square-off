import * as moment from 'moment';
const { Challenge } = require('../db/models');
import { Exercise, ExerciseMetric, ChallengeStatus } from '../lib/constants';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

export const createChallenge = async function (overrides: {} = {}) {
  const startTime = moment.utc().format(timeFormat);
  const endTime = moment.utc().add(5, 'days').format(timeFormat);
  const defaultData = {
    name: 'Challenge 1',
    exercise: Exercise.CYCLE,
    metric: ExerciseMetric.DISTANCE,
    status: ChallengeStatus.HAVE_NOT_STARTED,
    start_time: startTime,
    end_time: endTime,
  };
  const data = Object.assign(defaultData, overrides);
  const challenge = await Challenge.createChallenge(data);

  return challenge.get();
};
