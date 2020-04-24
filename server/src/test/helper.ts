import * as moment from 'moment';
const { Challenge } = require('../db/models');
import { Exercise, ExerciseMetric, ChallengeStatus } from '../lib/constants';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

export const createChallenge = async function () {
  const startTime = moment.utc().format(timeFormat);
  const endTime = moment.utc().add(5, 'days').format(timeFormat);

  const challenge = await Challenge.createChallenge({
    name: 'Challenge 1',
    exercise: Exercise.CYCLE,
    metric: ExerciseMetric.DISTANCE,
    status: ChallengeStatus.HAVE_NOT_STARTED,
    start_time: startTime,
    end_time: endTime,
  });

  return challenge.get();
};
