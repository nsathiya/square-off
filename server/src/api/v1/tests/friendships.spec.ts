const { User, Friendship } = require('../../../db/models');
const { FriendStatus } = require('../../../lib/constants');
import { getUserFriendsList } from '../../../db/models/repository';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import chaiExclude from 'chai-exclude';
import app from '../../../index';
import 'mocha';

chai.use(chaiExclude);
chai.use(chaiHttp);

describe('Friendships routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  describe('create a new pending friendship', () => {
    it('with correct input should respond with 200', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });

      const response: any = await chai.request(app)
          .post(`/api/v1/friendships/user/${userA.id}/pending`)
          .set('content-type', 'application/json')
          .send({
            friendId: userB.id
          });

      expect(response.statusCode).to.equal(200);
      expect(response.body.message.friendship.user).to.equal(userA.id);
      expect(response.body.message.friendship.friend).to.equal(userB.id);
      expect(response.body.message.friendship.status).to.equal(FriendStatus.PENDING);
      expect(response.body.message.friend.id).to.equal(userB.id);

      const friendsForUserA = await getUserFriendsList(userA.id);
      const friendsForUserB = await getUserFriendsList(userB.id);
      expect(friendsForUserA[0].user.username).to.equal(userB.username);
      expect(friendsForUserB[0].user.username).to.equal(userA.username);
    });

    it('with non-guid user id should respond with 400', async () => {
      const userB = await User.createUser({ username: 'userB' });
      const response: any = await chai.request(app)
          .post(`/api/v1/friendships/user/123/pending`)
          .set('content-type', 'application/json')
          .send({
            friendId: userB.id
          });
      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request params. "id" must be a valid GUID.');
    });

    it('with non-guid/invalid friendId should respond with 400', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const response: any = await chai.request(app)
          .post(`/api/v1/friendships/user/${userA.id}/pending`)
          .set('content-type', 'application/json')
          .send({
            friendId: null,
          });
      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request body. "friendId" must be a string.');
    });
  });

});
