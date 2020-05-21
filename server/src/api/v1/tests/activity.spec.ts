const { User, Friendship, Scorecard, Challenge, ActivityIndicator, Activity } = require('../../../db/models');
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import chaiExclude from 'chai-exclude';
import * as moment from 'moment';
import app from '../../../index';
const {
  Exercise,
  ExerciseMetric,
  ChallengeStatus,
  DistanceMetric,
} = require('../../../lib/constants');
import { getChallengeDetails } from '../../../db/models/repository';
const { createChallenge, createActivity } = require('../../../test/helper');
import 'mocha';

chai.use(chaiExclude);
chai.use(chaiHttp);

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

describe('Activities routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
    await Scorecard.truncate({ cascade: true });
  });

  describe('create a new activity', () => {
    it('with correct input should respond with 200', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challenge = await createChallenge();
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityBody = {
        name: 'Activity 1',
        exercise: Exercise.CYCLE,
        distance: 2.8,
        distanceMetric: DistanceMetric.MILE,
        time: 2100, // 35 mins
        caloriesBurned: 320,
        startTime: moment.utc().format(timeFormat),
        userId: userA.id,
      };
      const response: any = await chai.request(app)
          .post(`/api/v1/activities`)
          .set('content-type', 'application/json')
          .send(activityBody);

      expect(response.statusCode).to.equal(200);
      const activities = response.body.message;

      const excludedFields = ['updatedAt', 'createdAt', 'id'];
      expect(activities).excluding(excludedFields).to.deep.equal(activityBody);
      // Testing side effects
      const scorecards = await Scorecard.findAll({});
      expect(scorecards[0].data.score).to.equal(2.8);
    });

    it('with no optional params should respond with 200', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challenge = await createChallenge();
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityBody = {
        name: 'Activity 1',
        exercise: Exercise.CYCLE,
        startTime: moment.utc().format(timeFormat),
        userId: userA.id,
      };
      const response: any = await chai.request(app)
          .post(`/api/v1/activities`)
          .set('content-type', 'application/json')
          .send(activityBody);

      expect(response.statusCode).to.equal(200);
    });
    it('with no required params should respond with 400', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challenge = await createChallenge();
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityBody = {
        name: 'Activity 1',
        distance: 2.8,
        distanceMetric: DistanceMetric.MILE,
        time: 2100, // 35 mins
        caloriesBurned: 320,
      };
      const response: any = await chai.request(app)
          .post(`/api/v1/activities`)
          .set('content-type', 'application/json')
          .send(activityBody);

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request body. "exercise" is required. "userId" is required. "startTime" is required.');
    });
  });

});
