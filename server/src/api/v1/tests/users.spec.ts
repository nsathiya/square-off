const { User, Friendship } = require('../../../db/models');
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import chaiExclude from 'chai-exclude';
import app from '../../../index';
const { FriendStatus } = require('../../../lib/constants');
import 'mocha';

chai.use(chaiExclude);
chai.use(chaiHttp);

describe('Users routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  describe('create a new user', () => {
    it('with correct input should respond with 200', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            first_name: 'john',
            last_name: 'doe',
            user_id: 'johntest',
            email: 'john@test.com',
            phone_number: '2342344567'
          });

      expect(response.statusCode).to.equal(200);
      expect(response.body.message.user_id).to.equal('johntest');
      expect(response.body.message.first_name).to.equal('john');
      expect(response.body.message.last_name).to.equal('doe');
      expect(response.body.message.phone_number).to.equal('2342344567');

      const users = await User.findAll({});
      expect(users[0].user_id).to.equal('johntest');
      // TODO remove id from response.
      expect(users[0].id).to.equal(response.body.message.id);
    });

    it('with no user_id should respond with 400', async () => {
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
      expect(response.text).to.equal('Error validating request body. "user_id" is required.')

      const users = await User.findAll({});
      expect(users.length).to.equal(0);
    });

    it('with only user_id should respond with 200', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            user_id: 'johnd',
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
        user_id: 'johnd',
        email: 'john@test.com',
        phone_number: '2342344567'
      });
      const user2 = await User.create({
        first_name: 'jake',
        last_name: 'lee',
        user_id: 'jakel',
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
        user_id: 'jakel',
        email: 'jakel@test.com',
        phone_number: '2342344567'
      });
      expect(user1Response).excluding(excludedFields).to.deep.equal({
        first_name: 'john',
        last_name: 'doe',
        user_id: 'johnd',
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
      const userA = await User.createUser({ userId: 'userA' });
      const userB = await User.createUser({ userId: 'userB' });
      await Friendship.createFriendship({
        user: userA.id,
        friend: userB.id,
        status: FriendStatus.PENDING
      });
      const userC = await User.createUser({ userId: 'userC' });
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

});
