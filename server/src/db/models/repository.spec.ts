const { User, Friendship } = require("./index");
const { FriendStatus } = require('../../lib/constants');
import { getAllFriendsForUser } from './repository';
import { expect } from 'chai';
import 'mocha';

describe('Repository - #getAllFriendsForUser', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

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

    const friends = await getAllFriendsForUser(userA.id);
    expect(friends[0].target.user_id).to.equal(userC.user_id);
    expect(friends[1].target.user_id).to.equal(userB.user_id);
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

    const friends = await getAllFriendsForUser(userC.id);

    expect(friends[0].seeker.user_id).to.equal(userA.user_id);
    expect(friends[0].target.user_id).to.equal(userC.user_id);
  });

});
