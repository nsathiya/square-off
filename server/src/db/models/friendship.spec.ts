// import * as db from './index';
const { User, Friendship } = require('./index');
const { FriendStatus } = require('../../lib/constants');
import { expect } from 'chai';
import 'mocha';

describe('Friendship model', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  it('create a new friendship', async () => {
    const userA = await User.createUser({ username: 'userA' });
    const userB = await User.createUser({ username: 'userB' });

    const friendship = await Friendship.createFriendship({
      user: userA.id,
      friend: userB.id,
      status: FriendStatus.PENDING
    });

    expect(friendship.id).to.exist;
    expect(friendship.user).to.equal(userA.id);
    expect(friendship.friend).to.equal(userB.id);
    expect(friendship.status).to.equal(FriendStatus.PENDING);
    expect(friendship.createdAt).to.exist;

  });

});
