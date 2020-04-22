const { User, Friendship } = require('./index');
const { FriendStatus } = require('../../lib/constants');
import { getUserFriendsList } from './repository';
import { expect } from 'chai';
import 'mocha';

describe('Repository -', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  describe('#getUserFriendsList', () => {
    it('get all friends for user (w/ friendships saved as user)', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const userC = await User.createUser({ username: 'userC' });

      await Friendship.createFriendship({
        user: userA.id,
        friend: userB.id,
        status: FriendStatus.PENDING
      });

      await Friendship.createFriendship({
        user: userA.id,
        friend: userC.id,
        status: FriendStatus.ACTIVE
      });

      const friends = await getUserFriendsList(userA.id);
      expect(friends[0].user.username).to.equal(userC.username);
      expect(friends[1].user.username).to.equal(userB.username);
    });

    it('get all friends for user (w/ friendships saved as friend)', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const userC = await User.createUser({ username: 'userC' });

      await Friendship.createFriendship({
        user: userA.id,
        friend: userB.id,
        status: FriendStatus.PENDING
      });

      await Friendship.createFriendship({
        user: userA.id,
        friend: userC.id,
        status: FriendStatus.ACTIVE
      });

      const friends = await getUserFriendsList(userC.id);

      expect(friends[0].user.username).to.equal(userA.username);
    });
  });

});
