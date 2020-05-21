import { ActivityInstance } from '../db/models/activity';
import { ScorecardInstance } from '../db/models/scorecard';
const {
  Scorecard,
  ActivityIndicator,
} = require('../db/models');
import { getScorecardsToUpdateForActivity } from '../db/models/repository';
import { ExerciseMetric } from '../lib/constants';
const db = require('../db/models');

export async function updateScore(activity: ActivityInstance) {
  const { startTime, exercise } = activity;
  const scorecardsToUpdate = await getScorecardsToUpdateForActivity(activity);
  const activityIndicators = [];
  for (const scorecard of scorecardsToUpdate) {
    let scorecardData: { data: {} };
    const challenge = scorecard.Challenge;
    switch (challenge.metric) {
      case ExerciseMetric.DISTANCE:
      scorecardData = recalculateScorecardByDistance(scorecard, activity);
      break;
      case ExerciseMetric.TIME:
      scorecardData = recalculateScorecardByTime(scorecard, activity);
      break;
      case ExerciseMetric.CALORIES:
      scorecardData = recalculateScorecardByCalories(scorecard, activity);
      break;
    }
    // TODO bulk update
    await Scorecard.editScorecard(scorecard.id, { data: scorecardData });
    activityIndicators.push({ activityId: activity.id, challengeId: challenge.id });
  }
  await ActivityIndicator.bulkCreateActivityIndicators(activityIndicators);
}

export function recalculateScorecardByDistance (scorecard: ScorecardInstance, activity: ActivityInstance) {
  let score = scorecard.data.score;
  score += activity.distance;
  return Object.assign({}, scorecard.data, { score });
}

export function recalculateScorecardByTime (scorecard: ScorecardInstance, activity: ActivityInstance) {
  let score = scorecard.data.score;
  score += activity.time;
  return Object.assign({}, scorecard.data, { score });
}

export function recalculateScorecardByCalories (scorecard: ScorecardInstance, activity: ActivityInstance) {
  let score = scorecard.data.score;
  score += activity.caloriesBurned;
  return Object.assign({}, scorecard.data, { score });
}
