const { User, Friendship } = require("./index");
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
      const userA = await User.createUser({ userId: 'userA' });
      const userB = await User.createUser({ userId: 'userB' });
      const userC = await User.createUser({ userId: 'userC' });

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
      expect(friends[0].user.user_id).to.equal(userC.user_id);
      expect(friends[1].user.user_id).to.equal(userB.user_id);
    });

    it('get all friends for user (w/ friendships saved as friend)', async () => {
      const userA = await User.createUser({ userId: 'userA' });
      const userB = await User.createUser({ userId: 'userB' });
      const userC = await User.createUser({ userId: 'userC' });

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

      expect(friends[0].user.user_id).to.equal(userA.user_id);
    });
  });

});
