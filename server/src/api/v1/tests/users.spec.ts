const { User, Friendship, Scorecard, Challenge } = require('../../../db/models');
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import chaiExclude from 'chai-exclude';
import app from '../../../index';
const { FriendStatus, ScorecardStatus } = require('../../../lib/constants');
const { createChallenge } = require('../../../test/helper');
import 'mocha';

chai.use(chaiExclude);
chai.use(chaiHttp);

describe('Users routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
    await Scorecard.truncate({ cascade: true });
  });

  describe('create a new user', () => {
    it('with correct input should respond with 200', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            first_name: 'john',
            last_name: 'doe',
            username: 'johntest',
            email: 'john@test.com',
            phone_number: '2342344567'
          });

      expect(response.statusCode).to.equal(200);
      expect(response.body.message.username).to.equal('johntest');
      expect(response.body.message.first_name).to.equal('john');
      expect(response.body.message.last_name).to.equal('doe');
      expect(response.body.message.phone_number).to.equal('2342344567');

      const users = await User.findAll({});
      expect(users[0].username).to.equal('johntest');
      // TODO remove id from response.
      expect(users[0].id).to.equal(response.body.message.id);
    });

    it('with no username should respond with 400', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            first_name: 'john',
            last_name: 'doe',
            email: 'john@test.com',
            phone_number: '2342344567'
          });

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request body. "username" is required.');

      const users = await User.findAll({});
      expect(users.length).to.equal(0);
    });

    it('with only username should respond with 200', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            username: 'johnd',
          });

      expect(response.statusCode).to.equal(200);

      const users = await User.findAll({});
      expect(users.length).to.equal(1);
    });
  });

  describe('get all users', () => {
    it('with correct input should respond with 200', async () => {
      const user1 = await User.create({
        first_name: 'john',
        last_name: 'doe',
        username: 'johnd',
        email: 'john@test.com',
        phone_number: '2342344567'
      });
      const user2 = await User.create({
        first_name: 'jake',
        last_name: 'lee',
        username: 'jakel',
        email: 'jakel@test.com',
        phone_number: '2342344567'
      });
      const response: any = await chai.request(app)
          .get(`/api/v1/users`)
          .set('content-type', 'application/json');

      const user2Response = response.body.message[0];
      const user1Response = response.body.message[1];
      const excludedFields = ['id', 'createdAt', 'updatedAt'];
      expect(response.statusCode).to.equal(200);
      expect(user2Response).excluding(excludedFields).to.deep.equal({
        first_name: 'jake',
        last_name: 'lee',
        username: 'jakel',
        email: 'jakel@test.com',
        phone_number: '2342344567'
      });
      expect(user1Response).excluding(excludedFields).to.deep.equal({
        first_name: 'john',
        last_name: 'doe',
        username: 'johnd',
        email: 'john@test.com',
        phone_number: '2342344567'
      });
    });

    it('with no users should respond with 200', async () => {
      const response: any = await chai.request(app)
          .get(`/api/v1/users`)
          .set('content-type', 'application/json');

      const excludedFields = ['id', 'createdAt', 'updatedAt'];
      expect(response.statusCode).to.equal(200);
      expect(response.body.message).to.deep.equal([]);
    });
  });

  describe('get user\'s friendsList', () => {
    it('with correct input should respond with 200', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      await Friendship.createFriendship({
        user: userA.id,
        friend: userB.id,
        status: FriendStatus.PENDING
      });
      const userC = await User.createUser({ username: 'userC' });
      await Friendship.createFriendship({
        user: userA.id,
        friend: userC.id,
        status: FriendStatus.PENDING
      });

      const response: any = await chai.request(app)
          .get(`/api/v1/users/${userA.id}/friendslist`)
          .set('content-type', 'application/json');

      const friends = response.body.message;
      expect(friends.length).to.equal(2);
      expect(friends[0].user.id).to.equal(userC.id);
      expect(friends[1].user.id).to.equal(userB.id);
    });

    it('with no valid user id should respond with 400', async () => {
      const response: any = await chai.request(app)
          .get(`/api/v1/users/123/friendslist`)
          .set('content-type', 'application/json');

      const excludedFields = ['id', 'createdAt', 'updatedAt'];
      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request params. "id" must be a valid GUID.');
    });
  });

  describe('get user\'s challenges', () => {
    it('with correct input should respond with 200', async () => {
      const user = await User.createUser({ username: 'userA' });
      const challenge = await createChallenge();
      const challenge2 = await createChallenge({ name: 'Challenge 2'});

      await Scorecard.createScorecard({ userId: user.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: user.id, challengeId: challenge2.id });

      const response: any = await chai.request(app)
          .get(`/api/v1/users/${user.id}/challenges`)
          .set('content-type', 'application/json');

      const challenges = response.body.message;
      expect(challenges.length).to.equal(2);
      expect(challenges[0].challenge.id).to.equal(challenge2.id);
      expect(challenges[0].status).to.equal(ScorecardStatus.ACCEPTED);
      expect(challenges[1].challenge.id).to.equal(challenge.id);
      expect(challenges[1].status).to.equal(ScorecardStatus.ACCEPTED);
    });

    it('with no valid challenge id should respond with 400', async () => {
      const response: any = await chai.request(app)
          .get(`/api/v1/users/123/challenges`)
          .set('content-type', 'application/json');

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request params. "id" must be a valid GUID.');
    });
  });

});
