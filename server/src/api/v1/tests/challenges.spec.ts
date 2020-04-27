const { User, Friendship, Scorecard, Challenge } = require('../../../db/models');
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
} = require('../../../lib/constants');
import { getChallengeParticipants } from '../../../db/models/repository';
const { createChallenge } = require('../../../test/helper');
import 'mocha';

chai.use(chaiExclude);
chai.use(chaiHttp);

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

describe('Challenges routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
    await Scorecard.truncate({ cascade: true });
  });

  describe('create a new challenge', () => {
    it('with correct input should respond with 200', async () => {
      const body = {
        name: 'Cycle Through!',
        exercise: Exercise.CYCLE,
        metric: ExerciseMetric.DISTANCE,
        start_time: moment().format(timeFormat),
        end_time:  moment().add(5, 'days').format(timeFormat),
        participants: [],
      };
      const response: any = await chai.request(app)
          .post(`/api/v1/challenges`)
          .set('content-type', 'application/json')
          .send(body);

      const excludedFields = ['id', 'createdAt', 'updatedAt', 'participants'];
      expect(response.statusCode).to.equal(200);
      expect(response.body.message).excluding(excludedFields).to.deep.equal(
        Object.assign({ status: ChallengeStatus.HAVE_NOT_STARTED }, body)
      );

      const challenges = await Challenge.findAll({});
      expect(challenges[0].name).to.equal('Cycle Through!');
    });

    it('with no exercise, metric, start_time, end_time should respond with 400', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/challenges`)
          .set('content-type', 'application/json')
          .send({
            name: 'Cycle Through!',
          });

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request body. "exercise" is required. "metric" is required. "start_time" is required. "end_time" is required.');

      const challenges = await Challenge.findAll({});
      expect(challenges.length).to.equal(0);
    });

    it('with correct input should persist and return participants', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });

      const response: any = await chai.request(app)
          .post(`/api/v1/challenges`)
          .set('content-type', 'application/json')
          .send({
            name: 'Cycle Through!',
            exercise: Exercise.CYCLE,
            metric: ExerciseMetric.DISTANCE,
            start_time: moment().format(timeFormat),
            end_time:  moment().add(5, 'days').format(timeFormat),
            participants: [userA.id, userB.id],
          });
      expect(response.statusCode).to.equal(200);
      const participants = response.body.message.participants;
      expect(participants[0]).to.equal(userA.id);
      expect(participants[1]).to.equal(userB.id);

      const participantsDb = await getChallengeParticipants(response.body.message.id);
      expect(participantsDb.participants[0]).to.deep.equal(userA);
      expect(participantsDb.participants[1]).to.deep.equal(userB);
    });
  });

  describe('get challenge', () => {
    it('with correct input should respond with 200', async () => {
      const challenge = await createChallenge();

      const response: any = await chai.request(app)
          .get(`/api/v1/challenges/${challenge.id}`)
          .set('content-type', 'application/json');

      const challengeResponse = response.body.message;
      const excludedFields = ['id', 'createdAt', 'updatedAt'];
      expect(response.statusCode).to.equal(200);
      expect(challengeResponse).excluding(excludedFields).to.deep.equal(challenge);
    });

    it('with invalid challenge id should respond with 400', async () => {
      const response: any = await chai.request(app)
          .get(`/api/v1/challenges/123`)
          .set('content-type', 'application/json');

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.deep.equal('Error validating request params. "id" must be a valid GUID.');
    });
  });

  describe('edit challenge', () => {
    it('with correct input should respond with 200', async () => {
      const challenge = await createChallenge();

      expect(challenge.name).to.equal('Challenge 1');

      const response: any = await chai.request(app)
          .patch(`/api/v1/challenges/${challenge.id}`)
          .set('content-type', 'application/json')
          .send({
            name: 'Cycle Through!',
          });

      const challengeResponse = response.body.message;
      expect(response.statusCode).to.equal(200);
      expect(challengeResponse.name).to.equal('Cycle Through!');
      expect(challengeResponse.exercise).to.equal(Exercise.CYCLE);
    });

    it('with change to exercise should respond with 400', async () => {
      const challenge = await createChallenge();

      const response: any = await chai.request(app)
          .patch(`/api/v1/challenges/${challenge.id}`)
          .set('content-type', 'application/json')
          .send({
            name: 'Cycle Through!',
            exercise: Exercise.RUN,
          });

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.deep.equal('Error validating request body. "exercise" is not allowed.');
    });
  });

  describe('get challenge\'s participants', () => {
    it('with correct input should respond with 200', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const userC = await User.createUser({ username: 'userC' });

      const challenge = await createChallenge();
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userC.id, challengeId: challenge.id });

      const response: any = await chai.request(app)
          .get(`/api/v1/challenges/${challenge.id}/participants`)
          .set('content-type', 'application/json');

      const participants = response.body.message;
      expect(participants.length).to.equal(3);
      expect(participants[0].id).to.equal(userC.id);
      expect(participants[1].id).to.equal(userB.id);
      expect(participants[2].id).to.equal(userA.id);
    });

    it('with no valid challenge id should respond with 400', async () => {
      const response: any = await chai.request(app)
          .get(`/api/v1/challenges/123/participants`)
          .set('content-type', 'application/json');

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request params. "id" must be a valid GUID.');
    });
  });

});
