const {
  User,
  Friendship,
  Challenge,
  Scorecard,
  Activity,
  ActivityIndicator,
} = require('../db/models');
const {
  Exercise,
  ExerciseMetric,
} = require('../lib/constants');
import { updateScore } from './ScoreCalculator';
import { expect } from 'chai';
import * as chai from 'chai';
import * as moment from 'moment';
import chaiExclude from 'chai-exclude';
import { createChallenge, createActivity } from '../test/helper';
import 'mocha';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

chai.use(chaiExclude);

describe('ScoreCalculator -', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
    await Activity.truncate({ cascade: true });
    await Scorecard.truncate({ cascade: true });
  });

  describe('#update', () => {
    it('update with challenge metric as distance', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        metric: ExerciseMetric.DISTANCE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
        distance: 3,
      });
      await updateScore(activity);
      const indicators = await ActivityIndicator.findAll({});
      const scorecards = await Scorecard.findAll({});

      expect(indicators[0].challengeId).to.equal(challenge.id);
      expect(indicators[0].activityId).to.equal(activity.id);
      expect(scorecards[0].userId).to.equal(userA.id);
      expect(scorecards[0].challengeId).to.equal(challenge.id);
      expect(scorecards[0].data.score).to.equal(3);
    });
    it('update with challenge metric as time', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        metric: ExerciseMetric.TIME,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
        time: 1800,
      });
      await updateScore(activity);
      const indicators = await ActivityIndicator.findAll({});
      const scorecards = await Scorecard.findAll({});

      expect(indicators[0].challengeId).to.equal(challenge.id);
      expect(indicators[0].activityId).to.equal(activity.id);
      expect(scorecards[0].userId).to.equal(userA.id);
      expect(scorecards[0].challengeId).to.equal(challenge.id);
      expect(scorecards[0].data.score).to.equal(1800);
    });
    it('update with challenge metric as calories', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        metric: ExerciseMetric.CALORIES,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
        caloriesBurned: 440,
      });
      await updateScore(activity);
      const indicators = await ActivityIndicator.findAll({});
      const scorecards = await Scorecard.findAll({});

      expect(indicators[0].challengeId).to.equal(challenge.id);
      expect(indicators[0].activityId).to.equal(activity.id);
      expect(scorecards[0].userId).to.equal(userA.id);
      expect(scorecards[0].challengeId).to.equal(challenge.id);
      expect(scorecards[0].data.score).to.equal(440);
    });
    it('multiple updates should add metric unit time', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        metric: ExerciseMetric.DISTANCE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });

      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
        distance: 3,
      });
      await updateScore(activity);
      const scorecards = await Scorecard.findAll({});
      expect(scorecards[0].data.score).to.equal(3);

      const activity2 = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: moment.utc().add(4, 'days').format(timeFormat),
        distance: 2,
      });
      await updateScore(activity2);
      const scorecardsUpdated = await Scorecard.findAll({});
      expect(scorecardsUpdated[0].data.score).to.equal(5);

      const activity3 = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: moment.utc().add(4, 'days').format(timeFormat),
        distance: 4,
      });
      await updateScore(activity3);
      const scorecardsUpdated2 = await Scorecard.findAll({});
      expect(scorecardsUpdated2[0].data.score).to.equal(9);
    });
  });

});
