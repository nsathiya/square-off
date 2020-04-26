const { User, Friendship, Challenge, Scorecard } = require('./index');
const { FriendStatus, ScorecardStatus } = require('../../lib/constants');
import {
  getUserFriendsList,
  getAllChallengesForUser,
  getChallengeDataForUser,
} from './repository';
import { expect } from 'chai';
import { createChallenge } from '../../test/helper';
import 'mocha';

describe('Repository -', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
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

  describe('#getAllChallengesForUser', () => {
    it('get all challenges and right status for user (w/ friendships saved as user)', async () => {
      const user = await User.createUser({ username: 'userA' });
      const challengeA = await createChallenge();
      const challengeB = await createChallenge({ name: 'Challenge 2'});
      await Scorecard.createScorecard({ userId: user.id, challengeId: challengeA.id, status: ScorecardStatus.DECLINED });
      await Scorecard.createScorecard({ userId: user.id, challengeId: challengeB.id });

      const challenges = await getAllChallengesForUser(user.id);

      expect(challenges.length).to.equal(2);
      expect(challenges[0].challenge).to.deep.equal(challengeB);
      expect(challenges[0].status).to.equal(ScorecardStatus.ACCEPTED);
      expect(challenges[1].challenge).to.deep.equal(challengeA);
      expect(challenges[1].status).to.equal(ScorecardStatus.DECLINED);
    });

    it('get 0 challenges for user with none', async () => {
      const user = await User.createUser({ username: 'userA' });
      const challengeA = await createChallenge();
      const challengeB = await createChallenge();

      const challenges = await getAllChallengesForUser(user.id);

      expect(challenges.length).to.equal(0);
    });
  });

  describe('#getChallengeDataForUser', () => {
    it('get challenge info and all participants with all permutations', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const userC = await User.createUser({ username: 'userC' });
      const challenge = await createChallenge();

      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userC.id, challengeId: challenge.id });

      const challengeData: any = await getChallengeDataForUser(challenge.id, userA.id);

      expect(challengeData.data).to.deep.equal(challenge);
      expect(challengeData.participants.length).to.equal(2);
      expect(challengeData.participants[0]).to.deep.equal(userC);
      expect(challengeData.participants[1]).to.deep.equal(userB);

      const challengeDataForB: any = await getChallengeDataForUser(challenge.id, userB.id);

      expect(challengeDataForB.participants.length).to.equal(2);
      expect(challengeDataForB.participants[0]).to.deep.equal(userC);
      expect(challengeDataForB.participants[1]).to.deep.equal(userA);

      const challengeDataForC: any = await getChallengeDataForUser(challenge.id, userC.id);

      expect(challengeDataForC.participants.length).to.equal(2);
      expect(challengeDataForC.participants[0]).to.deep.equal(userB);
      expect(challengeDataForC.participants[1]).to.deep.equal(userA);
    });

    it.skip('get empty challengeData for user with none', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challenge = await createChallenge();

      const challengeData: any = await getChallengeDataForUser(challenge.id, userA.id);

      expect(challengeData).to.be.undefined;
    });
  });

});
