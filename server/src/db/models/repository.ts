const { User, Friendship, Scorecard, Challenge } = require('./index');
import * as Sequelize from 'sequelize';
import { ChallengeStatus } from '../../lib/constants';

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
export async function getAllChallengesForUser(userId: string) {
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

/*
 includes challenge data and all participant details
 TODO redo query
*/
export async function getChallengeDataForUser(challengeId: string, userId: string) {
    const challenge = await Challenge.findOne({
      where: { id: challengeId },
      include: [
        {
          model: Scorecard,
          include: {
            model: User,
            where: {
              id: {
                [Sequelize.Op.not]: userId
              }
            }
          },
          order: [['createdAt', 'DESC']],
        }
      ],
      order: [[{ model: Scorecard }, 'createdAt', 'DESC']],
      nest: true,
    });
    const { Scorecards, ...challengeData } = challenge.get();
    return {
      data: challengeData,
      participants: Scorecards.map((scorecard) => (scorecard.User.get()))
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
