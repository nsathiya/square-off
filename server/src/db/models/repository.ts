import { omit } from 'lodash';
import * as Sequelize from 'sequelize';
const { User, Friendship, Scorecard, Challenge, Activity, ActivityIndicator } = require('./index');
import { ActivityInstance } from './activity';
import { ChallengeStatus } from '../../lib/constants';

const { Op } = Sequelize;

export async function getUserFriendsList(userId) {
    const friendships = await Friendship.findAll({
      where: {
        $or: [
          { user: userId },
          { friend: userId },
        ]
      },
      include: [
        {
          model: User,
          as: 'seeker',
        },
        {
          model: User,
          as: 'target',
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    });
    return friendships.map(friendship => ({
        status: friendship.status,
        user: friendship.seeker.id !== userId ? friendship.seeker : friendship.target
      })
    );
}

/*
  Only includes challenges for this particular user
*/
export async function getUserChallenges(userId: string) {
    const scorecards = await Scorecard.findAll({
      where: { userId },
      include: [
        { model: Challenge }
      ],
      order: [['createdAt', 'DESC']],
      nest: true,
    });
    return scorecards.map((scorecard) => ({
      challenge: scorecard.Challenge.get(),
      status: scorecard.status,
    }));
}

// TODO unit test
export async function getUserActivities(userId: string) {
    const activities = await Activity.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return activities.map((activity: any) => (activity.get()));
}

/*
 includes challenge data and all participant details
*/
export async function getChallengeDetails(challengeId: string) {
    const challenge = await Challenge.findOne({
      where: { id: challengeId },
      include: [
        {
          model: Scorecard,
          include: {
            model: User,
          },
          order: [['createdAt', 'DESC']],
        },
        {
          model: ActivityIndicator,
          include: {
            model: Activity,
          },
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [[{ model: Scorecard }, 'createdAt', 'DESC']],
      nest: true,
    });
    const { Scorecards, ActivityIndicators, ...challengeData } = challenge.get();
    return {
      data: challengeData,
      participants: Scorecards.map((scorecard) => (scorecard.User.get())),
      scorecards: Scorecards.map((scorecard) => (omit(scorecard.get(), 'User'))),
      activities: ActivityIndicators.map((activityIndicator) => (activityIndicator.Activity.get())),
    };
}


/*
TODO Not tested yet
*/
export function getAllActiveChallengesForUser(userId: string) {
    return Scorecard.findAll({
      where: { userId },
      include: [
        { model: User },
        { model: Challenge, where: { status: ChallengeStatus.ACTIVE } }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    });
}

export function getScorecardsToUpdateForActivity(activity: ActivityInstance) {
    const {userId, startTime, exercise} = activity;
    return Scorecard.findAll({
      where: { userId },
      include: [
        { model: User },
        {
          model: Challenge,
          where: {
            exercise,
            start_time: { [Op.lte]: startTime },
            end_time: { [Op.gte]: startTime },
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    });
}
