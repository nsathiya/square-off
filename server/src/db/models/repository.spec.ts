const { User, Friendship, Challenge, Scorecard, Activity, ActivityIndicator } = require('./index');
const {
  FriendStatus,
  ScorecardStatus,
  Exercise,
} = require('../../lib/constants');
import {
  getUserFriendsList,
  getUserChallenges,
  getChallengeDetails,
  getScorecardsToUpdateForActivity,
} from './repository';
import { expect } from 'chai';
import * as chai from 'chai';
import * as moment from 'moment';
import chaiExclude from 'chai-exclude';
import { createChallenge, createActivity } from '../../test/helper';
import 'mocha';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

chai.use(chaiExclude);

describe('Repository -', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
    await Activity.truncate({ cascade: true });
    await Scorecard.truncate({ cascade: true });
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

  describe('#getUserChallenges', () => {
    it('get all challenges and right status for user (w/ friendships saved as user)', async () => {
      const user = await User.createUser({ username: 'userA' });
      const challengeA = await createChallenge();
      const challengeB = await createChallenge({ name: 'Challenge 2'});
      await Scorecard.createScorecard({ userId: user.id, challengeId: challengeA.id, status: ScorecardStatus.DECLINED });
      await Scorecard.createScorecard({ userId: user.id, challengeId: challengeB.id });

      const challenges = await getUserChallenges(user.id);

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

      const challenges = await getUserChallenges(user.id);

      expect(challenges.length).to.equal(0);
    });
  });

  describe('#getChallengeDetails', () => {
    it('get challenge details with multiple participants', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const userC = await User.createUser({ username: 'userC' });
      const challenge = await createChallenge();

      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userC.id, challengeId: challenge.id });

      const challengeData = await getChallengeDetails(challenge.id);

      expect(challengeData.data).to.deep.equal(challenge);
      expect(challengeData.participants.length).to.equal(3);
      expect(challengeData.participants[0]).to.deep.equal(userC);
      expect(challengeData.participants[1]).to.deep.equal(userB);
      expect(challengeData.participants[2]).to.deep.equal(userA);
    });

    it('get challenge details with multiple scorecards', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const userC = await User.createUser({ username: 'userC' });
      const challenge = await createChallenge();
      const scorecard = { userId: userA.id, challengeId: challenge.id, data: {score: 20} };
      const scorecard2 = { userId: userB.id, challengeId: challenge.id, data: {score: 28} };
      const scorecard3 = { userId: userC.id, challengeId: challenge.id, data: {score: 32} };
      await Scorecard.createScorecard(scorecard);
      await Scorecard.createScorecard(scorecard2);
      await Scorecard.createScorecard(scorecard3);

      const challengeData = await getChallengeDetails(challenge.id);

      const excludedFields = ['id', 'createdAt', 'updatedAt', 'status'];
      expect(challengeData.data).to.deep.equal(challenge);
      expect(challengeData.scorecards.length).to.equal(3);
      expect(challengeData.scorecards[0]).excluding(excludedFields).to.deep.equal(scorecard3);
      expect(challengeData.scorecards[1]).excluding(excludedFields).to.deep.equal(scorecard2);
      expect(challengeData.scorecards[2]).excluding(excludedFields).to.deep.equal(scorecard);
    });

    it('get challenge details with multiple activities', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const challenge = await createChallenge();
      const activity1 = await createActivity(userA.id);
      const activity2 = await createActivity(userA.id);
      const activity3 = await createActivity(userB.id);
      await ActivityIndicator.createActivityIndicator({
        activityId: activity1.id,
        challengeId: challenge.id,
      });
      await ActivityIndicator.createActivityIndicator({
        activityId: activity2.id,
        challengeId: challenge.id,
      });
      await ActivityIndicator.createActivityIndicator({
        activityId: activity3.id,
        challengeId: challenge.id,
      });

      const challengeData = await getChallengeDetails(challenge.id);

      const excludedFields = ['id', 'createdAt', 'updatedAt', 'status'];
      expect(challengeData.data).to.deep.equal(challenge);
      expect(challengeData.activities.length).to.equal(3);
      expect(challengeData.activities[0]).excluding(excludedFields).to.deep.equal(activity1);
      expect(challengeData.activities[1]).excluding(excludedFields).to.deep.equal(activity2);
      expect(challengeData.activities[2]).excluding(excludedFields).to.deep.equal(activity3);
    });

    it('get empty challengeData for user with none', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const challenge = await createChallenge();

      const challengeData = await getChallengeDetails(challenge.id);

      expect(challengeData.participants).to.be.empty;
    });
  });

  describe('#getScorecardsToUpdateForActivity', () => {
    it('get scorecards that match activity with exercise, date and user', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
      });
      const scorecards = await getScorecardsToUpdateForActivity(activity);
      expect(scorecards.length).to.equal(1);
      expect(scorecards[0].User.id).to.equal(userA.id);
      expect(scorecards[0].Challenge.id).to.equal(challenge.id);
    });
    it('activity that started after challenge end time should bring 0 scorecards', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(10, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
      });
      const scorecards = await getScorecardsToUpdateForActivity(activity);
      expect(scorecards.length).to.equal(0);
    });
    it('activity that started before challenge start time should bring 0 scorecards', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().subtract(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
      });
      const scorecards = await getScorecardsToUpdateForActivity(activity);
      expect(scorecards.length).to.equal(0);
    });
    it('activity of a different exercise should bring 0 scorecards', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      await Scorecard.createScorecard({ userId: userB.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.YOGA,
        startTime: activityStartTime,
      });
      const scorecards = await getScorecardsToUpdateForActivity(activity);
      expect(scorecards.length).to.equal(0);
    });
    it('activity of a user that doesn\'t belong to challenge should bring 0 scorecards', async () => {
      const userA = await User.createUser({ username: 'userA' });
      const userB = await User.createUser({ username: 'userB' });
      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });
      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userB.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
      });
      const scorecards = await getScorecardsToUpdateForActivity(activity);
      expect(scorecards.length).to.equal(0);
    });
    it('should bring up only the scorecards that matches', async () => {
      const userA = await User.createUser({ username: 'userA' });

      const challengeStartTime = moment.utc().format(timeFormat);
      const challengeEndTime = moment.utc().add(5, 'days').format(timeFormat);
      const challenge = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: challengeStartTime,
        end_time: challengeEndTime,
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge.id });

      const challenge1 = await createChallenge({
        exercise: Exercise.CYCLE,
        start_time: moment.utc().subtract(5, 'days').format(timeFormat),
        end_time: moment.utc().subtract(3, 'days').format(timeFormat),
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge1.id });

      const challenge2 = await createChallenge({
        exercise: Exercise.RUN,
        start_time: moment.utc().format(timeFormat),
        end_time: moment.utc().add(5, 'days').format(timeFormat),
      });
      await Scorecard.createScorecard({ userId: userA.id, challengeId: challenge2.id });

      const activityStartTime = moment.utc().add(3, 'days').format(timeFormat);
      const activity = await createActivity(userA.id, {
        exercise: Exercise.CYCLE,
        startTime: activityStartTime,
      });
      const scorecards = await getScorecardsToUpdateForActivity(activity);
      expect(scorecards.length).to.equal(1);
      expect(scorecards[0].User.id).to.equal(userA.id);
      expect(scorecards[0].Challenge.id).to.equal(challenge.id);
    });
  });

});
